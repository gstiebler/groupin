import * as _ from 'lodash';
import { isBefore } from 'date-fns';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { ILike, In } from 'typeorm';
import { Group } from '../db/entity/Group.entity';
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

@ObjectType()
class GroupInfo extends Group {
  @Field()
  iBelong: boolean;
}

@Resolver(() => Group)
export class GroupResolver {

  @Query(() => [OwnGroupsResult])
  async ownGroups(@Ctx() { user, db }: Context): Promise<OwnGroupsResult[]> {
    if (!user) {
      throw new Error('Method only available with a user');
    }

    const ownGroupsRelationship = await db.userGroupRepository.find({ userId: user.id });
    const ownGroupsIds = ownGroupsRelationship.map(group => group.groupId)
    const ownGroups = await db.groupRepository.find({ id: In(ownGroupsIds) });
    const ownGroupsById = new Map(ownGroups.map(group => [group.id, group]));

    return _.map(ownGroupsRelationship, (userGroup) => {
      const group = ownGroupsById.get(userGroup.groupId)!;
      return {
        name: group.name,
        id: group.id,
        imgUrl: group.imgUrl,
        unread: isBefore(userGroup.latestRead, group.updatedAt),
        pinned: userGroup.pinned,
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
    const iBelong = !!await db.userGroupRepository.findOne({
      userId: user?.id,
      groupId
    });
    return {
      ...group,
      iBelong,
    };
  }

  @Query(() => [Group])
  async findGroups(
    @Arg('searchText') searchText: string,
    @Arg('limit') limit: number,
    @Arg('skip') skip: number,
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
          name: ILike(`%${trimmedSearchText}%`),
          visibility: 'PUBLIC'
        },
        take: boundedLimit,
        skip
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
    if (!user!.notificationToken) {
      throw new Error('Notification token required');
    }
    await db.userGroupRepository.delete({
      userId: user!.id,
      groupId,
    });
    
    await unsubscribeFromGroup(db, user!, user!.notificationToken, groupId);
    return 'OK';
  }

  @Mutation(() => String)
  async setGroupPin(
    @Arg('groupId') groupId: string,
    @Arg('pinned') pinned: boolean,
    @Ctx() { user, db }: Context
  ): Promise<string> {
    if (!user!.notificationToken) {
      throw new Error('Notification token required');
    }
    await db.userGroupRepository.update({
      userId: user!.id,
      groupId,
    }, {
      pinned,
    });
    if (pinned) {
      await subscribeToGroup(db, user!, user!.notificationToken, groupId);
    } else {
      await unsubscribeFromGroup(db, user!, user!.notificationToken, groupId);
    }
    return 'OK';
  }
}
