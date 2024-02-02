import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const getStorageBoolean = (key: string): boolean | null => {
    try {
        return storage.getBoolean(key) ?? null;
    } catch (error) {
        console.log('Error retrieving value: ', error);
        return null;
    }
};

export const getStorageString = (key: string): string | null => {
    try {
        return storage.getString(key) ?? null;
    } catch (error) {
        console.log('Error retrieving value: ', error);
        return null;
    }
};

export const getStorageNumber = (key: string): number | null => {
    try {
        return storage.getNumber(key) ?? null;
    } catch (error) {
        console.log('Error retrieving value: ', error);
        return null;
    }
};

export const setStorageItem = (key: string, value: boolean | string | number | Uint8Array): void => {
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
};
