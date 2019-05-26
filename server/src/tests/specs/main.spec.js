const sinon = require('sinon');
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

const dispatch = store.dispatch.bind(store);


// TODO: test thrown exceptions

let pushMessageStub;
let subscribeStub;

describe('main', () => {

  describe('reading', () => {

    before(async () => {
      await initFixtures();
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
  
    it('getMessagesOfTopic', async () => {
      setCurrentUser(userFixtures.robert);
      const messages = await server.getMessagesOfTopic(topicFixtures.topic1Group1._id.toHexString(), 20, 'startingId1');
      expect(messages).containSubset([
        {
          _id: messageFixtures.message2topic1._id.toHexString(),
          text: 'Topic 1 Group 1 Robert',
          user: {
            name: 'Robert',
            avatar: 'robert_url',
          },
        },
        {
          text: 'Topic 1 Group 1 Alice',
          user: {
            name: 'Alice',
            avatar: 'alice_url',
          },
        },
      ]);
      expect(_.map(messages, 'text')).to.eql([ 'Topic 1 Group 1 Robert', 'Topic 1 Group 1 Alice']);
    });

    it('getMessagesOfCurrentTopic', async () => {
      const localStore = createStore(rootReducer, {});
      setCurrentUser(userFixtures.robert);
      localStore.dispatch({ 
        type: 'currently viewed topic ID', 
        payload: { currentlyViewedTopicId: topicFixtures.topic1Group1._id.toHexString() } }
      );
      await rootActions.getMessagesOfCurrentTopic(localStore);
      expect(localStore.getState().base.messages).eql([
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
      const { token } = await server.register({
        name: 'Guilherme',
        userName: '(21)999995555',
        password,
      });
      expect(token.length).to.be.greaterThan(15);

      const userByToken = await User.findOne({ token });
      expect(userByToken.phoneNumber).to.equal('(21)999995555');
      expect(userByToken.name).to.equal('Guilherme');
      expect(userByToken.tempPassword).to.be.not.equal(password);

      const userByPassword = await User.findOne({ tempPassword: md5(password) });
      expect(userByPassword.phoneNumber).to.equal('(21)999995555');
    });

    describe('login', () => {

      it('sucessful', async () => {
        const result = await server.login({
          userName: '44448',
          password: 'passwordAlice',
        });

        expect(result.token).to.equal(userFixtures.alice.token);
        expect(result.id).to.equal(userFixtures.alice._id.toHexString());
        expect(result.errorMessage).to.be.null;
      });

      it('invalid password', async () => {
        const result = await server.login({
          userName: '44448',
          password: 'passwordAliceerror',
        });
        expect(result.token).to.be.null;
        expect(result.errorMessage).to.equal('Invalid password');
      });

      it('user not found', async () => {
        const result = await server.login({
          userName: '44448aa',
          password: 'passwordAlice',
        });
        expect(result.token).to.be.null;
        expect(result.errorMessage).to.equal('User not found');
      });

      it('user not found', async () => {
        const result = await server.login({
          userName: '4a',
          password: 'passwordAlice',
        });
        expect(result.token).to.be.null;
        expect(result.errorMessage).to.equal('Username length too short');
      });

    })

    describe('sendMessage', () => {
      const alice = userFixtures.alice;
      const messageText = 'new message 1 from Alice';
      let result;

      beforeEach(async () => {
        result = await server.sendMessage({
          message: messageText, 
          userName: alice.name, 
          topicId: topicFixtures.topic1Group1._id.toHexString(),
        });
      });

      it('push', async () => {
        setCurrentUser(alice);
        const call0args = pushMessageStub.args[0];
        expect(call0args).to.have.lengthOf(2);
        const [topicId, payload] = call0args;
        expect(topicId).to.equal(topicFixtures.topic1Group1._id.toHexString());
        const createdMessage = await Message.findOne({}, {}, { sort: { _id: -1 } });;
        expect(payload).to.eql({
          message: messageText,
          topicId: topicFixtures.topic1Group1._id.toHexString(),
          groupId: groupFixtures.firstGroup._id.toHexString(),
          messageId: createdMessage._id.toHexString(),
          authorName: alice.name,
          type: messageTypes.NEW_MESSAGE,
        });      
        expect(result).to.equal('OK');

        const call1args = pushMessageStub.args[1];
        const [groupId, dummy] = call1args;
        expect(groupId).to.equal(groupFixtures.firstGroup._id.toHexString());
      });

      it('message was added to DB', async () => {
        setCurrentUser(alice);
        const messages = await server.getMessagesOfTopic(topicFixtures.topic1Group1._id.toHexString(), 20, 'startingId1');;
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
        setCurrentUser(alice);
        const topics = await server.getTopicsOfGroup(groupFixtures.firstGroup._id.toHexString(), 20, 'startingId1');
        expect(_.map(topics, 'name')).to.eql([ 'Topic 1 Group 1', 'Topic 2 Group 1']);
      });

    });
  
    describe('createTopic', async () => {
      let result;
      const topicName = 'new topic foca';

      before(() => {
        setCurrentUser(userFixtures.robert);
      });
      
      beforeEach(async () => {
        result = await server.createTopic({
          topicName,
          groupId: groupFixtures.secondGroup._id.toHexString(),
        });
      });

      it('push', async () => {
        const call0args = pushMessageStub.args[0];
        expect(call0args).to.have.lengthOf(2);
        expect(call0args[0]).to.equal(groupFixtures.secondGroup._id.toHexString());
        const newTopic = await Topic.findOne({}, {}, { sort: { _id: -1 } });
        expect(call0args[1]).to.eql({
          type: messageTypes.NEW_TOPIC,
          topicId: newTopic._id.toHexString(),
          groupId: groupFixtures.secondGroup._id.toHexString(),
          topicName,
        });      
        expect(result).to.equal('OK');
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
      setCurrentUser(userFixtures.robert);
      const result = await server.leaveGroup(groupIds.firstGroup.toHexString());
      expect(result).to.equal('OK');
      const groups = await server.getOwnGroups();
      expect(groups).to.have.lengthOf(1);
      expect(groups[0].name).to.equal('Second Group');
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
