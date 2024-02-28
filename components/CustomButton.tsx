import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native";

type CustomButtonProps = {
  classNameProp?: string;
  onPress: () => void;
  title?: string;
  loading?: boolean;
};

const CustomButton = (props: CustomButtonProps) => {
  return (
    <TouchableOpacity
      className={`items-center justify-center p-2 rounded-full shadow bg-white ${props.classNameProp}`}
      onPress={props.onPress}
    >
      {props.loading ? (
        <ActivityIndicator className="mt-2" size="small" color="#0000ff" />
      ) : (
        <Text className="text-base font-bold color-black">{props.title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
