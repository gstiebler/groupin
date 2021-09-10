import { Navigation } from "../rn_lib/Navigator.types";
import { GroupStore } from "../stores/groupStore";
import { TopicStore } from "../stores/topicStore";

type MessageType = 'NEW_MESSAGE' | 'NEW_TOPIC';

export type NotificationData = {
  message?: string;
  authorName: string;
  groupId: string;
  topicId: string;
  topicName?: string;
  messageId?: string;
  type: MessageType;
}

export type NotificationProcessingParams = {
  notificationData: NotificationData;
  groupStore: GroupStore;
  topicStore: TopicStore;
  navigation: Navigation;
}