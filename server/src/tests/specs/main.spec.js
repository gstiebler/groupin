const sinon = require('sinon');
const moment = require('moment');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const server = require('../../../../mobile/lib/server');
const pushService = require('../../lib/pushService');
const expect = require('chai').expect;
const { initFixtures } = require('../fixtures');
const logger = require('../../config/winston');
const userFixtures = require('../fixtures/userFixtures');
const groupFixtures = require('../fixtures/groupFixtures');
const topicFixtures = require('../fixtures/topicFixtures');
const messageFixtures = require('../fixtures/messageFixtures');
const groupIds = require('../fixtures/groupIds');
const _ = require('lodash');
const { setCurrentUser } = require('./index.spec');
const User = require('../../db/schema/User');
const Topic = require('../../db/schema/Topic');
const Message = require('../../db/schema/Message');
const md5 = require('md5');
const { messageTypes } = require('../../lib/constants');

const rootReducer = require('../../../../mobile/reducers/rootReducer');
const { createStore, applyMiddleware } = require("redux");
// const thunk = require('redux-thunk');
const store = createStore(
  rootReducer,
  {},
  //, applyMiddleware(thunk)
);

const rootActions = require('../../../../mobile/actions/rootActions');
const groupsSearchActions = require('../../../../mobile/actions/groupsSearchActions');
const newTopicActions = require('../../../../mobile/actions/newTopicActions');

const dispatch = store.dispatch.bind(store);
const getState = store.getState.bind(store);

function createMessages(numMessages, user, topic) {
  let messages = [];
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
  return messages;
}

function createStorage() {
  return {
    messagesByTopic: new Map([[]]),
    getItem(topicId) { return this.messagesByTopic.get(topicId) },
    setItem(topicId, messages) { this.messagesByTopic.set(topicId, messages) },
  };
}

// TODO: test thrown exceptions

let pushMessageStub;
let subscribeStub;

