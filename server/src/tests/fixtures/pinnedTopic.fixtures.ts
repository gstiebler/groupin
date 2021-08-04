import { PinnedTopic } from "../../db/schema/PinnedTopic";
import { topicIds } from "./preIds";
import userFixtures from "./userFixtures";

const pinnedTopics: Partial<PinnedTopic>[] = [
  {
    topicId: topicIds.topic1Group2,
    userId: userFixtures.robert._id,
  },
  {
    topicId: topicIds.topic2Group1,
    userId: userFixtures.robert._id,
  },
];

export default pinnedTopics;
