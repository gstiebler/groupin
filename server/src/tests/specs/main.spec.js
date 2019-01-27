const sinon = require('sinon');
const server = require('../../../../mobile/lib/server');
const pushService = require('../../pushService');
const expect = require('chai').expect;
const { initFixtures } = require('../fixtures');
const logger = require('../../config/winston');
const userFixtures = require('../fixtures/userFixtures');
const groupFixtures = require('../fixtures/groupFixtures');
const topicFixtures = require('../fixtures/topicFixtures');
const messageFixtures = require('../fixtures/messageFixtures');
const _ = require('lodash');
const { setCurrentUser } = require('./index.spec');
const User = require('../../db/schema/User');
const md5 = require('md5');

// TODO: test thrown exceptions

let pushMessageStub;

describe('main', () => {

  describe('reading', () => {

    before(async () => {
      await initFixtures();
    });

    it('getOwnGroups', async () => {
      setCurrentUser(userFixtures.robert);
      const groups = await server.getOwnGroups();
      expect(groups).containSubset([
        {
          name: 'First Group',
          imgUrl: 'url1',
        },
        {
          name: 'Second Group',
          imgUrl: 'url2',
        },
      ]);
      // test order
      expect(_.map(groups, 'name')).to.eql([ 'First Group', 'Second Group']);
    });
  
    it('getTopicsOfGroup', async () => {
      setCurrentUser(userFixtures.robert);
      const topics = await server.getTopicsOfGroup(groupFixtures.firstGroup._id.toHexString(), 20, 'startingId1');
      expect(topics).containSubset([
        {
          name: 'Topic 1 Group 1',
          imgUrl: 't1g1_url',
        },
        {
          name: 'Topic 2 Group 1',
          imgUrl: 't2g1_url',
        },
      ]);
      // test order
      expect(_.map(topics, 'name')).to.eql([ 'Topic 1 Group 1', 'Topic 2 Group 1']);
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
    
  });

  describe('writting', () => {

    beforeEach(async () => {
      pushMessageStub = sinon.stub(pushService, 'pushMessage');
      await initFixtures();
    });

    afterEach(() => {
      pushMessageStub.restore();
    });

    it('register', async () => {
      const password = 'smallpassword';
      const token = await server.register({
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

    it('login', async () => {
      const password = 'smallpassword';
      const token = await server.login({
        userName: '44448',
        password: 'passwordAlice',
      });
      expect(token).to.equal('46894278465624393Alice');
    });

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
        expect(call0args[0]).to.equal('my-channel');
        expect(call0args[1]).to.eql({
          message: messageText,
          topicId: topicFixtures.topic1Group1._id.toHexString(),
          authorName: alice.name,
        });      
        expect(result).to.equal('OK');
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
        expect(call0args[1]).to.eql({
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
  
    it('joinGroup', async () => {
      const result = await server.joinGroup('group 1');
      expect(result).to.equal('OK');
    });
  
    it('leaveGroup', async () => {
      const result = await server.leaveGroup('group 1');
      expect(result).to.equal('OK');
    });

  });

});
