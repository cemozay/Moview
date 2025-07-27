import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";

type CategoryHeaderProps = {
  title: string;
  onPress: () => void;
};

const CategoryHeader = (props: CategoryHeaderProps) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      className="flex-row justify-between w-full rounded-lg my-2 px-4 py-3 "
    >
      <View className="flex-row items-center">
        <Text className="color-white text-2xl font-bold">{props.title}</Text>
      </View>
      <View className="flex-row items-center">
        <Text className="color-orange-400 text-sm font-medium mr-2">
          See More
        </Text>
        <Icon color={"#FF5C00"} name="chevron-right" size={12} />
      </View>
    </TouchableOpacity>
  );
};
export default CategoryHeader;
