// @ts-nocheck

import { createStore } from 'redux';

import * as sinon from 'sinon';
import * as moment from 'moment';
import * as mongoose from 'mongoose';

const server = require('../../../../mobile/lib/server');

import * as chai from 'chai';
import * as chaiAsPromised from "chai-as-promised";
import * as chaiSubset from "chai-subset";
import _ = require('lodash');
import pushService from '../../lib/pushService';
import { initFixtures } from '../fixtures';
// const logger = require('../../config/winston');
import userFixtures from '../fixtures/userFixtures';
import groupFixtures from '../fixtures/groupFixtures';
import topicFixtures from '../fixtures/topicFixtures';
import messageFixtures from '../fixtures/messageFixtures';
import { groupIds } from '../fixtures/preIds';
import { setCurrentUser } from './index.spec';
import User from '../../db/schema/User';
import Topic, { ITopic } from '../../db/schema/Topic';
import Message from '../../db/schema/Message';
import TopicLatestRead from '../../db/schema/TopicLatestRead';
import { messageTypes } from '../../lib/constants';

const { ObjectId } = mongoose.Types;
const { expect } = chai;

import rootReducer = require('../../../../mobile/reducers/rootReducer');
// const thunk = require('redux-thunk');
const store = createStore(
  rootReducer,
  {},
  // , applyMiddleware(thunk)
);

import rootActions = require('../../../../mobile/actions/rootActions');
import groupActions = require('../../../../mobile/actions/groupActions');
import groupsSearchActions = require('../../../../mobile/actions/groupsSearchActions');
import newTopicActions = require('../../../../mobile/actions/newTopicActions');
import topicActions = require('../../../../mobile/actions/topicActions');

const dispatch = store.dispatch.bind(store);
// const getState = store.getState.bind(store);

