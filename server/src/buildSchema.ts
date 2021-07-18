import { buildSchemaSync } from "type-graphql";
import { RootResolver } from "./resolvers/rootResolver";

const schema = buildSchemaSync({
  resolvers: [RootResolver]
});

export default schema;
