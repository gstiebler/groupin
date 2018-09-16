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

const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);

let pushMessageStub;

describe('main', () => {

  beforeEach(async () => {
    pushMessageStub = sinon.stub(pushService, 'pushMessage');
  });

  afterEach(() => {
    pushMessageStub.restore();
  });

  describe('reading', () => {

    before(async () => {
      await initFixtures();
    });

    it('getOwnGroups', async () => {
      const result = await server.getOwnGroups(userFixtures.robert._id.toHexString());
      expect(result).containSubset([
        {
          name: 'Second Group',
          imgUrl: 'url2',
        },
        {
          name: 'First Group',
          imgUrl: 'url1',
        },
      ]);
    });
  
    it('getTopicsOfGroup', async () => {
      const result = await server.getTopicsOfGroup(groupFixtures.firstGroup._id.toHexString(), 20, 'startingId1');
      expect(result).containSubset([
        {
          name: 'Topic 2 Group 1',
          imgUrl: 't2g1_url',
        },
        {
          name: 'Topic 1 Group 1',
          imgUrl: 't1g1_url',
        },
      ]);
    });
  
    it('getMessagesOfTopic', async () => {
      const result = await server.getMessagesOfTopic(topicFixtures.topic1Group1._id.toHexString(), 20, 'startingId1');
      expect(result).containSubset([
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
    });
    
  });

  describe('writting', () => {

    beforeEach(async () => {
      await initFixtures();
    });

    it('sendMessage', async () => {
      const alice = userFixtures.alice;
      const result = await server.sendMessage('new message 1 from Alice', alice._id.toHexString(), alice.name, 
        topicFixtures.topic2Group1._id.toHexString());

      // test push
      const call0args = pushMessageStub.args[0];
      expect(call0args).to.have.lengthOf(2);
      expect(call0args[0]).to.equal('my-channel');
      expect(call0args[1]).to.eql({
        message: 'new message 1 from Alice',
        topicId: topicFixtures.topic2Group1._id.toHexString(),
        authorName: alice.name,
      });      
      expect(result).to.equal('OK');

      // test message was added to DB
      const messages = await Message.find().sort({createdAt: -1}).lean();
      expect(messages).to.have.lengthOf(4);
      expect(messages[3]).to.containSubset({
        text: 'new message 1 from Alice',
        user: alice._id,
        topic: topicFixtures.topic2Group1._id,
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
