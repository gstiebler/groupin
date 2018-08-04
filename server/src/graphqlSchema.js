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
          message: { type: GraphQLString },
          authorName: { type: GraphQLString }, // TODO: temporary, should be removed when auth is in place
          topicId: { type: GraphQLString },
        },
        resolve(root, { message, authorName, topicId }, source, fieldASTs) {
          const payload = {
            message,
            authorName,
            topicId,
          };
          pushService.pushMessage('my-channel', payload);
          return 'OK';
        }
      }
    }
  }),
});

module.exports = schema;
