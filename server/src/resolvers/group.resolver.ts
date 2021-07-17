import * as _ from 'lodash';
import * as moment from 'moment';
import { Resolver } from 'type-graphql';
import { In, Like } from 'typeorm';
import { Group } from '../db/entity/Group';
import { GroupLatestRead } from '../db/entity/GroupLatestRead';
import { Context } from '../graphqlContext';

import { numMaxReturnedItems } from '../lib/constants';

import {
  subscribeToGroup,
  unsubscribeFromGroup,
} from '../lib/subscription';

const oldDate = moment('2015-01-01').toDate();


@Resolver(() => Group)
export class RootResolver {

  async ownGroups(args, { user, db }: Context) {
    if (!user) {
      throw new Error('Method only available with a user');
    }

    const groups = await user.joinedGroups;
    const joinedGroupIds = _.map(groups, group => group.id);

    const pinnedByGroupId = new Map(_.map(groups, (group) => [group.id, group.pinned]));
    const groupLatestRead = await db.getRepository(GroupLatestRead).find({ 
      where: {
        groupId: In(joinedGroupIds),
        userId: user.id,
      }
    });
    const latestReadById = _.keyBy(groupLatestRead, (l) => l.groupId);

    return groups.map((group) => {
      const latestReadObj = latestReadById[group.id];
      // TODO: remove when is garanteed to have always a LatestMoment for every user/topic
      const latestReadMoment = latestReadObj ? latestReadObj.latestMoment : oldDate;
      return {
        ...group,
        id: group.id,
        unread: moment(latestReadMoment).isBefore(group.updatedAt),
        pinned: pinnedByGroupId.get(group.id),
      };
    });
  }

  async getGroupInfo({ groupId }, { user, db }: Context) {
    if (!user) {
      throw new Error('Method only available with a user');
    }

    const group = await db.getRepository(Group).findOne(groupId)
    const iBelong = !!_.find(await user.joinedGroups, (group_) => group_.id === groupId);
    return {
      ...group,
      iBelong,
    };
  }

  async findGroups({ searchText, limit }, { user, db }: Context) {
    if (!user) {
      throw new Error('Only logged in users can search for groups');
    }
    const trimmedSearchText = searchText.trim();
    const byFriendlyId = await db.getRepository(Group).findOne({ friendlyId: trimmedSearchText });
    if (byFriendlyId) {
      return [byFriendlyId];
    }

    const boundedLimit = Math.min(limit, numMaxReturnedItems);
    const groups = await db.getRepository(Group)
      .find({
        where: {
          name: Like(`%${trimmedSearchText}%`),
          visibility: 'PUBLIC'
        },
        take: boundedLimit
      });
    return groups;
  }
/*
  async createGroup({ groupName, visibility }, { user, db }: Context) {
    const newGroup = await db.getRepository(Group).save({
      description: groupName,
      imgUrl: 'temp',
      visibility,
      createdBy: user?.id,
    });

    // TODO: pin added group
    await User.updateOne(
      { _id: ObjectId(user._id) },
      {
        $push: {
          groups: {
            id: newGroup._id,
            pinned: false,
          },
        },
      },
    );

    // TODO: add groupLatestRead

    return 'OK';
  }

  async joinGroup({ groupId }, { user, db }: Context) {
    const hasGroup = _.find(user.groups, (g) => g.id.toHexString() === groupId);
    if (hasGroup) {
      throw new Error('User already participate in the group');
    }
    user.groups.push({ id: ObjectId(groupId) });
    await user.save();
    return 'OK';
  }

  async leaveGroup({ groupId }, { user, db }: Context) {
    await User.updateOne(
      { _id: user._id },
      { $pull: { groups: { id: ObjectId(groupId) } } },
    );

    // unsubscribe user from the group on FCM
    await unsubscribeFromGroup(user, user?.notificationToken, groupId);
    return 'OK';
  }

  async setGroupPin({ groupId, pinned }, { user, db }: Context) {
    await User.updateOne(
      { _id: user._id, 'groups.id': ObjectId(groupId) },
      { $set: { 'groups.$.pinned': pinned } },
    );
    if (pinned) {
      await subscribeToGroup(user, user?.notificationToken, groupId);
    } else {
      await unsubscribeFromGroup(user, user?.notificationToken, groupId);
    }
    return 'OK';
  }
*/

}
