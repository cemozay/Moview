import React, { useState } from "react";
import { View, Text, TextInput, Button, ImageBackground } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { OutsideStackParamList } from "navigation/OutsideNavigation";

type ForgotPasswordScreenProp = NativeStackScreenProps<
  OutsideStackParamList,
  "ForgotPassword"
>;

const ForgotPasswordScreen = ({}: ForgotPasswordScreenProp) => {
  const [username, setUsername] = useState("");

  const handleForgot = () => {};

  const backgroundImage = require("./profile.jpg");

  return (
    <View className="flex-1">
      <View className="w-scren justify-end h-1/3">
        <ImageBackground className="w-full h-full" source={backgroundImage} />
        <View className="w-screen bg-black rounded-t-full self-center absolute h-12" />
      </View>
      <View className="flex-1 bg-black p-10">
        <Text className="mb-2 color-white">Email:</Text>
        <TextInput
          className="h-10 border-gray-500 border mb-4 pl-2"
          onChangeText={(text) => setUsername(text)}
          value={username}
        />
        <Button title="Send Email" onPress={handleForgot} />
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
