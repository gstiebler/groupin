const {
  GraphQLSchema,
  GraphQLObjectType,
} = require('graphql');

const resolver = require('./resolver');

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      ...resolver.Query,
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      ...resolver.Mutation,
    }
  }),
});

module.exports = schema;
