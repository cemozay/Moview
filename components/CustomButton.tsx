import React from "react";
import { Text, Pressable } from "react-native";

type CustomButtonProps = {
  classNameProp?: string;
  onPress: () => void;
  title?: string;
};

const CustomButton = (props: CustomButtonProps) => {
  const { classNameProp, onPress, title } = props;
  return (
    <Pressable
      className={`items-center justify-center p-2 rounded-full shadow bg-white ${classNameProp}`}
      onPress={onPress}
    >
      <Text className="text-base font-bold color-black">{title}</Text>
    </Pressable>
  );
};

export default CustomButton;
