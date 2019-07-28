import { AsyncStorage } from 'react-native';

export default {

  async getItem(key) {
    const res = await AsyncStorage.getItem(key);
    return res ? JSON.parse(res) : null;
  },

  async setItem(key, value) {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

};
