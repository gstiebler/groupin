const sinon = require('sinon');
const graphqlConnect = require('../../../mobile/lib/graphqlConnect');
const server = require('../../../mobile/lib/server');
const { graphql } = require('graphql');
const schema = require('../graphqlSchema');
const expect = require('chai').expect;

describe('main', () => {

  before(() => {
    sinon.stub(graphqlConnect, 'sendQuery').callsFake(async (query) => {
      try {
        const result = await graphql(schema, query);
        return result.data;
      } catch(error) {
        console.error(error);
      }
    });
  });

  it('sendMessage', async () => {
    const result = await server.sendMessage('message 1');
    expect(result).to.equal('world');
  });

});
