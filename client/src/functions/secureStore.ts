import * as SecureStore from 'expo-secure-store';
import { changeAccessToken } from '../stores';

export const setSecureStore = async (key: string, value: string) => await SecureStore.setItemAsync(key, value);
export const deleteSecureStore = async (key: string) => await SecureStore.deleteItemAsync(key);

export const getSecureStoreValueByKey = async (key: string) => {
  let result = await SecureStore.getItemAsync(key).catch((err) => {
    console.error('SecureStorage not working on Web');
    throw err;
  });
  if (result) {
    return result;
  } else {
    return null;
  }
};
