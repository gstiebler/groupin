import * as _ from 'lodash';
import * as moment from 'moment';
import { Types } from 'mongoose';
import Group from '../db/schema/Group';
import GroupLatestRead from '../db/schema/GroupLatestRead';
import User from '../db/schema/User';

import { numMaxReturnedItems } from '../lib/constants';

import {
  subscribeToGroup,
  unsubscribeFromGroup,
} from '../lib/subscription';

const { ObjectId } = Types;

const oldDate = moment('2015-01-01').toDate();

export async function ownGroups(args, { user }) {
  if (!user) {
    throw new Error('Method only available with a user');
  }

  const groups = await Group
    .find({ _id: { $in: _.map(user.groups, 'id') } })
    .sort({ updatedAt: -1 })
    .lean();

  const pinnedByGroupId = new Map(_.map(user.groups, (group) => [group.id.toHexString(), group.pinned]));
  const groupLatestRead = await GroupLatestRead.find({
    groupId: { $in: _.map(groups, '_id') },
    userId: user._id,
  });
  const latestReadById = _.keyBy(groupLatestRead, (l) => l.groupId.toHexString());

  return groups.map((group) => {
    const latestReadObj = latestReadById[group._id.toHexString()];
    // TODO: remove when is garanteed to have always a LatestMoment for every user/topic
    const latestReadMoment = latestReadObj ? latestReadObj.latestMoment : oldDate;
    return {
      ...group,
      id: group._id,
      unread: moment(latestReadMoment).isBefore(group.updatedAt),
      pinned: pinnedByGroupId.get(group._id.toHexString()),
    };
  });
}

export async function getGroupInfo({ groupId }, { user }) {
  if (!user) {
    throw new Error('Method only available with a user');
  }

  const group = await Group.findById(groupId, {
    friendlyId: 1,
    name: 1,
    imgUrl: 1,
    description: 1,
    visibility: 1,
    createdBy: 1,
    createdAt: 1,
  }).lean();
  const iBelong = !!_.find(user.groups, (group_) => group_.id.toHexString() === groupId);
  return {
    ...group,
    iBelong,
  };
}

export async function findGroups({ searchText, limit }, { user }) {
  if (!user) {
    throw new Error('Only logged in users can search for groups');
  }
  const trimmedSearchText = searchText.trim();
  const byFriendlyId = await Group.findOne({ friendlyId: trimmedSearchText });
  if (byFriendlyId) {
    return [byFriendlyId];
  }

  const boundedLimit = Math.min(limit, numMaxReturnedItems);
  const groups = await Group
    .find({ name: { $regex: trimmedSearchText, $options: 'i' }, visibility: 'PUBLIC' })
    .sort({ name: 1, createdAt: 1 })
    .limit(boundedLimit)
    .lean();
  return groups.map((group) => ({ ...group, id: group._id }));
}

export async function createGroup({ groupName, visibility }, { user }) {
  const newGroup = await Group.create({
    name: groupName,
    imgUrl: 'temp',
    visibility,
    createdBy: ObjectId(user._id),
  });

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

export async function joinGroup({ groupId }, { user }) {
  const hasGroup = _.find(user.groups, (g) => g.id.toHexString() === groupId);
  if (hasGroup) {
    throw new Error('User already participate in the group');
  }
  user.groups.push({ id: ObjectId(groupId) });
  await user.save();

  return 'OK';
}

export async function leaveGroup({ groupId }, { user }) {
  await User.updateOne(
    { _id: user._id },
    { $pull: { groups: { id: ObjectId(groupId) } } },
  );

  // unsubscribe user from the group on FCM
  await unsubscribeFromGroup(user, user.fcmToken, groupId);
  return 'OK';
}

export async function setGroupPin({ groupId, pinned }, { user }) {
  await User.updateOne(
    { _id: user._id, 'groups.id': ObjectId(groupId) },
    { $set: { 'groups.$.pinned': pinned } },
  );
  if (pinned) {
    await subscribeToGroup(user, user.fcmToken, groupId);
  } else {
    await unsubscribeFromGroup(user, user.fcmToken, groupId);
  }
  return 'OK';
}
