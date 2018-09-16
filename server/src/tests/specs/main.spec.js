const sinon = require('sinon');
const server = require('../../../../mobile/lib/server');
const pushService = require('../../pushService');
const expect = require('chai').expect;
const { initFixtures } = require('../fixtures');
const mongooseConfig = require('../../config/mongoose');
const logger = require('../../config/winston');
const Message = require('../../db/schema/Message');
const userFixtures = require('../fixtures/userFixtures');
const groupFixtures = require('../fixtures/groupFixtures');
const topicFixtures = require('../fixtures/topicFixtures');
const messageFixtures = require('../fixtures/messageFixtures');
const _ = require('lodash');

const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

let pushMessageStub;

describe('main', () => {

  describe('reading', () => {

    before(async () => {
      await initFixtures();
    });

    it('getOwnGroups', async () => {
      const groups = await server.getOwnGroups(userFixtures.robert._id.toHexString());
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

    describe('sendMessage', () => {
      const alice = userFixtures.alice;
      const messageText = 'new message 1 from Alice';
      let result;

      beforeEach(async () => {
        result = await server.sendMessage(messageText, alice._id.toHexString(), alice.name, 
          topicFixtures.topic1Group2._id.toHexString());
      });

      it('push', async () => {
        const call0args = pushMessageStub.args[0];
        expect(call0args).to.have.lengthOf(2);
        expect(call0args[0]).to.equal('my-channel');
        expect(call0args[1]).to.eql({
          message: messageText,
          topicId: topicFixtures.topic1Group2._id.toHexString(),
          authorName: alice.name,
        });      
        expect(result).to.equal('OK');
      });

      it('message was added to DB', async () => {
        const messages = await server.getMessagesOfTopic(topicFixtures.topic1Group2._id.toHexString(), 20, 'startingId1');;
        expect(messages).to.have.lengthOf(2);
        // the most recent message
        expect(messages[0]).to.containSubset({
          text: messageText,
          user: {
            name: 'Alice',
          },
        });
      });

      it('topic sort order', async () => {
        const topics = await server.getTopicsOfGroup(groupFixtures.secondGroup._id.toHexString(), 20, 'startingId1');
        expect(_.map(topics, 'name')).to.eql([ 'Topic 1 Group 2', 'Topic 2 Group 2']);
      });

      it('group sort order', async () => {
        const groups = await server.getOwnGroups(userFixtures.robert._id.toHexString());
        expect(_.map(groups, 'name')).to.eql([ 'Second Group', 'First Group']);
      });
    });

    it('createGroup', async () => {
      const result = await server.createGroup('new group 1');
      expect(result).to.equal('OK');
    });
  
    it('createTopic', async () => {
      const result = await server.createTopic('new group 1');
      expect(result).to.equal('OK');
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
