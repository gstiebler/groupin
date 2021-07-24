import { PinnedTopic } from "../../db/entity/PinnedTopic.entity";
import { topicIds } from "./preIds";
import userFixtures from "./userFixtures";

const pinnedTopics: Partial<PinnedTopic>[] = [
  {
    topicId: topicIds.topic1Group2,
    userId: userFixtures.robert.id,
  },
  {
    topicId: topicIds.topic2Group1,
    userId: userFixtures.robert.id,
  },
];

export default pinnedTopics;