import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";

type CategoryHeaderProps = {
  title: string;
};

const CategoryHeader = (props: CategoryHeaderProps) => {
  return (
    <TouchableOpacity className="flex-row justify-between	 w-full">
      <View className="flex-row  items-center">
        <Text className="color-white pl-3 pr-2 py-3 text-2xl">
          {props.title}
        </Text>
        <Icon color={"white"} name="chevron-right" size={12} />
      </View>
      <View className="flex-row pr-3 items-center">
        <Text className="color-orange-400 pl-3 pr-2 py-3 text-xs">
          See More
        </Text>
        <Icon color={"orange"} name="chevron-right" size={8} />
      </View>
    </TouchableOpacity>
  );
};
export default CategoryHeader;
