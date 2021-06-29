import { AsyncStorage } from 'react-native'; // TODO: replace by @react-native-async-storage/async-storage

export async function getItem(key: string) {
  const res = await AsyncStorage.getItem(key);
  return res ? JSON.parse(res) : null;
}

export async function setItem(key: string, value: unknown) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
