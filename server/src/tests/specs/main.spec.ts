import * as _ from 'lodash';
import { setCurrentUser, connnectionContextPromise } from '../setup';
import pushService from '../../lib/pushService';
import userFixtures from '../fixtures/userFixtures';
import groupFixtures from '../fixtures/groupFixtures';
import topicFixtures from '../fixtures/topicFixtures';
import { initFixtures } from '../fixtures/fixturesInit';
import messageFixtures from '../fixtures/messageFixtures';
import { messageTypes } from '../../lib/constants';
import { ConnCtx } from '../../db/ConnectionContext';
import { addSeconds } from 'date-fns';
import { FeGroupInfo, GroupStore } from '../../mobile/stores/groupStore';
import { GroupSearchStore } from '../../mobile/stores/groupSearchStore';
import { RootStore } from '../../mobile/stores/rootStore';
import * as server from '../../mobile/lib/server';
import { User } from '../../db/schema/User';
import { Message } from '../../db/schema/Message';
import { MessageResult } from '../../resolvers/message.resolver';
import { GiMessage } from '../../mobile/lib/messages';
import { IStorage } from '../../mobile/types/Storage.types';
import { groupIds, topicIds, userIds } from '../fixtures/preIds';
import { Types } from 'mongoose';
import { TopicStore } from '../../mobile/stores/topicStore';
import userGroups from '../fixtures/userGroup.fixtures';
const { ObjectId } = Types;


function createMessages(numMessages: number, user: Partial<User>, topicId: string) {
  const messages: Message[] = [];
  const baseMoment = new Date();
  for (let i = 0; i < numMessages; i++) {
    messages.push({
      _id: new ObjectId(),
      text: `Message ${i}`,
      userId: user._id!,
      topicId: new ObjectId(topicId),
      createdAt: addSeconds(baseMoment, 3)
    });
  }
  return _.reverse(messages);
}

function createStorage(): IStorage {
  const messagesByTopic = new Map<string, GiMessage[]>();
  return {
    async getMessages(topicId: string) { return messagesByTopic.get(topicId) ?? []; },
    async setMessages(topicId: string, messages: GiMessage[]) { messagesByTopic.set(topicId, messages); },
  };
}

// TODO: test thrown exceptions

