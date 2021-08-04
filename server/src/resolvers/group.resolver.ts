import * as _ from 'lodash';
import { isBefore } from 'date-fns';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Context } from '../graphqlContext';

import { numMaxReturnedItems } from '../lib/constants';

import {
  subscribeToGroup,
  unsubscribeFromGroup,
} from '../lib/subscription';
import { Group } from '../db/schema/Group';

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
class GroupResult {
  @Field()
  id: string;

  @Field()
  friendlyId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  imgUrl?: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  visibility: string;

  @Field()
  createdBy: string;
}


@ObjectType()
class GroupInfo extends GroupResult {
  @Field()
  iBelong: boolean;
}

@Resolver(() => GroupInfo)
export class GroupResolver {

  @Query(() => [OwnGroupsResult])
  async ownGroups(@Ctx() { user, db }: Context): Promise<OwnGroupsResult[]> {
    if (!user) {
      throw new Error('Method only available with a user');
    }

    const ownGroupsRelationship = await db.UserGroup.find({ userId: user.id });
    const ownGroupsIds = ownGroupsRelationship.map(group => group.groupId)
    const ownGroups = await db.Group.find({ id: { $in: ownGroupsIds } });
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
    @Ctx() { user, db }: Context
  ): Promise<GroupInfo> {
    if (!user) {
      throw new Error('Method only available with a user');
    }

    const group = await db.Group.findById(groupId);
    if (!group) {
      throw new Error(`Group ${groupId} not found`);
    }
    const iBelong = !!await db.UserGroup.findOne({
      userId: user.id,
      groupId
    });
    return {
      ...group,
      id: group.id as string,
      createdBy: group.createdBy.toHexString(),
      iBelong,
    };
  }

  @Query(() => [GroupResult])
  async findGroups(
    @Arg('searchText') searchText: string,
    @Arg('limit') limit: number,
    @Arg('skip') skip: number,
    @Ctx() { user, db }: Context
  ): Promise<GroupResult[]> {
    if (!user) {
      throw new Error('Only logged in users can search for groups');
    }
    const trimmedSearchText = searchText.trim();
    const byFriendlyId: Group | null = await db.Group.findOne({ friendlyId: trimmedSearchText });
    if (byFriendlyId) {
      return [{
        ...byFriendlyId,
        id: byFriendlyId.id,
        createdBy: byFriendlyId.createdBy.toHexString(),
      }];
    }

    const boundedLimit = Math.min(limit, numMaxReturnedItems);
    const groups = await db.Group
      .find({ name: { $regex: trimmedSearchText, $options: 'i' }, visibility: 'PUBLIC' })
      .sort({ name: 1, createdAt: 1 })
      .limit(boundedLimit);
    return groups.map((group) => ({
      ...group,
      id: group._id,
      createdBy: group.createdBy.toHexString(),
    }));
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

    const newGroup = await db.Group.create({
      name: groupName,
      imgUrl: 'temp',
      visibility,
      createdBy: user._id,
    });

    await db.UserGroup.updateOne({
      userId: user.id,
      groupId: newGroup.id,
    }, {
      pinned: true,
      latestRead: new Date(),
    });

    return 'OK';
  }

  @Mutation(() => String)
  async joinGroup(
    @Arg('groupId') groupId: string,
    @Ctx() { user, db }: Context
  ): Promise<string> {
    const previousGroupRelationship = await db.UserGroup.findOne({
      userId: user!.id,
      groupId,
    });
    if (previousGroupRelationship) {
      throw new Error('User already participate in the group');
    }
    await db.UserGroup.create({
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
    await db.UserGroup.deleteOne({
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
    await db.UserGroup.updateOne({
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
