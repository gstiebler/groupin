const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require('graphql');

const pushMessage = require('./pushService');

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'RootQueryTypess',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          pushMessage('my-channel', req.body);
        }
      }
    }
  }),
});

module.exports = schema;
