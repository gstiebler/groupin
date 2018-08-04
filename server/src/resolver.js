const {
  GraphQLString
} = require('graphql');

const pushService = require('./pushService');

const Mutation = {
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

module.exports = {
  Mutation,
};