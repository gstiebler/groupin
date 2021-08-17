import { GiMessage } from "../lib/messages";

export interface IStorage {
  setMessages: (topicId: string, messages: GiMessage[]) => Promise<void>;
  getMessages: (topicId: string) => Promise<GiMessage[]>;
  setExternalUserToken: (externalUserToken: string) => Promise<void>;
  getExternalUserToken: () => Promise<string>;
}
