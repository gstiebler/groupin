import * as _ from 'lodash';
import { setup, setCurrentUser, connnectionContextPromise } from '../setup';
import pushService from '../../lib/pushService';
import userFixtures from '../fixtures/userFixtures';
import groupFixtures from '../fixtures/groupFixtures';
import topicFixtures from '../fixtures/topicFixtures';
import messageFixtures from '../fixtures/messageFixtures';
import { groupIds } from '../fixtures/preIds';
import { messageTypes } from '../../lib/constants';
import { User } from '../../db/entity/User.entity';
import { Topic } from '../../db/entity/Topic.entity';
import { Message } from '../../db/entity/Message.entity';
import { v4 as uuidv4 } from 'uuid';
import { initFixtures } from '../fixtures/fixtureHelper';
import { ConnCtx } from '../../db/ConnectionContext';


function createMessages(numMessages: number, user: Partial<User>, topic: Partial<Topic>) {
  const messages: Message[] = [];
  const baseMoment = moment();
  for (let i = 0; i < numMessages; i++) {
    messages.push({
      id: uuidv4(),
      text: `Message ${i}`,
      user,
      topic,
      createdAt: baseMoment.add(3, 'seconds').valueOf(),
    });
  }
  return _.reverse(messages);
}

function createStorage() {
  return {
    messagesByTopic: new Map([]),
    getItem(topicId: string) { return this.messagesByTopic.get(topicId); },
    setItem(topicId: string, messages: Message[]) { this.messagesByTopic.set(topicId, messages); },
  };
}

// TODO: test thrown exceptions