describe('main', () => {
  let db: ConnCtx;

  beforeAll(async () => {
    db = await connnectionContextPromise;
  });

  it('hello', async () => {
    const result = await server.getHello('foca');
    expect(result).toEqual('OK');
  })

  describe('reading', () => {
    const messages50 = createMessages(50, userFixtures.robert, topicFixtures.topic1Group2._id!.toHexString());
    const localMessages50: Partial<GiMessage>[] = messages50.map(message => ({
      _id: message._id.toHexString(),
      text: message.text,
    }));

    beforeAll(async () => {
      await initFixtures(db);
      await db.Message.insertMany(messages50);
    });

    beforeEach(() => {
      pushService.subscribe = jest.fn();
      pushService.unsubscribe = jest.fn();
    });

    it('getUserId', async () => {
      setCurrentUser(userFixtures.robert);
      const userId = await server.getUserId();
      expect(userId).toEqual(userFixtures.robert._id?.toHexString());
    });

    it('getOwnGroups', async () => {
      setCurrentUser(userFixtures.robert);
      const groupStore = new GroupStore();
      await groupStore.fetchOwnGroups();
      expect(groupStore.ownGroups).toEqual([
        {
          id: groupFixtures.firstGroup._id?.toHexString(),
          name: 'First Group',
          imgUrl: 'url1',
          unread: false,
          pinned: false,
        },
        {
          id: groupFixtures.secondGroup._id?.toHexString(),
          name: 'Second Group',
          imgUrl: 'url2',
          unread: true,
          pinned: true,
        },
      ]);
    });

    it('findGroups', async () => {
      setCurrentUser(userFixtures.robert);
      const groupsSearchActions = new GroupSearchStore();
      await groupsSearchActions.findGroups('second');
      expect(groupsSearchActions.groups).toEqual([
        {
          id: groupFixtures.secondGroup._id?.toHexString(),
          name: 'Second Group',
          imgUrl: 'url2',
        },
      ]);
    });

    it('find by friendlyId', async () => {
      setCurrentUser(userFixtures.robert);
      const groupsSearchActions = new GroupSearchStore();
      await groupsSearchActions.findGroups('  S9hvTvIBWM ');
      expect(groupsSearchActions.groups).toEqual([
        {
          id: groupFixtures.firstGroup._id?.toHexString(),
          name: 'First Group',
          imgUrl: 'url1',
        },
      ]);
    });

    it('getTopicsOfGroup', async () => {
      setCurrentUser(userFixtures.robert);
      const groupStore = new GroupStore();
      const rootStore = new RootStore(createStorage(), groupStore);
      await rootStore.getTopicsOfGroup(groupFixtures.firstGroup._id!.toHexString());
      expect(rootStore.topics).toEqual([
        {
          id: topicFixtures.topic1Group1._id!.toHexString(),
          name: 'Topic 1 Group 1',
          imgUrl: 't1g1_url',
          unread: true,
          pinned: false,
        },
        {
          id: topicFixtures.topic2Group1._id!.toHexString(),
          name: 'Topic 2 Group 1',
          imgUrl: 't2g1_url',
          unread: true,
          pinned: true,
        },
      ]);
    });

    it('getTopicsOfCurrentGroup', async () => {
      setCurrentUser(userFixtures.robert);
      const groupStore = new GroupStore();
      const rootStore = new RootStore(createStorage(), groupStore);
      rootStore.currentlyViewedGroupId = groupFixtures.firstGroup._id!.toHexString();
      await rootStore.getTopicsOfCurrentGroup();
      expect(rootStore.topics).toEqual([
        {
          id: topicFixtures.topic1Group1._id!.toHexString(),
          name: 'Topic 1 Group 1',
          imgUrl: 't1g1_url',
          unread: true,
          pinned: false,
        },
        {
          id: topicFixtures.topic2Group1._id!.toHexString(),
          name: 'Topic 2 Group 1',
          imgUrl: 't2g1_url',
          unread: true,
          pinned: true,
        },
      ]);
    });

    describe('onTopicOpened', () => {
      it('no messages on storage', async () => {
        const topicIdStr = topicFixtures.topic1Group1._id?.toHexString()!;
        setCurrentUser(userFixtures.robert);
        const storage = createStorage();
        const groupStore = new GroupStore();
        const rootStore = new RootStore(storage, groupStore);
        await rootStore.topicStore.onTopicOpened({
          topicId: topicIdStr,
          topicName: 'name',
          storage,
          subscribeFn: jest.fn(),
        });
        const expectedMessages: MessageResult[] = [
          {
            _id: messageFixtures.message1topic1._id!.toHexString(),
            createdAt: Date.parse('2018-10-01'),
            text: 'Topic 1 Group 1 Alice',
            user: {
              _id: userFixtures.alice._id!.toHexString(),
              name: 'Alice',
              avatar: 'alice_url',
            },
          },
          {
            _id: messageFixtures.message2topic1._id!.toHexString(),
            createdAt: Date.parse('2018-10-02'),
            text: 'Topic 1 Group 1 Robert',
            user: {
              _id: userFixtures.robert._id!.toHexString(),
              name: 'Robert',
              avatar: 'robert_url',
            },
          },
        ]
        const expectedMessagesReversed = _.reverse(expectedMessages);
        expect(rootStore.messages).toEqual(expectedMessagesReversed);
        expect(await storage.getMessages(topicIdStr)).toEqual(expectedMessagesReversed);
      });

      it('3 extra messages to be fetched', async () => {
        const topicIdStr = topicFixtures.topic1Group2._id!.toHexString();
        setCurrentUser(userFixtures.robert);
        const storage = createStorage();
        await storage.setMessages(topicIdStr, localMessages50.slice(4, 24) as GiMessage[]);
        const groupStore = new GroupStore();
        const rootStore = new RootStore(storage, groupStore);
        await rootStore.topicStore.onTopicOpened({
          topicId: topicIdStr,
          topicName: 'name',
          storage,
          subscribeFn: jest.fn(),
        });

        // store messages
        const storeMessageTexts = _.reverse(_.map(rootStore.messages, 'text'));
        expect(storeMessageTexts).toHaveLength(24);
        expect(storeMessageTexts[0]).toEqual('Message 26');
        expect(storeMessageTexts[19]).toEqual('Message 45');
        expect(storeMessageTexts[20]).toEqual('Message 46');
        expect(storeMessageTexts[21]).toEqual('Message 47');
        expect(storeMessageTexts[22]).toEqual('Message 48');
        expect(storeMessageTexts[23]).toEqual('Message 49');

        // storage messages
        const storageMessageTexts = _.reverse(_.map(await storage.getMessages(topicIdStr), 'text'));
        expect(storageMessageTexts).toHaveLength(20);
        expect(storageMessageTexts[0]).toEqual('Message 30');
        expect(storageMessageTexts[15]).toEqual('Message 45');
        expect(storageMessageTexts[16]).toEqual('Message 46');
        expect(storageMessageTexts[17]).toEqual('Message 47');
        expect(storageMessageTexts[18]).toEqual('Message 48');
        expect(storageMessageTexts[19]).toEqual('Message 49');
      });
      it('hole between fetched and on storage', async () => {
        const topicIdStr = topicFixtures.topic1Group2._id!.toHexString();
        setCurrentUser(userFixtures.robert);
        const storage = createStorage();
        await storage.setMessages(topicIdStr, localMessages50.slice(25, 44) as GiMessage[]);
        const rootActions = new RootStore(storage, new GroupStore());
        await rootActions.topicStore.onTopicOpened({
          topicId: topicIdStr,
          topicName: 'name',
          storage,
          subscribeFn: jest.fn(),
        });

        // store messages
        const storeMessageTexts = _.reverse(_.map(rootActions.messages, 'text'));
        expect(storeMessageTexts).toHaveLength(20);
        expect(storeMessageTexts[0]).toEqual('Message 30');
        expect(storeMessageTexts[1]).toEqual('Message 31');
        expect(storeMessageTexts[18]).toEqual('Message 48');
        expect(storeMessageTexts[19]).toEqual('Message 49');

        // storage messages
        const storageMessageTexts = _.reverse(_.map(await storage.getMessages(topicIdStr), 'text'));
        expect(storageMessageTexts).toHaveLength(20);
        expect(storageMessageTexts[0]).toEqual('Message 30');
        expect(storageMessageTexts[15]).toEqual('Message 45');
        expect(storageMessageTexts[16]).toEqual('Message 46');
        expect(storageMessageTexts[17]).toEqual('Message 47');
        expect(storageMessageTexts[18]).toEqual('Message 48');
        expect(storageMessageTexts[19]).toEqual('Message 49');
      });
    });

    it('onOlderMessagesRequested', async () => {
      const topicIdStr = topicFixtures.topic1Group2._id!.toHexString();
      setCurrentUser(userFixtures.robert);
      const rootStore = new RootStore(createStorage(), new GroupStore());
      rootStore.messages = localMessages50.slice(0, 5) as GiMessage[];
      await rootStore.onOlderMessagesRequested(topicIdStr);

      // store messages
      const storeMessageTexts = _.reverse(_.map(rootStore.messages, 'text'));
      expect(storeMessageTexts).toHaveLength(25);
      expect(storeMessageTexts[0]).toEqual('Message 25');
      expect(storeMessageTexts[1]).toEqual('Message 26');
      expect(storeMessageTexts[18]).toEqual('Message 43');
      expect(storeMessageTexts[19]).toEqual('Message 44');
      expect(storeMessageTexts[20]).toEqual('Message 45');
      expect(storeMessageTexts[21]).toEqual('Message 46');
      expect(storeMessageTexts[22]).toEqual('Message 47');
      expect(storeMessageTexts[23]).toEqual('Message 48');
      expect(storeMessageTexts[24]).toEqual('Message 49');
    });

    it('getMessagesOfCurrentTopic', async () => {
      setCurrentUser(userFixtures.robert);
      const storage = createStorage();
      const rootStore = new RootStore(storage, new GroupStore());
      rootStore.currentlyViewedTopicId = topicFixtures.topic1Group1._id!.toHexString();
      await rootStore.getMessagesOfCurrentTopic();
      expect(rootStore.messages).toEqual(_.reverse([
        {
          _id: messageFixtures.message1topic1._id!.toHexString(),
          createdAt: Date.parse('2018-10-01'),
          text: 'Topic 1 Group 1 Alice',
          user: {
            _id: userFixtures.alice._id!.toHexString(),
            name: 'Alice',
            avatar: 'alice_url',
          },
        },
        {
          _id: messageFixtures.message2topic1._id!.toHexString(),
          createdAt: Date.parse('2018-10-02'),
          text: 'Topic 1 Group 1 Robert',
          user: {
            _id: userFixtures.robert._id!.toHexString(),
            name: 'Robert',
            avatar: 'robert_url',
          },
        },
      ]));
    });

    it('getGroupInfo', async () => {
      const groupId = groupFixtures.firstGroup._id!.toHexString();
      setCurrentUser(userFixtures.robert);
      const groupActions = new GroupStore();
      await groupActions.getGroupInfo(groupId);
      expect(groupActions.currentGroupInfo).toEqual({
        id: groupIds.firstGroup.toHexString(),
        name: 'First Group',
        imgUrl: 'url1',
        description: 'Description of the first group',
        visibility: 'PUBLIC',
        visibilityLabel: 'Público',
        friendlyId: 'S9hvTvIBWM',
        createdBy: userIds.alice.toHexString(),
        createdAt: groupFixtures.firstGroup.createdAt!.getTime(),
        iBelong: true,
      });
    });
  });

  describe('writting', () => {
    beforeEach(async () => {
      pushService.pushMessage = jest.fn();
      pushService.subscribe = jest.fn();
      pushService.unsubscribe = jest.fn();
      await initFixtures(db);
    });

    it('register', async () => {
      setCurrentUser(null);
      const uid = 'dk49sdfjhk';
      const result = await server.register('Guilherme');

      const userByUid = await db.User.findById(result.id).lean();
      expect(userByUid!.name).toBe('Guilherme');
      expect(userByUid!.externalId).toBe(uid);
    });
    describe('sendMessage', () => {
      const { alice } = userFixtures;
      const messageText = 'new message 1 from Alice';
      const topicId = topicFixtures.topic1Group1._id!.toHexString();
      let rootStore: RootStore;

      beforeEach(async () => {
        setCurrentUser(alice);
        rootStore = new RootStore(createStorage(), new GroupStore());
        rootStore.topicStore.topicId = topicId;
        await rootStore.sendMessages([{ text: messageText } as GiMessage]);
      });

      it('push', async () => {
        const call0args = (pushService.pushMessage as any).mock.calls[0];
        expect(call0args).toHaveLength(2);
        const [, pushParams] = call0args;
        expect(topicId).toBe(topicFixtures.topic1Group1._id!.toHexString());
        const createdMessage = await db.Message.findOne({}, {}, { sort: { _id: -1 } });
        expect(pushParams).toEqual({
          payload: {
            message: messageText,
            topicId: topicFixtures.topic1Group1._id!.toHexString(),
            groupId: groupFixtures.firstGroup._id!.toHexString(),
            messageId: createdMessage!._id!.toHexString(),
            authorName: alice.name,
            topicName: 'Topic 1 Group 1',
            type: messageTypes.NEW_MESSAGE,
          },
          body: messageText,
          title: 'Topic 1 Group 1',
          sendNotification: true,
        });

        const call1args = (pushService.pushMessage as any).mock.calls[1];
        const [groupId] = call1args;
        expect(groupId).toBe(groupFixtures.firstGroup._id!.toHexString());

        expect(rootStore.messages).toHaveLength(1);
      });

      it('message was added to DB', async () => {
        const messages = await server.getMessagesOfTopic({
          topicId: topicFixtures.topic1Group1._id!.toHexString(),
          limit: 20,
          afterId: '507f1f77bcf86cd799439002',
        });
        expect(messages).toEqual(expect.arrayContaining([
          expect.objectContaining({
            text: messageText,
            user: expect.objectContaining({
              avatar: userFixtures.alice.imgUrl,
              name: userFixtures.alice.name,
            }),
          }),
        ]));
      });

      it('sendMessage, filtering by `startingId`', async () => {
        const messages = await server.getMessagesOfTopic({
          topicId: topicFixtures.topic1Group1._id!.toHexString(),
          limit: 20,
        });
        expect(messages).toHaveLength(3);
        // the most recent message
        expect(messages[0]).toEqual(expect.objectContaining({
          text: messageText,
          user: expect.objectContaining({
            name: 'Alice',
          }),
        }));
      });

      it('topic sort order', async () => {
        const topics = await server.getTopicsOfGroup(groupFixtures.firstGroup._id!.toHexString(), 20, topicIds.topic2Group1.toHexString());
        expect(_.map(topics, 'name')).toEqual(['Topic 1 Group 1']);
      });
    });

    describe('createTopic', () => {
      const topicName = 'new topic foca';

      beforeAll(() => {
        setCurrentUser(userFixtures.robert);
      });

      beforeEach(async () => {
        setCurrentUser(userFixtures.robert);
        const secondGroupId = groupFixtures.secondGroup._id!.toHexString();
        const rootStore = new RootStore(createStorage(), new GroupStore());
        const topicStore = new TopicStore(rootStore);
        await topicStore.createTopic({ groupId: secondGroupId, name: topicName });
      });

      it('push', async () => {
        const [topic, pushParams] = (pushService.pushMessage as any).mock.calls[0];
        expect(topic).toBe('notificationTokenRobert');
        const newTopic = await db.Topic.findOne({}, {}, { sort: { _id: -1 } });
        expect(pushParams).toEqual({
          payload: {
            type: messageTypes.NEW_TOPIC,
            topicId: newTopic!._id!.toHexString(),
            groupId: groupFixtures.secondGroup._id!.toHexString(),
            topicName,
          },
          body: topicName,
          title: 'Novo tópico',
          sendNotification: true,
        });
      });

      it('topic created on DB', async () => {
        const topics = await server.getTopicsOfGroup(groupFixtures.secondGroup._id!.toHexString(), 20);
        expect(topics).toHaveLength(3);
        // test order
        expect(_.map(topics, 'name')).toEqual([topicName, 'Topic 2 Group 2', 'Topic 1 Group 2']);
      });

      it('group sort order', async () => {
        const groups = await server.getOwnGroups();
        expect(_.map(groups, 'name')).toEqual(['Second Group', 'First Group']);
      });
    });

    it('createGroup', async () => {
      setCurrentUser(userFixtures.robert);
      const result = await server.createGroup({ groupName: 'new group 1', visibility: 'SECRET' });
      expect(result).toBe('OK');
      const groups = await server.getOwnGroups();
      expect(groups).toHaveLength(3);
      expect(groups[0].name).toBe('new group 1');
    });

    it('leaveGroup', async () => {
      setCurrentUser(userFixtures.robert);
      const groupId = groupIds.firstGroup.toHexString();
      const groupStore = new GroupStore();
      await groupStore.leaveGroup(groupId);
      const groups = await server.getOwnGroups();
      const [unsubscribedUserToken, unsubscribedGroup] = (pushService.unsubscribe as any).mock.calls[0];
      expect(unsubscribedUserToken).toBe(userFixtures.robert.notificationToken);
      expect(unsubscribedGroup).toBe(groupId);
      expect(groups).toEqual([
        {
          id: groupFixtures.secondGroup._id!.toHexString(),
          imgUrl: 'url2',
          name: 'Second Group',
          unread: true,
          pinned: true,
        },
      ]);
      expect(groupStore.ownGroups).toEqual([
        {
          id: groupFixtures.secondGroup._id!.toHexString(),
          imgUrl: 'url2',
          name: 'Second Group',
          unread: true,
          pinned: true,
        },
      ]);
    });

    describe('joinGroup', () => {
      it('User already joined the group', async () => {
        expect.assertions(1);
        setCurrentUser(userFixtures.alice);
        const groupId = groupFixtures.firstGroup._id!.toHexString();
        const groupStore = new GroupStore();
        groupStore.currentGroupInfo = {
          id: groupId,
        } as FeGroupInfo;
        try {
          await groupStore.joinGroup();
        } catch (error) {
          expect(error.message).toEqual('User already participate in the group');
        }
      });

      it('joined group', async () => {
        setCurrentUser(userFixtures.alice);
        const groupId = groupFixtures.secondGroup._id!.toHexString();
        await server.joinGroup(groupId);
        const groups = await server.getOwnGroups();
        expect(groups).toHaveLength(2);
        expect(groups[1].name).toBe('Second Group');
      });
    });

    it('updateNotificationToken', async () => {
      setCurrentUser(userFixtures.robert);
      const notificationToken = 'robertFcmToken345873';
      await server.updateNotificationToken(notificationToken);
      const robert = await db.User.findById(userFixtures.robert._id);
      expect(robert!.notificationToken).toBe(notificationToken);

      const [subscribedNotificationToken, firstSubscribedGroupId] = (pushService.subscribe as any).mock.calls[0];
      expect(subscribedNotificationToken).toBe(notificationToken);
      expect(firstSubscribedGroupId).toBe(userGroups[2].groupId!.toHexString());
    });


/*



    it('setTopicLatestRead', async () => {
      setCurrentUser(userFixtures.robert);

      // Create
      const firstCount = await TopicLatestRead.countDocuments();
      const result1 = await server.setTopicLatestRead(topicFixtures.topic1Group1.id);
      expect(result1).toBe('OK');
      const secoundCount = await TopicLatestRead.countDocuments();
      expect(secoundCount - firstCount).toBe(1);

      // Update
      const result2 = await server.setTopicLatestRead(topicFixtures.topic1Group1.id);
      expect(result2).toBe('OK');
      const thirdCount = await TopicLatestRead.countDocuments();
      expect(thirdCount - secoundCount).toBe(0);
    });

    describe('setGroupPin', () => {
      it('pin', async () => {
        setCurrentUser(userFixtures.robert);
        const groupId = groupFixtures.firstGroup.id;
        await server.setGroupPin({
          groupId,
          pinned: true,
        });

        const user = await User.findById(userFixtures.robert._id);
        expect(user.groups[0].pinned).toBe(true);
        const [, groupIdP] = pushService.subscribe.mock.calls[0];
        expect(groupIdP).toBe(groupId);
      });

      it('unpin', async () => {
        setCurrentUser(userFixtures.robert);
        const groupId = groupFixtures.secondGroup.id;
        await server.setGroupPin({
          groupId,
          pinned: false,
        });

        const user = await User.findById(userFixtures.robert._id);
        expect(user.groups[1].pinned).toBe(false);
        const [, groupIdP] = pushService.unsubscribe.mock.calls[0];
        expect(groupIdP).toBe(groupId);
      });
    });

    describe('setTopicPin', () => {
      it('pin', async () => {
        setCurrentUser(userFixtures.robert);
        const topicId = topicFixtures.topic2Group2.id;
        await server.setTopicPin({
          topicId,
          pinned: true,
        });

        const user = await User.findById(userFixtures.robert._id);
        expect(user.pinnedTopics[2].toHexString()).toBe(topicId);
        const [, topicIdP] = pushService.subscribe.mock.calls[0];
        expect(topicIdP).toBe(topicId);
      });

      it('unpin', async () => {
        setCurrentUser(userFixtures.robert);
        const topicId = topicFixtures.topic1Group2.id;
        await server.setTopicPin({
          topicId,
          pinned: false,
        });

        const user = await User.findById(userFixtures.robert._id);
        expect(user.pinnedTopics).toHaveLength(1);
        const [, topicIdP] = pushService.unsubscribe.mock.calls[0];
        expect(topicIdP).toBe(topicId);
      });
    });
  */
  });
});
