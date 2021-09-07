import * as _ from 'lodash';
import { isBefore } from 'date-fns';
import { Arg, Ctx, Field, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Context } from '../graphqlContext';
import { Types } from 'mongoose';
const { ObjectId } = Types;

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

  @Field()
  createdAt: number;
}


@ObjectType()
class GroupInfo extends GroupResult {
  @Field()
  iBelong: boolean;
}

@Resolver(() => GroupInfo)
export class GroupResolver {

  @Query(() => [OwnGroupsResult])
  async ownGroups(@Ctx() { userId, db }: Context): Promise<OwnGroupsResult[]> {
    if (!userId) {
      throw new Error('Method only available with a user');
    }

    const ownGroupsRelationship = await db.UserGroup.find({ userId: new ObjectId(userId) }).lean();
    const ownGroupsIds = ownGroupsRelationship.map(group => group.groupId)
    const ownGroups: Group[] = await db.Group.find({ _id: { $in: ownGroupsIds } })
      .sort({ updatedAt: -1 })
      .lean();
    const ownGroupsRelationshipById = new Map(ownGroupsRelationship.map(groupRelationship => [groupRelationship.groupId.toHexString(), groupRelationship]));

    return ownGroups.map((group) => {
      const groupRelationship = ownGroupsRelationshipById.get(group._id.toHexString());
      return {
        ...group,
        id: group._id.toHexString(),
        unread: isBefore(groupRelationship!.latestRead, group.updatedAt),
        pinned: groupRelationship!.pinned,
      };
    });
  }

  @Query(() => GroupInfo)
  async getGroupInfo(
    @Arg('groupId') groupId: string,
    @Ctx() { userId, db }: Context
  ): Promise<GroupInfo> {
    if (!userId) {
      throw new Error('Method only available with a user');
    }

    const group = await db.Group.findById(groupId).lean();
    if (!group) {
      throw new Error(`Group ${groupId} not found`);
    }
    const iBelong = !!await db.UserGroup.findOne({
      userId: new ObjectId(userId),
      groupId
    }).lean();
    return {
      ...group,
      id: group._id!.toHexString(),
      createdBy: group.createdBy.toHexString(),
      createdAt: group.createdAt.getTime(),
      iBelong,
    };
  }

  @Query(() => [GroupResult])
  async findGroups(
    @Arg('searchText') searchText: string,
    @Arg('limit') limit: number,
    @Arg('skip') skip: number,
    @Ctx() { userId, db }: Context
  ): Promise<GroupResult[]> {
    if (!userId) {
      throw new Error('Only logged in users can search for groups');
    }
    const trimmedSearchText = searchText.trim();
    const byFriendlyId: Group | null = await db.Group.findOne({ friendlyId: trimmedSearchText }).lean();
    if (byFriendlyId) {
      return [{
        ...byFriendlyId,
        id: byFriendlyId._id!.toHexString(),
        createdBy: byFriendlyId.createdBy.toHexString(),
        createdAt: byFriendlyId.createdAt.getTime(),
      }];
    }

    const boundedLimit = Math.min(limit, numMaxReturnedItems);
    const groups = await db.Group
      .find({ name: { $regex: trimmedSearchText, $options: 'i' }, visibility: 'PUBLIC' })
      .sort({ name: 1, createdAt: 1 })
      .limit(boundedLimit)
      .lean();
    return groups.map((group) => ({
      ...group,
      id: group._id!.toHexString(),
      createdBy: group.createdBy.toHexString(),
      createdAt: group.createdAt.getTime(),
    }));
  }

  @Mutation(() => String)
  async createGroup(
    @Arg('groupName') groupName: string,
    @Arg('visibility') visibility: string,
    @Ctx() { userId, db }: Context
  ): Promise<string> {
    if (!userId) {
      throw new Error('A user is required');
    }

    const newGroup = await db.Group.create({
      name: groupName,
      imgUrl: 'temp',
      visibility,
      createdBy: new ObjectId(userId),
    });

    await db.UserGroup.create({
      userId: new ObjectId(userId),
      groupId: newGroup._id!.toHexString(),
      pinned: true,
      latestRead: new Date(),
    });

    return 'OK';
  }

  @Mutation(() => String)
  async joinGroup(
    @Arg('groupId') groupId: string,
    @Ctx() { userId, db }: Context
  ): Promise<string> {
    const previousGroupRelationship = await db.UserGroup.findOne({
      userId: new ObjectId(userId),
      groupId,
    });
    if (previousGroupRelationship) {
      throw new Error('User already participate in the group');
    }
    await db.UserGroup.create({
      userId: new ObjectId(userId),
      groupId,
      pinned: true,
      latestRead: Date.now(),
    });
    return 'OK';
  }

  @Mutation(() => String)
  async leaveGroup(
    @Arg('groupId') groupId: string,
    @Ctx() { userId, db }: Context
  ): Promise<string> {
    const user = await db.User.findById(userId).lean();
    if (!user?.notificationToken) {
      throw new Error('Notification token required');
    }
    await db.UserGroup.deleteOne({
      userId: new ObjectId(userId),
      groupId,
    });
    
    await unsubscribeFromGroup(db, userId!, user.notificationToken, groupId);
    return 'OK';
  }

  @Mutation(() => String)
  async setGroupPin(
    @Arg('groupId') groupId: string,
    @Arg('pinned') pinned: boolean,
    @Ctx() { userId, db }: Context
  ): Promise<string> {
    const user = await db.User.findById(userId).lean();
    if (!user?.notificationToken) {
      throw new Error('Notification token required');
    }
    await db.UserGroup.updateOne({
      userId: new ObjectId(userId),
      groupId,
    }, {
      pinned,
    });
    if (pinned) {
      await subscribeToGroup(db, userId!, user.notificationToken, groupId);
    } else {
      await unsubscribeFromGroup(db, userId!, user.notificationToken, groupId);
    }
    return 'OK';
  }
}
