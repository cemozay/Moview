import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ActivityComponent = () => {
  const handlePressone = () => {};

  const handlePresstwo = () => {};

  return (
    <View className="justify-center flex-row items-center border-slate-500 border-2 w-screen bg-black h-12">
      <Text className="color-white">Alperen Ağırman liked </Text>
      <TouchableOpacity onPress={handlePressone}>
        <Text className="color-blue-500">CemÖzay</Text>
      </TouchableOpacity>
      <Text className="color-white">'s review of</Text>
      <TouchableOpacity onPress={handlePresstwo}>
        <Text className="color-blue-500">Dune: Part Two</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActivityComponent;
