const sinon = require('sinon');
const graphqlConnect = require('../../../mobile/lib/graphqlConnect');
const server = require('../../../mobile/lib/server');
const pushService = require('../pushService');
const { graphql } = require('graphql');
const schema = require('../graphqlSchema');
const expect = require('chai').expect;

let pushMessageStub;

describe('main', () => {

  before(() => {
    sinon.stub(graphqlConnect, 'sendQuery').callsFake(async (query) => {
      try {
        const result = await graphql(schema, query);
        if (result.errors) {
          console.error(result.errors);
        } else {
          return result.data;
        }
      } catch(error) {
        console.error(error);
      }
    });
  });

  beforeEach(() => {
    pushMessageStub = sinon.stub(pushService, 'pushMessage');
  });

  afterEach(() => {
    pushMessageStub.restore();
  });

  it('sendMessage', async () => {
    const result = await server.sendMessage('message 1', 'topic 1', 'author name 1');
    const call0args = pushMessageStub.args[0];
    expect(call0args).to.have.lengthOf(2);
    expect(call0args[0]).to.equal('my-channel');
    expect(call0args[1]).to.eql({
      message: 'message 1',
      topicId: 'topic 1',
      authorName: 'author name 1',
    });
    expect(result).to.equal('OK');
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

  it('getOwnGroups', async () => {
    const result = await server.getOwnGroups();
    expect(result).to.eql([
      {
        id: 'groupId1',
        name: 'Group 1',
        imgUrl: 'url1',
      },
      {
        id: 'groupId2',
        name: 'Group 2',
        imgUrl: 'url2',
      },
    ]);
  });

  it('getTopicsOfGroup', async () => {
    const result = await server.getTopicsOfGroup('groupId1', 20, 'startingId1');
    expect(result).to.eql([
      {
        id: 'topicId1',
        name: 'Topic 1',
        imgUrl: '',
      },
      {
        id: 'topicId2',
        name: 'Topic 2',
        imgUrl: '',
      },
    ]);
  });

  it('getMessagesOfTopic', async () => {
    const result = await server.getMessagesOfTopic('groupId1', 20, 'startingId1');
    expect(result).to.eql([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: Date.parse('2018-06-01T12:00:00-0800'),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 3,
        text: 'Hello developer 2',
        createdAt: Date.parse('2018-05-01T12:00:00-0800'),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  });

});
