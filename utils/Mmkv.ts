import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

/* export const getStorageItem = (key: string): any => {
    try {
        return storage.getString(key);
    } catch (error) {
        console.log('Error retrieving value: ', error);
        return null;
    }
};

export const setStorageItem = (key: string, value: any): void => {
    try {
        storage.set(key, value);
    } catch (error) {
        console.log('Error storing value: ', error);
    }
};

export const removeStorageItem = (key: string): void => {
    try {
        storage.delete(key);
    } catch (error) {
        console.log('Error deleting value: ', error);
    }
}; */
