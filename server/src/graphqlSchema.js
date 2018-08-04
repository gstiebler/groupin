const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} = require('graphql');

const pushService = require('./pushService');

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
    name: 'RootMutationType',
    fields: {
      sendMessage: {
        type: GraphQLString,
        args: { 
          message: { type: GraphQLString } 
        },
        resolve(root, { message }, source, fieldASTs) {
          pushService.pushMessage('my-channel', message);
          return 'OK';
        }
      }
    }
  }),
});

module.exports = schema;