describe('main', () => {

  describe('reading', () => {

    const messages50 = createMessages(50, userFixtures.robert, topicFixtures.topic1Group2._id);
    const localMessages50 = messages50.map(m => ({ ...m, _id: m._id.toHexString() }));

    before(async () => {
      await initFixtures();
      await Message.insertMany(messages50);
      subscribeStub = sinon.stub(pushService, 'subscribe');
    });

    afterEach(() => {
      subscribeStub.restore();
    });

    it('getOwnGroups', async () => {
      setCurrentUser(userFixtures.robert);
      await rootActions.fetchOwnGroups(dispatch);
      expect(store.getState().base.ownGroups).eql([
        {
          id: groupFixtures.firstGroup._id.toHexString(),
          name: 'First Group',
          imgUrl: 'url1',
        },
        {
          id: groupFixtures.secondGroup._id.toHexString(),
          name: 'Second Group',
          imgUrl: 'url2',
        },
      ]);
    });

    it('findGroups', async () => {
      setCurrentUser(userFixtures.robert);
      await groupsSearchActions.findGroups(dispatch, 'second');
      expect(store.getState().groupsSearch.groups).eql([
        {
          id: groupFixtures.secondGroup._id.toHexString(),
          name: 'Second Group',
          imgUrl: 'url2',
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
        },
        {
          id: topicFixtures.topic2Group1._id.toHexString(),
          name: 'Topic 2 Group 1',
          imgUrl: 't2g1_url',
        },
      ]);
    });
  
    it('getTopicsOfCurrentGroup', async () => {
      setCurrentUser(userFixtures.robert);
      store.dispatch({ 
        type: 'currently viewed group ID', 
        payload: { currentlyViewedGroupId: groupFixtures.firstGroup._id.toHexString() } }
      );
      await rootActions.getTopicsOfCurrentGroup(store);
      expect(store.getState().base.topics).eql([
        {
          id: topicFixtures.topic1Group1._id.toHexString(),
          name: 'Topic 1 Group 1',
          imgUrl: 't1g1_url',
        },
        {
          id: topicFixtures.topic2Group1._id.toHexString(),
          name: 'Topic 2 Group 1',
          imgUrl: 't2g1_url',
        },
      ]);
    });

    describe('onTopicOpened', () => {
  
      it('no messages on storage', async () => {
        const localStore = createStore(rootReducer, {});
        const localDispatch = localStore.dispatch.bind(localStore);
        const topicIdStr = topicFixtures.topic1Group1._id.toHexString();
        setCurrentUser(userFixtures.robert);
        let storage = createStorage();
        await rootActions.onTopicOpened(topicIdStr, storage)(localDispatch);
        const expectedMessages = [
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
        ];
        expect(localStore.getState().base.messages).to.eql(expectedMessages);
        expect(storage.getItem(topicIdStr)).to.eql(expectedMessages);
      });
  
      it('3 extra messages to be fetched', async () => {
        const localStore = createStore(rootReducer, {});
        const localDispatch = localStore.dispatch.bind(localStore);
        const topicIdStr = topicFixtures.topic1Group2._id.toHexString();
        setCurrentUser(userFixtures.robert);
        let storage = createStorage();
        storage.setItem(topicIdStr, localMessages50.slice(26, 46));
        await rootActions.onTopicOpened(topicIdStr, storage)(localDispatch);

        // store messages
        const storeMessageTexts = _.map(localStore.getState().base.messages, 'text');
        expect(storeMessageTexts).to.have.lengthOf(24);
        expect(storeMessageTexts[0]).to.eql('Message 26');
        expect(storeMessageTexts[19]).to.eql('Message 45');
        expect(storeMessageTexts[20]).to.eql('Message 46');
        expect(storeMessageTexts[21]).to.eql('Message 47');
        expect(storeMessageTexts[22]).to.eql('Message 48');
        expect(storeMessageTexts[23]).to.eql('Message 49');

        // storage messages
        const storageMessageTexts = _.map(storage.getItem(topicIdStr), 'text');
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
        let storage = createStorage();
        storage.setItem(topicIdStr, localMessages50.slice(5, 24));
        await rootActions.onTopicOpened(topicIdStr, storage)(localDispatch);

        // store messages
        const storeMessageTexts = _.map(localStore.getState().base.messages, 'text');
        expect(storeMessageTexts).to.have.lengthOf(20);
        expect(storeMessageTexts[0]).to.eql('Message 30');
        expect(storeMessageTexts[1]).to.eql('Message 31');
        expect(storeMessageTexts[18]).to.eql('Message 48');
        expect(storeMessageTexts[19]).to.eql('Message 49');

        // storage messages
        const storageMessageTexts = _.map(storage.getItem(topicIdStr), 'text');
        expect(storageMessageTexts).to.have.lengthOf(20);
        expect(storageMessageTexts[0]).to.eql('Message 30');
        expect(storageMessageTexts[15]).to.eql('Message 45');
        expect(storageMessageTexts[16]).to.eql('Message 46');
        expect(storageMessageTexts[17]).to.eql('Message 47');
        expect(storageMessageTexts[18]).to.eql('Message 48');
        expect(storageMessageTexts[19]).to.eql('Message 49');
      });

    });

    it('getMessagesOfCurrentTopic', async () => {
      const localStore = createStore(rootReducer, {});
      setCurrentUser(userFixtures.robert);
      localStore.dispatch({ 
        type: 'currently viewed topic ID', 
        payload: { currentlyViewedTopicId: topicFixtures.topic1Group1._id.toHexString() } }
      );
      let storage = createStorage();
      await rootActions.getMessagesOfCurrentTopic(localStore, storage);
      expect(localStore.getState().base.messages).eql([
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
    });
  
    
  });

  describe('writting', () => {

    beforeEach(async () => {
      pushMessageStub = sinon.stub(pushService, 'pushMessage');
      subscribeStub = sinon.stub(pushService, 'subscribe');
      await initFixtures();
    });

    afterEach(() => {
      pushMessageStub.restore();
      subscribeStub.restore();
    });

    it('register', async () => {
      const password = 'smallpassword';
      const uid = 'dk49sdfjhk';
      await server.register({
        name: 'Guilherme',
        userName: '(21)999995555',
        password,
        uid,
      });

      const userByUid = await User.findOne({ uid });
      expect(userByUid.email).to.equal('(21)999995555');
      expect(userByUid.name).to.equal('Guilherme');
      expect(userByUid.uid).to.equal(uid);
      expect(userByUid.tempPassword).to.be.not.equal(password);

      const userByPassword = await User.findOne({ tempPassword: md5(password) });
      expect(userByPassword.email).to.equal('(21)999995555');
    });

    describe('sendMessage', () => {
      const alice = userFixtures.alice;
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
        const [topicId, pushParams] = call0args;
        expect(topicId).to.equal(topicFixtures.topic1Group1._id.toHexString());
        const createdMessage = await Message.findOne({}, {}, { sort: { _id: -1 } });
        expect(pushParams).to.eql({
          payload: {
            message: messageText,
            topicId: topicFixtures.topic1Group1._id.toHexString(),
            groupId: groupFixtures.firstGroup._id.toHexString(),
            messageId: createdMessage._id.toHexString(),
            authorName: alice.name,
            type: messageTypes.NEW_MESSAGE,
          },
          body: messageText,
          title: topicFixtures.topic1Group1._id.toHexString(),
        });      

        const call1args = pushMessageStub.args[1];
        const [groupId, dummy] = call1args;
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
            _id: "507f1f77bcf86cd799430001",
            avatar: "alice_url",
            name: "Alice",
          }
        }]);
      });

      it('sendMessage, filtering by `startingId`', async () => {
        const messages = await server.getMessagesOfTopic({
          topicId: topicFixtures.topic1Group1._id.toHexString(), 
          limit: 20,
        });
        expect(messages).to.have.lengthOf(3);
        // the most recent message
        expect(messages[2]).to.containSubset({
          text: messageText,
          user: {
            name: 'Alice',
          },
        });
      });

      it('topic sort order', async () => {
        const topics = await server.getTopicsOfGroup(groupFixtures.firstGroup._id.toHexString(), 20, 'startingId1');
        expect(_.map(topics, 'name')).to.eql([ 'Topic 1 Group 1', 'Topic 2 Group 1']);
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
        let navigation = { goBack: () => {} };
        const groupId = groupFixtures.secondGroup._id.toHexString();
        localDispatch({ 
          type: 'new topic name', 
          payload: { name: topicName },
        });
        await newTopicActions.createTopic(navigation, groupId)(localDispatch, localGetState);
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
        expect(_.map(groups, 'name')).to.eql([ 'Second Group', 'First Group']);
      });

    });

    it('createGroup', async () => {
      setCurrentUser(userFixtures.robert);
      const result = await server.createGroup('new group 1');
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
      await rootActions.leaveGroup(groupId, { navigate() {} })(localDispatch, localGetState);
      const groups = await server.getOwnGroups();
      expect(groups).to.eql([
        {
          id: groupFixtures.secondGroup._id.toHexString(),
          imgUrl: 'url2',
          name: 'Second Group',
        }
      ]);
      expect(localGetState().base.ownGroups).to.eql([
        {
          id: groupFixtures.secondGroup._id.toHexString(),
          imgUrl: 'url2',
          name: 'Second Group',
        }
      ]);
    });

    describe('joinGroup', () => {

      it('User already joined the group', async () => {
        setCurrentUser(userFixtures.alice);
        const groupId = groupFixtures.firstGroup._id.toHexString();
        let navigatePath;
        const navigation = { navigate: (path) => navigatePath = path };
        await expect(groupsSearchActions.joinGroup(dispatch, navigation, groupId)).to.be.rejectedWith('User already participate in the group');
      });

      it('joined group', async () => {
        setCurrentUser(userFixtures.alice);
        const groupId = groupFixtures.secondGroup._id.toHexString();
        await server.joinGroup(groupId);
        const groups = await server.getOwnGroups();
        expect(groups).to.have.lengthOf(2);
        expect(groups[1].name).to.equal('Second Group');

        const call0args = subscribeStub.args[0];
        const [subscribedFcmToken, subscribedGroup] = call0args;
        expect(subscribedGroup).to.equal(groupId);
      });

    });
  
    it('updateFcmToken', async () => {
      setCurrentUser(userFixtures.robert);
      const fcmToken = 'robertFcmToken345873'
      const result = await server.updateFcmToken(fcmToken);
      expect(result).to.equal('OK');
      const robert = await User.findById(userFixtures.robert._id);
      expect(robert.fcmToken).to.equal(fcmToken);

      const call0args = subscribeStub.args[0];
      const [subscribedFcmToken, firstSubscribedGroupId] = call0args;
      expect(subscribedFcmToken).to.equal(fcmToken);
      expect(firstSubscribedGroupId).to.equal(userFixtures.robert.groups[0].toHexString());
    });

  });

});
