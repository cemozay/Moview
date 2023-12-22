import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
const CategoryHeader = (props: any) => {
  return (
    <TouchableOpacity className="flex-row  items-center">
      <Text className="color-white px-3 py-7 text-2xl">{props.title}</Text>
      <Icon
        className="color-white self-center"
        name="chevron-right"
        size={20}
      />
    </TouchableOpacity>
  );
};
export default CategoryHeader;