function createMessages(numMessages, user, topic) {
  const messages = [];
  const baseMoment = moment();
  for (let i = 0; i < numMessages; i++) {
    messages.push({
      _id: ObjectId(),
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
    getItem(topicId) { return this.messagesByTopic.get(topicId); },
    setItem(topicId, messages) { this.messagesByTopic.set(topicId, messages); },
  };
}

// TODO: test thrown exceptions

let pushMessageStub;
let subscribeStub;
let unsubscribeStub;

describe('main', () => {
  describe('reading', () => {
    const messages50 = createMessages(50, userFixtures.robert, topicFixtures.topic1Group2._id);
    const localMessages50 = messages50.map((m) => ({ ...m, _id: m._id.toHexString() }));

    before(async () => {
      chai.should();
      chai.use(chaiAsPromised);
      chai.use(chaiSubset);
      await initFixtures();
      await Message.insertMany(messages50);
      subscribeStub = sinon.stub(pushService, 'subscribe');
      unsubscribeStub = sinon.stub(pushService, 'unsubscribe');
    });

    afterEach(() => {
      subscribeStub.restore();
      unsubscribeStub.restore();
    });

    it('getUserId', async () => {
      setCurrentUser(userFixtures.robert);
      const { id } = await server.getUserId();
      expect(id).eql(userFixtures.robert._id.toHexString());
    });

    it('getOwnGroups', async () => {
      setCurrentUser(userFixtures.robert);
      await rootActions.fetchOwnGroups(dispatch);
      expect(store.getState().base.ownGroups).eql([
        {
          id: groupFixtures.firstGroup._id.toHexString(),
          name: 'First Group',
          imgUrl: 'url1',
          unread: false,
          pinned: false,
        },
        {
          id: groupFixtures.secondGroup._id.toHexString(),
          name: 'Second Group',
          imgUrl: 'url2',
          unread: true,
          pinned: true,
        },
      ]);
    });

    it('findGroups', async () => {
      setCurrentUser(userFixtures.robert);
      await groupsSearchActions.findGroups('second')(dispatch);
      expect(store.getState().groupsSearch.groups).eql([
        {
          id: groupFixtures.secondGroup._id.toHexString(),
          name: 'Second Group',
          imgUrl: 'url2',
        },
      ]);
    });

    it('find by friendlyId', async () => {
      setCurrentUser(userFixtures.robert);
      await groupsSearchActions.findGroups('  S9hvTvIBWM ')(dispatch);
      expect(store.getState().groupsSearch.groups).eql([
        {
          id: groupFixtures.firstGroup._id.toHexString(),
          name: 'First Group',
          imgUrl: 'url1',
        },
      ]);
    });

    it('getTopicsOfGroup', async () => {
      setCurrentUser(userFixtures.robert);
      await rootActions.getTopicsOfGroup(dispatch, groupFixtures.firstGroup._id.toHexString());
      expect(store.getState().base.topics).eql([
        {
          id: topicFixtures.topic1Group1._id.toHexString(),
          name: 'Topic 1 Group 1',
          imgUrl: 't1g1_url',
          unread: true,
          pinned: false,
        },
        {
          id: topicFixtures.topic2Group1._id.toHexString(),
          name: 'Topic 2 Group 1',
          imgUrl: 't2g1_url',
          unread: true,
          pinned: true,
        },
      ]);
    });

    it('getTopicsOfCurrentGroup', async () => {
      setCurrentUser(userFixtures.robert);
      store.dispatch({
        type: 'currently viewed group ID',
        payload: { currentlyViewedGroupId: groupFixtures.firstGroup._id.toHexString() },
      });
      await rootActions.getTopicsOfCurrentGroup(store);
      expect(store.getState().base.topics).eql([
        {
          id: topicFixtures.topic1Group1._id.toHexString(),
          name: 'Topic 1 Group 1',
          imgUrl: 't1g1_url',
          unread: true,
          pinned: false,
        },
        {
          id: topicFixtures.topic2Group1._id.toHexString(),
          name: 'Topic 2 Group 1',
          imgUrl: 't2g1_url',
          unread: true,
          pinned: true,
        },
      ]);
    });

    describe('onTopicOpened', () => {
      it('no messages on storage', async () => {
        const localStore = createStore(rootReducer, {});
        const localDispatch = localStore.dispatch.bind(localStore);
        const topicIdStr = topicFixtures.topic1Group1._id.toHexString();
        setCurrentUser(userFixtures.robert);
        const storage = createStorage();
        await topicActions.onTopicOpened({
          topicId: topicIdStr,
          topicName: 'name',
          storage,
          subscribeFn: () => {},
        })(localDispatch);
        const expectedMessages = _.reverse([
          {
            _id: messageFixtures.message1topic1._id.toHexString(),
            createdAt: Date.parse('2018-10-01'),
            text: 'Topic 1 Group 1 Alice',
            user: {
              _id: userFixtures.alice._id.toHexString(),
              name: 'Alice',
              avatar: 'alice_url',
            },
          },
          {
            _id: messageFixtures.message2topic1._id.toHexString(),
            createdAt: Date.parse('2018-10-02'),
            text: 'Topic 1 Group 1 Robert',
            user: {
              _id: userFixtures.robert._id.toHexString(),
              name: 'Robert',
              avatar: 'robert_url',
            },
          },
        ]);
        expect(localStore.getState().base.messages).to.eql(expectedMessages);
        expect(storage.getItem(topicIdStr)).to.eql(expectedMessages);
      });

      it('3 extra messages to be fetched', async () => {
        const localStore = createStore(rootReducer, {});
        const localDispatch = localStore.dispatch.bind(localStore);
        const topicIdStr = topicFixtures.topic1Group2._id.toHexString();
        setCurrentUser(userFixtures.robert);
        const storage = createStorage();
        storage.setItem(topicIdStr, localMessages50.slice(4, 24));
        await topicActions.onTopicOpened({
          topicId: topicIdStr,
          topicName: 'name',
          storage,
          subscribeFn: () => {},
        })(localDispatch);

        // store messages
        const storeMessageTexts = _.reverse(_.map(localStore.getState().base.messages, 'text'));
        expect(storeMessageTexts).to.have.lengthOf(24);
        expect(storeMessageTexts[0]).to.eql('Message 26');
        expect(storeMessageTexts[19]).to.eql('Message 45');
        expect(storeMessageTexts[20]).to.eql('Message 46');
        expect(storeMessageTexts[21]).to.eql('Message 47');
        expect(storeMessageTexts[22]).to.eql('Message 48');
        expect(storeMessageTexts[23]).to.eql('Message 49');

        // storage messages
        const storageMessageTexts = _.reverse(_.map(storage.getItem(topicIdStr), 'text'));
        expect(storageMessageTexts).to.have.lengthOf(20);
        expect(storageMessageTexts[0]).to.eql('Message 30');
        expect(storageMessageTexts[15]).to.eql('Message 45');
        expect(storageMessageTexts[16]).to.eql('Message 46');
        expect(storageMessageTexts[17]).to.eql('Message 47');
        expect(storageMessageTexts[18]).to.eql('Message 48');
        expect(storageMessageTexts[19]).to.eql('Message 49');
      });

      it('hole between fetched and on storage', async () => {
        const localStore = createStore(rootReducer, {});
        const localDispatch = localStore.dispatch.bind(localStore);
        const topicIdStr = topicFixtures.topic1Group2._id.toHexString();
        setCurrentUser(userFixtures.robert);
        const storage = createStorage();
        storage.setItem(topicIdStr, localMessages50.slice(25, 44));
        await topicActions.onTopicOpened({
          topicId: topicIdStr,
          topicName: 'name',
          storage,
          subscribeFn: () => {},
        })(localDispatch);

        // store messages
        const storeMessageTexts = _.reverse(_.map(localStore.getState().base.messages, 'text'));
        expect(storeMessageTexts).to.have.lengthOf(20);
        expect(storeMessageTexts[0]).to.eql('Message 30');
        expect(storeMessageTexts[1]).to.eql('Message 31');
        expect(storeMessageTexts[18]).to.eql('Message 48');
        expect(storeMessageTexts[19]).to.eql('Message 49');

        // storage messages
        const storageMessageTexts = _.reverse(_.map(storage.getItem(topicIdStr), 'text'));
        expect(storageMessageTexts).to.have.lengthOf(20);
        expect(storageMessageTexts[0]).to.eql('Message 30');
        expect(storageMessageTexts[15]).to.eql('Message 45');
        expect(storageMessageTexts[16]).to.eql('Message 46');
        expect(storageMessageTexts[17]).to.eql('Message 47');
        expect(storageMessageTexts[18]).to.eql('Message 48');
        expect(storageMessageTexts[19]).to.eql('Message 49');
      });
    });

    it('onOlderMessagesRequested', async () => {
      const localStore = createStore(rootReducer, {});
      const localDispatch = localStore.dispatch.bind(localStore);
      const localGetState = localStore.getState.bind(localStore);
      const topicIdStr = topicFixtures.topic1Group2._id.toHexString();
      setCurrentUser(userFixtures.robert);
      localDispatch({ type: 'set messages', payload: { messages: localMessages50.slice(0, 5) } });

      await rootActions.onOlderMessagesRequested(topicIdStr)(localDispatch, localGetState);

      // store messages
      const storeMessageTexts = _.reverse(_.map(localStore.getState().base.messages, 'text'));
      expect(storeMessageTexts).to.have.lengthOf(25);
      expect(storeMessageTexts[0]).to.eql('Message 25');
      expect(storeMessageTexts[1]).to.eql('Message 26');
      expect(storeMessageTexts[18]).to.eql('Message 43');
      expect(storeMessageTexts[19]).to.eql('Message 44');
      expect(storeMessageTexts[20]).to.eql('Message 45');
      expect(storeMessageTexts[21]).to.eql('Message 46');
      expect(storeMessageTexts[22]).to.eql('Message 47');
      expect(storeMessageTexts[23]).to.eql('Message 48');
      expect(storeMessageTexts[24]).to.eql('Message 49');
    });

    it('getMessagesOfCurrentTopic', async () => {
      const localStore = createStore(rootReducer, {});
      setCurrentUser(userFixtures.robert);
      localStore.dispatch({
        type: 'currently viewed topic ID',
        payload: { currentlyViewedTopicId: topicFixtures.topic1Group1._id.toHexString() },
      });
      const storage = createStorage();
      await rootActions.getMessagesOfCurrentTopic(localStore, storage);
      expect(localStore.getState().base.messages).eql(_.reverse([
        {
          _id: messageFixtures.message1topic1._id.toHexString(),
          createdAt: Date.parse('2018-10-01'),
          text: 'Topic 1 Group 1 Alice',
          user: {
            _id: userFixtures.alice._id.toHexString(),
            name: 'Alice',
            avatar: 'alice_url',
          },
        },
        {
          _id: messageFixtures.message2topic1._id.toHexString(),
          createdAt: Date.parse('2018-10-02'),
          text: 'Topic 1 Group 1 Robert',
          user: {
            _id: userFixtures.robert._id.toHexString(),
            name: 'Robert',
            avatar: 'robert_url',
          },
        },
      ]));
    });

    it('getGroupInfo', async () => {
      const localStore = createStore(rootReducer, {});
      const localDispatch = localStore.dispatch.bind(localStore);
      const groupId = groupFixtures.firstGroup._id.toHexString();
      setCurrentUser(userFixtures.robert);
      await groupActions.getGroupInfo(groupId)(localDispatch);
      expect(localStore.getState().base.currentGroupInfo).to.eql({
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
      pushMessageStub = sinon.stub(pushService, 'pushMessage');
      subscribeStub = sinon.stub(pushService, 'subscribe');
      unsubscribeStub = sinon.stub(pushService, 'unsubscribe');
      await initFixtures();
    });

    afterEach(() => {
      pushMessageStub.restore();
      subscribeStub.restore();
      unsubscribeStub.restore();
    });

    it('register', async () => {
      const uid = 'dk49sdfjhk';
      await server.register({
        name: 'Guilherme',
      });

      const userByUid = await User.findOne({ uid });
      expect(userByUid.phoneNumber).to.equal('(21)999995555');
      expect(userByUid.name).to.equal('Guilherme');
      expect(userByUid.uid).to.equal(uid);
    });

    describe('sendMessage', () => {
      const { alice } = userFixtures;
      const messageText = 'new message 1 from Alice';
      const topicId = topicFixtures.topic1Group1._id.toHexString();

      const localStore = createStore(rootReducer, {});
      const localDispatch = localStore.dispatch.bind(localStore);
      const localGetState = localStore.getState.bind(localStore);

      beforeEach(async () => {
        setCurrentUser(alice);
        localDispatch({ type: 'reset base', payload: {} });
        localDispatch({
          type: 'chat topic ID',
          payload: { topicId },
        });
        await rootActions.sendMessages([{ text: messageText }])(localDispatch, localGetState);
      });

      it('push', async () => {
        const call0args = pushMessageStub.args[0];
        expect(call0args).to.have.lengthOf(2);
        const [, pushParams] = call0args;
        expect(topicId).to.equal(topicFixtures.topic1Group1._id.toHexString());
        const createdMessage = await Message.findOne({}, {}, { sort: { _id: -1 } });
        expect(pushParams).to.eql({
          payload: {
            message: messageText,
            topicId: topicFixtures.topic1Group1._id.toHexString(),
            groupId: groupFixtures.firstGroup._id.toHexString(),
            messageId: createdMessage._id.toHexString(),
            authorName: alice.name,
            topicName: 'Topic 1 Group 1',
            type: messageTypes.NEW_MESSAGE,
          },
          body: messageText,
          title: 'Topic 1 Group 1',
          sendNotification: true,
        });

        const call1args = pushMessageStub.args[1];
        const [groupId] = call1args;
        expect(groupId).to.equal(groupFixtures.firstGroup._id.toHexString());

        expect(localGetState().base.messages).to.have.lengthOf(1);
      });

      it('message was added to DB', async () => {
        const lastMessageOnStore = _.last(localGetState().base.messages);
        const messages = await server.getMessagesOfTopic({
          topicId: topicFixtures.topic1Group1._id.toHexString(),
          limit: 20,
          afterId: '507f1f77bcf86cd799439002',
        });
        expect(messages).to.containSubset([{
          _id: lastMessageOnStore._id,
          text: messageText,
          user: {
            _id: '507f1f77bcf86cd799430001',
            avatar: 'alice_url',
            name: 'Alice',
          },
        }]);
      });

      it('sendMessage, filtering by `startingId`', async () => {
        const messages = await server.getMessagesOfTopic({
          topicId: topicFixtures.topic1Group1._id.toHexString(),
          limit: 20,
        });
        expect(messages).to.have.lengthOf(3);
        // the most recent message
        expect(messages[0]).to.containSubset({
          text: messageText,
          user: {
            name: 'Alice',
          },
        });
      });

      it('topic sort order', async () => {
        const topics = await server.getTopicsOfGroup(groupFixtures.firstGroup._id.toHexString(), 20, 'startingId1');
        expect(_.map(topics, 'name')).to.eql(['Topic 1 Group 1', 'Topic 2 Group 1']);
      });
    });

    describe('createTopic', async () => {
      const topicName = 'new topic foca';

      const localStore = createStore(rootReducer, {});
      const localDispatch = localStore.dispatch.bind(localStore);
      const localGetState = localStore.getState.bind(localStore);
      before(() => {
        setCurrentUser(userFixtures.robert);
      });

      beforeEach(async () => {
        const navigation = { goBack: () => {} };
        const groupId = groupFixtures.secondGroup._id.toHexString();
        await newTopicActions.createTopic(navigation, groupId, topicName)(localDispatch, localGetState);
      });

      it('push', async () => {
        const [topic, pushParams] = pushMessageStub.args[0];
        expect(topic).to.equal(groupFixtures.secondGroup._id.toHexString());
        const newTopic = await Topic.findOne({}, {}, { sort: { _id: -1 } });
        expect(pushParams).to.eql({
          payload: {
            type: messageTypes.NEW_TOPIC,
            topicId: newTopic._id.toHexString(),
            groupId: groupFixtures.secondGroup._id.toHexString(),
            topicName,
          },
          body: topicName,
          title: 'Novo tópico',
          sendNotification: true,
        });
      });

      it('topic created on DB', async () => {
        setCurrentUser(userFixtures.robert);
        const topics = await server.getTopicsOfGroup(groupFixtures.secondGroup._id.toHexString(), 20, 'startingId1');
        expect(topics).to.have.lengthOf(3);
        // test order
        expect(_.map(topics, 'name')).to.eql([topicName, 'Topic 2 Group 2', 'Topic 1 Group 2']);
      });

      it('group sort order', async () => {
        setCurrentUser(userFixtures.robert);
        const groups = await server.getOwnGroups();
        expect(_.map(groups, 'name')).to.eql(['Second Group', 'First Group']);
      });
    });

    it('createGroup', async () => {
      setCurrentUser(userFixtures.robert);
      const result = await server.createGroup({ groupName: 'new group 1', visibility: 'SECRET' });
      expect(result).to.equal('OK');
      const groups = await server.getOwnGroups();
      expect(groups).to.have.lengthOf(3);
      expect(groups[0].name).to.equal('new group 1');
    });

    it('leaveGroup', async () => {
      const localStore = createStore(rootReducer, {});
      const localDispatch = localStore.dispatch.bind(localStore);
      const localGetState = localStore.getState.bind(localStore);

      setCurrentUser(userFixtures.robert);
      const groupId = groupIds.firstGroup.toHexString();
      await groupActions.leaveGroup(groupId, () => {})(localDispatch, localGetState);
      const groups = await server.getOwnGroups();
      const call0args = unsubscribeStub.args[0];
      const [, unsubscribedGroup] = call0args;
      expect(unsubscribedGroup).to.equal(groupId);
      expect(groups).to.eql([
        {
          id: groupFixtures.secondGroup._id.toHexString(),
          imgUrl: 'url2',
          name: 'Second Group',
          unread: true,
          pinned: true,
        },
      ]);
      expect(localGetState().base.ownGroups).to.eql([
        {
          id: groupFixtures.secondGroup._id.toHexString(),
          imgUrl: 'url2',
          name: 'Second Group',
          unread: true,
          pinned: true,
        },
      ]);
    });

    describe('joinGroup', () => {
      it('User already joined the group', async () => {
        setCurrentUser(userFixtures.alice);
        const groupId = groupFixtures.firstGroup._id.toHexString();
        // let navigatePath;
        // const navigation = { navigate: (path) => navigatePath = path };
        const joinGroupPromise = groupActions.joinGroup(groupId, () => {})(dispatch);
        await expect(joinGroupPromise).to.eventually.rejectedWith('User already participate in the group');
      });

      it('joined group', async () => {
        setCurrentUser(userFixtures.alice);
        const groupId = groupFixtures.secondGroup._id.toHexString();
        await server.joinGroup(groupId);
        const groups = await server.getOwnGroups();
        expect(groups).to.have.lengthOf(2);
        expect(groups[1].name).to.equal('Second Group');
      });
    });

    it('updateFcmToken', async () => {
      setCurrentUser(userFixtures.robert);
      const fcmToken = 'robertFcmToken345873';
      await server.updateFcmToken(fcmToken);
      const robert = await User.findById(userFixtures.robert._id);
      expect(robert.fcmToken).to.equal(fcmToken);

      const call0args = subscribeStub.args[0];
      const [subscribedFcmToken, firstSubscribedGroupId] = call0args;
      expect(subscribedFcmToken).to.equal(fcmToken);
      expect(firstSubscribedGroupId).to.equal(userFixtures.robert.groups[1].id.toHexString());
    });

    it('setTopicLatestRead', async () => {
      setCurrentUser(userFixtures.robert);

      // Create
      const firstCount = await TopicLatestRead.countDocuments();
      const result1 = await server.setTopicLatestRead(topicFixtures.topic1Group1._id.toHexString());
      expect(result1).to.equal('OK');
      const secoundCount = await TopicLatestRead.countDocuments();
      expect(secoundCount - firstCount).to.eql(1);

      // Update
      const result2 = await server.setTopicLatestRead(topicFixtures.topic1Group1._id.toHexString());
      expect(result2).to.equal('OK');
      const thirdCount = await TopicLatestRead.countDocuments();
      expect(thirdCount - secoundCount).to.eql(0);
    });

    describe('setGroupPin', () => {
      it('pin', async () => {
        setCurrentUser(userFixtures.robert);
        const groupId = groupFixtures.firstGroup._id.toHexString();
        await server.setGroupPin({
          groupId,
          pinned: true,
        });

        const user = await User.findById(userFixtures.robert._id);
        expect(user.groups[0].pinned).to.eql(true);
        const [, groupIdP] = subscribeStub.args[0];
        expect(groupIdP).to.eql(groupId);
      });

      it('unpin', async () => {
        setCurrentUser(userFixtures.robert);
        const groupId = groupFixtures.secondGroup._id.toHexString();
        await server.setGroupPin({
          groupId,
          pinned: false,
        });

        const user = await User.findById(userFixtures.robert._id);
        expect(user.groups[1].pinned).to.eql(false);
        const [, groupIdP] = unsubscribeStub.args[0];
        expect(groupIdP).to.eql(groupId);
      });
    });

    describe('setTopicPin', () => {
      it('pin', async () => {
        setCurrentUser(userFixtures.robert);
        const topicId = topicFixtures.topic2Group2._id.toHexString();
        await server.setTopicPin({
          topicId,
          pinned: true,
        });

        const user = await User.findById(userFixtures.robert._id);
        expect(user.pinnedTopics[2].toHexString()).to.eql(topicId);
        const [/* fcmTokenP */, topicIdP] = subscribeStub.args[0];
        expect(topicIdP).to.eql(topicId);
      });

      it('unpin', async () => {
        setCurrentUser(userFixtures.robert);
        const topicId = topicFixtures.topic1Group2._id.toHexString();
        await server.setTopicPin({
          topicId,
          pinned: false,
        });

        const user = await User.findById(userFixtures.robert._id);
        expect(user.pinnedTopics).to.have.lengthOf(1);
        const [, topicIdP] = unsubscribeStub.args[0];
        expect(topicIdP).to.eql(topicId);
      });
    });
  });
});