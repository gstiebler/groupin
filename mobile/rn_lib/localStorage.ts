import { AsyncStorage } from 'react-native'; // TODO: replace by @react-native-async-storage/async-storage
import { GiMessage } from '../lib/messages';
import { IStorage } from '../types/Storage.types';

export class LocalStorage implements IStorage {
  async getMessages(key: string): Promise<GiMessage[]> {
    const res = await AsyncStorage.getItem(key);
    return res ? JSON.parse(res) : null;
  }
  
  async setMessages(key: string, value: GiMessage[]) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }
}

export const localStorage = new LocalStorage();
