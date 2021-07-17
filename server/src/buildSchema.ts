import { buildSchema } from "type-graphql";
import { RootResolver } from "./resolvers/rootResolver";

buildSchema({
  resolvers: [RootResolver],
  emitSchemaFile: __dirname + '/../.build/schema.gql',
});
