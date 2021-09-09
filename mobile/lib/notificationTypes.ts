import { Navigation } from "../rn_lib/Navigator.types";
import { GroupStore } from "../stores/groupStore";
import { TopicStore } from "../stores/topicStore";

type MessageType = 'NEW_MESSAGE' | 'NEW_TOPIC';

type NotificationData = {
  message?: string;
  authorName: string;
  groupId: string;
  topicId: string;
  topicName?: string;
  messageId?: string;
  type: MessageType;
}

export type GiNotification = {
  notification: {
    data: NotificationData;
  }
}

export type NotificationProcessingParams = {
  giNotification: GiNotification;
  groupStore: GroupStore;
  topicStore: TopicStore;
  navigation: Navigation;
}