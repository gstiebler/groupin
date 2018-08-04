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
    pushMessageStub.reset();
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

});
