import { AsyncStorage } from 'react-native';

const TOKEN_KEY = 'token';

export function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}
