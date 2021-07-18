import { buildSchemaSync } from "type-graphql";
import { GroupResolver } from "./resolvers/group.resolver";
import { MessageResolver } from "./resolvers/message.resolver";
import { RootResolver } from "./resolvers/rootResolver";
import { TopicResolver } from "./resolvers/topic.resolver";

const schema = buildSchemaSync({
  resolvers: [RootResolver, MessageResolver, GroupResolver, TopicResolver]
});

export default schema;
