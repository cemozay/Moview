import { View, TouchableOpacity } from "react-native";
import React from "react";
import EvilIcons from "@expo/vector-icons/EvilIcons";

type HandleAddItemType = () => void;

const SettingsFooterComponents: React.FC<{
  handleAddItem: HandleAddItemType;
}> = ({ handleAddItem }) => {
  return (
    <View>
      <TouchableOpacity
        onPress={handleAddItem}
        className=" justify-center items-center m-2"
      >
        <EvilIcons name="plus" size={48} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default SettingsFooterComponents;
