import * as Bluebird from 'bluebird';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Like } from 'typeorm';
import { Group } from '../db/entity/Group';
import { Context } from '../graphqlContext';

import { numMaxReturnedItems } from '../lib/constants';

import {
  subscribeToGroup,
  unsubscribeFromGroup,
} from '../lib/subscription';

@ObjectType()
class OwnGroupsResult {
  @Field()
  id: string;

  @Field()
  unread: boolean;

  @Field()
  pinned: boolean;

  @Field()
  name: string;

  @Field({ nullable: true })
  imgUrl?: string;
}

@InputType()
class FindGroupsInput {
  @Field()
  searchText: string;
  

  @Field()
  limit: number;
}

@ObjectType()
class GroupInfo extends Group {
  @Field()
  iBelong: boolean;
}

@Resolver(() => Group)
export class GroupResolver {

  @Query(() => [OwnGroupsResult])
  async ownGroups(args, @Ctx() { user }: Context): Promise<OwnGroupsResult[]> {
    if (!user) {
      throw new Error('Method only available with a user');
    }

    const ownGroups = await user.joinedGroups;

    const ownGroupsById = new Map(_.map(ownGroups, (group) => [group.id, group]));

    return Bluebird.map(ownGroups, async (userGroup) => {
      const groupRelationship = ownGroupsById.get(userGroup.id)!;
      const group = await userGroup.group;
      return {
        ...userGroup,
        name: group.description,
        id: userGroup.id,
        unread: moment(groupRelationship.latestRead).isBefore(userGroup.updatedAt),
        pinned: groupRelationship.pinned,
      };
    });
  }

  @Query(() => GroupInfo)
  async getGroupInfo(
    @Arg('groupId') groupId: string,
    @Ctx() { user, db }: Context): Promise<GroupInfo> {
    if (!user) {
      throw new Error('Method only available with a user');
    }

    const group = await db.groupRepository.findOneOrFail(groupId)
    const iBelong = !!_.find(await user.joinedGroups, (group_) => group_.id === groupId);
    return {
      ...group,
      iBelong,
    };
  }

  @Query(() => [Group])
  async findGroups(
    @Arg('findGroupsInput') { searchText, limit }: FindGroupsInput,
    @Ctx() { user, db }: Context
  ): Promise<Group[]> {
    if (!user) {
      throw new Error('Only logged in users can search for groups');
    }
    const trimmedSearchText = searchText.trim();
    const byFriendlyId = await db.groupRepository.findOne({ friendlyId: trimmedSearchText });
    if (byFriendlyId) {
      return [byFriendlyId];
    }

    const boundedLimit = Math.min(limit, numMaxReturnedItems);
    const groups = await db.groupRepository
      .find({
        where: {
          name: Like(`%${trimmedSearchText}%`),
          visibility: 'PUBLIC'
        },
        take: boundedLimit
      });
    return groups;
  }

  @Mutation(() => String)
  async createGroup(
    @Arg('groupName') groupName: string,
    @Arg('visibility') visibility: string,
    @Ctx() { user, db }: Context
  ): Promise<string> {
    if (!user) {
      throw new Error('A user is required');
    }
    const newGroup = await db.groupRepository.save({
      name: groupName,
      imgUrl: 'temp',
      visibility,
      createdById: user.id,
    });

    await db.userGroupRepository.update({
      userId: user.id,
      groupId: newGroup.id,
    }, {
      pinned: true,
      latestRead: Date.now(),
    });

    return 'OK';
  }

  @Mutation(() => String)
  async joinGroup(
    @Arg('groupId') groupId: string,
    @Ctx() { user, db }: Context
  ): Promise<string> {
    const previousGroupRelationship = await db.userGroupRepository.findOne({
      userId: user!.id,
      groupId,
    });
    if (previousGroupRelationship) {
      throw new Error('User already participate in the group');
    }
    await db.userGroupRepository.save({
      userId: user!.id,
      groupId,
      pinned: true,
      latestRead: Date.now(),
    });
    return 'OK';
  }

  @Mutation(() => String)
  async leaveGroup(
    @Arg('groupId') groupId: string,
    @Ctx() { user, db }: Context
  ): Promise<string> {
    await db.userGroupRepository.delete({
      userId: user!.id,
      groupId,
    });

    // unsubscribe user from the group on FCM
    await unsubscribeFromGroup(db, user!, user?.notificationToken, groupId);
    return 'OK';
  }

  @Mutation(() => String)
  async setGroupPin(
    @Arg('groupId') groupId: string,
    @Arg('pinned') pinned: boolean,
    @Ctx() { user, db }: Context
  ): Promise<string> {
    await db.userGroupRepository.update({
      userId: user!.id,
      groupId,
    }, {
      pinned,
    });
    if (pinned) {
      await subscribeToGroup(db, user!, user?.notificationToken, groupId);
    } else {
      await unsubscribeFromGroup(db, user!, user?.notificationToken, groupId);
    }
    return 'OK';
  }
}
