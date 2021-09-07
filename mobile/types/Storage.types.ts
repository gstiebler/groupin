import { GiMessage } from "../lib/messages";

export interface IStorage {
  setMessages: (topicId: string, messages: GiMessage[]) => Promise<void>;
  getMessages: (topicId: string) => Promise<GiMessage[]>;
  setAuthToken: (authToken: string) => Promise<void>;
  getAuthToken: () => Promise<string>;
}
