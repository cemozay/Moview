import AsyncStorage from "@react-native-async-storage/async-storage";

// AsyncStorage adapter to replace MMKV
export const storage = {
  async getBoolean(key: string): Promise<boolean | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null ? JSON.parse(value) : null;
    } catch (error) {
      console.log("Error retrieving boolean value: ", error);
      return null;
    }
  },
  async setBoolean(key: string, value: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log("Error storing boolean value: ", error);
    }
  },
  async getString(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.log("Error retrieving string value: ", error);
      return null;
    }
  },
  async setString(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log("Error storing string value: ", error);
    }
  },
  async delete(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log("Error deleting value: ", error);
    }
  },
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log("Error clearing storage: ", error);
    }
  },
};

export const getStorageBoolean = async (
  key: string
): Promise<boolean | null> => {
  try {
    return await storage.getBoolean(key);
  } catch (error) {
    console.log("Error retrieving value: ", error);
    return null;
  }
};

export const getStorageString = async (key: string): Promise<string | null> => {
  try {
    return await storage.getString(key);
  } catch (error) {
    console.log("Error retrieving value: ", error);
    return null;
  }
};

export const getStorageNumber = async (key: string): Promise<number | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  } catch (error) {
    console.log("Error retrieving value: ", error);
    return null;
  }
};

export const setStorageItem = async (
  key: string,
  value: boolean | string | number
): Promise<void> => {
  try {
    if (typeof value === "string") {
      await AsyncStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.log("Error storing value: ", error);
  }
};

export const removeStorageItem = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log("Error deleting value: ", error);
  }
};
