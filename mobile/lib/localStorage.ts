import { AsyncStorage } from 'react-native'; // TODO: replace by @react-native-async-storage/async-storage

export class LocalStorage {
  async getItem(key: string): Promise<unknown> {
    const res = await AsyncStorage.getItem(key);
    return res ? JSON.parse(res) : null;
  }
  
  async setItem(key: string, value: unknown) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }
}

export const localStorage = new LocalStorage();