describe('main', () => {
  let db: ConnCtx;

  beforeAll(async () => {
    await setup();
    db = await connnectionContextPromise;
  });

  describe('reading', () => {
    const messages50 = createMessages(50, userFixtures.robert, topicFixtures.topic1Group2);
    const localMessages50 = messages50.map((m) => ({ ...m, _id: m.id }));

    beforeAll(async () => {
      await initFixtures(db);
      await db.messageRepository.insert(messages50);
    });

    beforeEach(() => {
      pushService.subscribe = jest.fn();
      pushService.unsubscribe = jest.fn();
    });

    it('getUserId', async () => {
      setCurrentUser(userFixtures.robert);
      const { id } = await server.getUserId();
      expect(id).toEqual(userFixtures.robert.id);
    });

    it('getOwnGroups', async () => {
      setCurrentUser(userFixtures.robert);
      const groupStore = new GroupStore();
      await groupStore.fetchOwnGroups();
      expect(groupStore.ownGroups).toEqual([
        {
          id: groupFixtures.firstGroup.id,
          name: 'First Group',
          imgUrl: 'url1',
          unread: false,
          pinned: false,
        },
        {
          id: groupFixtures.secondGroup.id,
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
          id: groupFixtures.secondGroup.id,
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
          id: groupFixtures.firstGroup.id,
          name: 'First Group',
          imgUrl: 'url1',
        },
      ]);
    });

    it('getTopicsOfGroup', async () => {
      setCurrentUser(userFixtures.robert);
      const rootActions = new RootStore();
      await rootActions.getTopicsOfGroup(groupFixtures.firstGroup.id);
      expect(rootActions.topics).toEqual([
        {
          id: topicFixtures.topic1Group1.id,
          name: 'Topic 1 Group 1',
          imgUrl: 't1g1_url',
          unread: true,
          pinned: false,
        },
        {
          id: topicFixtures.topic2Group1.id,
          name: 'Topic 2 Group 1',
          imgUrl: 't2g1_url',
          unread: true,
          pinned: true,
        },
      ]);
    });

    it('getTopicsOfCurrentGroup', async () => {
      setCurrentUser(userFixtures.robert);
      const rootActions = new RootStore();
      rootActions.currentlyViewedGroupId = groupFixtures.firstGroup.id;
      await rootActions.getTopicsOfCurrentGroup();
      expect(rootActions.topics).toEqual([
        {
          id: topicFixtures.topic1Group1.id,
          name: 'Topic 1 Group 1',
          imgUrl: 't1g1_url',
          unread: true,
          pinned: false,
        },
        {
          id: topicFixtures.topic2Group1.id,
          name: 'Topic 2 Group 1',
          imgUrl: 't2g1_url',
          unread: true,
          pinned: true,
        },
      ]);
    });

    describe('onTopicOpened', () => {
      it('no messages on storage', async () => {
        const topicIdStr = topicFixtures.topic1Group1.id;
        setCurrentUser(userFixtures.robert);
        const storage = createStorage();
        const rootActions = new RootStore();
        await rootActions.topicStore.onTopicOpened({
          topicId: topicIdStr,
          topicName: 'name',
          storage,
          subscribeFn: jest.fn(),
        });
        const expectedMessages = _.reverse([
          {
            _id: messageFixtures.message1topic1.id,
            createdAt: Date.parse('2018-10-01'),
            text: 'Topic 1 Group 1 Alice',
            user: {
              _id: userFixtures.alice.id,
              name: 'Alice',
              avatar: 'alice_url',
            },
          },
          {
            _id: messageFixtures.message2topic1.id,
            createdAt: Date.parse('2018-10-02'),
            text: 'Topic 1 Group 1 Robert',
            user: {
              _id: userFixtures.robert.id,
              name: 'Robert',
              avatar: 'robert_url',
            },
          },
        ]);
        expect(rootActions.messages).toEqual(expectedMessages);
        expect(storage.getItem(topicIdStr)).toEqual(expectedMessages);
      });

      it('3 extra messages to be fetched', async () => {
        const topicIdStr = topicFixtures.topic1Group2.id;
        setCurrentUser(userFixtures.robert);
        const storage = createStorage();
        storage.setItem(topicIdStr, localMessages50.slice(4, 24));
        const rootActions = new RootStore();
        await rootActions.topicStore.onTopicOpened({
          topicId: topicIdStr,
          topicName: 'name',
          storage,
          subscribeFn: jest.fn(),
        });

        // store messages
        const storeMessageTexts = _.reverse(_.map(rootActions.messages, 'text'));
        expect(storeMessageTexts).toHaveLength(24);
        expect(storeMessageTexts[0]).toEqual('Message 26');
        expect(storeMessageTexts[19]).toEqual('Message 45');
        expect(storeMessageTexts[20]).toEqual('Message 46');
        expect(storeMessageTexts[21]).toEqual('Message 47');
        expect(storeMessageTexts[22]).toEqual('Message 48');
        expect(storeMessageTexts[23]).toEqual('Message 49');

        // storage messages
        const storageMessageTexts = _.reverse(_.map(storage.getItem(topicIdStr), 'text'));
        expect(storageMessageTexts).toHaveLength(20);
        expect(storageMessageTexts[0]).toEqual('Message 30');
        expect(storageMessageTexts[15]).toEqual('Message 45');
        expect(storageMessageTexts[16]).toEqual('Message 46');
        expect(storageMessageTexts[17]).toEqual('Message 47');
        expect(storageMessageTexts[18]).toEqual('Message 48');
        expect(storageMessageTexts[19]).toEqual('Message 49');
      });

      it('hole between fetched and on storage', async () => {
        const topicIdStr = topicFixtures.topic1Group2.id;
        setCurrentUser(userFixtures.robert);
        const storage = createStorage();
        storage.setItem(topicIdStr, localMessages50.slice(25, 44));
        const rootActions = new RootStore();
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
        const storageMessageTexts = _.reverse(_.map(storage.getItem(topicIdStr), 'text'));
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
      const topicIdStr = topicFixtures.topic1Group2.id;
      setCurrentUser(userFixtures.robert);
      const rootActions = new RootStore();
      rootActions.messages = localMessages50.slice(0, 5);
      await rootActions.onOlderMessagesRequested(topicIdStr);

      // store messages
      const storeMessageTexts = _.reverse(_.map(rootActions.messages, 'text'));
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
      const rootActions = new RootStore();
      rootActions.currentlyViewedTopicId = topicFixtures.topic1Group1.id;
      const storage = createStorage();
      await rootActions.getMessagesOfCurrentTopic(storage);
      expect(rootActions.messages).toEqual(_.reverse([
        {
          _id: messageFixtures.message1topic1.id,
          createdAt: Date.parse('2018-10-01'),
          text: 'Topic 1 Group 1 Alice',
          user: {
            _id: userFixtures.alice.id,
            name: 'Alice',
            avatar: 'alice_url',
          },
        },
        {
          _id: messageFixtures.message2topic1.id,
          createdAt: Date.parse('2018-10-02'),
          text: 'Topic 1 Group 1 Robert',
          user: {
            _id: userFixtures.robert.id,
            name: 'Robert',
            avatar: 'robert_url',
          },
        },
      ]));
    });

    it('getGroupInfo', async () => {
      const groupId = groupFixtures.firstGroup.id;
      setCurrentUser(userFixtures.robert);
      const groupActions = new GroupStore();
      await groupActions.getGroupInfo(groupId);
      expect(groupActions.currentGroupInfo).toEqual({
        _id: '5c1c1e99e362b2ce8042faaa',
        name: 'First Group',
        imgUrl: 'url1',
        description: 'Description of the first group',
        visibility: 'PUBLIC',
        visibilityLabel: 'Público',
        friendlyId: 'S9hvTvIBWM',
        createdBy: '507f1f77bcf86cd799430001',
        createdAt: 1528156800000,
        iBelong: true,
      });
    });
  });

  describe('writting', () => {
    beforeEach(async () => {
      pushService.pushMessage = jest.fn();
      pushService.subscribe = jest.fn();
      pushService.unsubscribe = jest.fn();
      await initFixtures();
    });

    it('register', async () => {
      const uid = 'dk49sdfjhk';
      await server.register({
        name: 'Guilherme',
      });

      const userByUid = await User.findOne({ uid });
      expect(userByUid.phoneNumber).toBe('(21)999995555');
      expect(userByUid.name).toBe('Guilherme');
      expect(userByUid.uid).toBe(uid);
    });

    describe('sendMessage', () => {
      const { alice } = userFixtures;
      const messageText = 'new message 1 from Alice';
      const topicId = topicFixtures.topic1Group1.id;
      let rootActions;

      beforeEach(async () => {
        setCurrentUser(alice);
        rootActions = new RootStore();
        rootActions.topicStore.topicId = topicId;
        await rootActions.sendMessages([{ text: messageText }]);
      });

      it('push', async () => {
        const call0args = pushService.pushMessage.mock.calls[0];
        expect(call0args).toHaveLength(2);
        const [, pushParams] = call0args;
        expect(topicId).toBe(topicFixtures.topic1Group1.id);
        const createdMessage = await Message.findOne({}, {}, { sort: { _id: -1 } });
        expect(pushParams).toEqual({
          payload: {
            message: messageText,
            topicId: topicFixtures.topic1Group1.id,
            groupId: groupFixtures.firstGroup.id,
            messageId: createdMessage.id,
            authorName: alice.name,
            topicName: 'Topic 1 Group 1',
            type: messageTypes.NEW_MESSAGE,
          },
          body: messageText,
          title: 'Topic 1 Group 1',
          sendNotification: true,
        });

        const call1args = pushService.pushMessage.mock.calls[1];
        const [groupId] = call1args;
        expect(groupId).toBe(groupFixtures.firstGroup.id);

        expect(rootActions.messages).toHaveLength(1);
      });

      it('message was added to DB', async () => {
        const lastMessageOnStore = _.last(rootActions.messages);
        const messages = await server.getMessagesOfTopic({
          topicId: topicFixtures.topic1Group1.id,
          limit: 20,
          afterId: '507f1f77bcf86cd799439002',
        });
        expect(messages).toEqual(expect.arrayContaining([
          expect.objectContaining({
            _id: lastMessageOnStore._id,
            text: messageText,
            user: expect.objectContaining({
              _id: '507f1f77bcf86cd799430001',
              avatar: 'alice_url',
              name: 'Alice',
            }),
          }),
        ]));
      });

      it('sendMessage, filtering by `startingId`', async () => {
        const messages = await server.getMessagesOfTopic({
          topicId: topicFixtures.topic1Group1.id,
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
        const topics = await server.getTopicsOfGroup(groupFixtures.firstGroup.id, 20, 'startingId1');
        expect(_.map(topics, 'name')).toEqual(['Topic 1 Group 1', 'Topic 2 Group 1']);
      });
    });

    describe('createTopic', () => {
      const topicName = 'new topic foca';

      beforeAll(() => {
        setCurrentUser(userFixtures.robert);
      });

      beforeEach(async () => {
        const navigation = { goBack: jest.fn() };
        const secondGroupId = groupFixtures.secondGroup.id;
        await newTopicActions.createTopic(navigation, secondGroupId, topicName);
      });

      it('push', async () => {
        const [topic, pushParams] = pushService.pushMessage.mock.calls[0];
        expect(topic).toBe(groupFixtures.secondGroup.id);
        const newTopic = await Topic.findOne({}, {}, { sort: { _id: -1 } });
        expect(pushParams).toEqual({
          payload: {
            type: messageTypes.NEW_TOPIC,
            topicId: newTopic.id,
            groupId: groupFixtures.secondGroup.id,
            topicName,
          },
          body: topicName,
          title: 'Novo tópico',
          sendNotification: true,
        });
      });

      it('topic created on DB', async () => {
        setCurrentUser(userFixtures.robert);
        const topics = await server.getTopicsOfGroup(groupFixtures.secondGroup.id, 20, 'startingId1');
        expect(topics).toHaveLength(3);
        // test order
        expect(_.map(topics, 'name')).toEqual([topicName, 'Topic 2 Group 2', 'Topic 1 Group 2']);
      });

      it('group sort order', async () => {
        setCurrentUser(userFixtures.robert);
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
      const groupActions = new GroupStore();
      await groupActions.leaveGroup(groupId, jest.fn());
      const groups = await server.getOwnGroups();
      const [, unsubscribedGroup] = pushService.unsubscribe.mock.calls[0];
      expect(unsubscribedGroup).toBe(groupId);
      expect(groups).toEqual([
        {
          id: groupFixtures.secondGroup.id,
          imgUrl: 'url2',
          name: 'Second Group',
          unread: true,
          pinned: true,
        },
      ]);
      expect(groupActions.ownGroups).toEqual([
        {
          id: groupFixtures.secondGroup.id,
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
        const groupId = groupFixtures.firstGroup.id;
        // let navigatePath;
        // const navigation = { navigate: (path) => navigatePath = path };
        const groupActions = new GroupStore();
        try {
          await groupActions.joinGroup(groupId, jest.fn());
        } catch (error) {
          expect(error.message).toEqual('User already participate in the group');
        }
      });

      it('joined group', async () => {
        setCurrentUser(userFixtures.alice);
        const groupId = groupFixtures.secondGroup.id;
        await server.joinGroup(groupId);
        const groups = await server.getOwnGroups();
        expect(groups).toHaveLength(2);
        expect(groups[1].name).toBe('Second Group');
      });
    });

    it('updateFcmToken', async () => {
      setCurrentUser(userFixtures.robert);
      const fcmToken = 'robertFcmToken345873';
      await server.updateFcmToken(fcmToken);
      const robert = await User.findById(userFixtures.robert._id);
      expect(robert.fcmToken).toBe(fcmToken);

      const [subscribedFcmToken, firstSubscribedGroupId] = pushService.subscribe.mock.calls[0];
      expect(subscribedFcmToken).toBe(fcmToken);
      expect(firstSubscribedGroupId).toBe(userFixtures.robert.groups[1].id.toHexString());
    });

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
        const [/* fcmTokenP */, topicIdP] = pushService.subscribe.mock.calls[0];
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
  });
});
