import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";

type CategoryHeaderProps = {
  title: string;
};

const CategoryHeader = (props: CategoryHeaderProps) => {
  return (
    <TouchableOpacity className="flex-row  items-center">
      <Text className="color-white pl-3 pr-2 py-3 text-2xl">{props.title}</Text>
      <Icon color={"white"} name="chevron-right" size={12} />
    </TouchableOpacity>
  );
};
export default CategoryHeader;
