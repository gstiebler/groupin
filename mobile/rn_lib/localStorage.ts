import { AsyncStorage } from 'react-native'; // TODO: replace by @react-native-async-storage/async-storage
import { GiMessage } from '../lib/messages';
import { IStorage } from '../types/Storage.types';

export class LocalStorage implements IStorage {
  externalUserTokenKey = 'externalUserTokenKey';

  async getMessages(topicId: string): Promise<GiMessage[]> {
    const res = await AsyncStorage.getItem(topicId);
    return res ? JSON.parse(res) : null;
  }
  
  async setMessages(topicId: string, value: GiMessage[]) {
    await AsyncStorage.setItem(topicId, JSON.stringify(value));
  }

  async getExternalUserToken(): Promise<string> {
    return await AsyncStorage.getItem(this.externalUserTokenKey);
  }

  async setExternalUserToken(externalUserToken: string) {
    await AsyncStorage.setItem(this.externalUserTokenKey, externalUserToken);
  }
}

export const localStorage = new LocalStorage();
