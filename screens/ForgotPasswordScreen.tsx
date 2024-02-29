import React, { useState } from "react";
import { View, Text, TextInput, ImageBackground } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { OutsideStackParamList } from "navigation/OutsideNavigation";
import CustomButton from "../components/CustomButton";

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
      <View className="w-scren justify-end h-3/6">
        <ImageBackground className="w-full h-full" source={backgroundImage} />
        <View className="w-scren justify-end">
          <View className="w-screen items-center justify-end bg-black rounded-t-full self-center absolute h-28">
            <Text className="text-4xl color-white absolute">
              Forgot Password
            </Text>
          </View>
        </View>
        <View className="w-screen items-center h-16 bg-black">
          <Text className="color-white text-xl">
            Giriş Yaparken Sorun mu Yaşıyorsun?
          </Text>
        </View>
      </View>
      <View className="flex-1 bg-black px-10">
        <Text className="color-white pb-4 text-balance text-1xl">
          E-posta adresini, telefon numaranı veya kullanıcı adını gir ve
          hesabına yeniden girebilmen için sana bir bağlantı gönderelim.
        </Text>
        <TextInput
          className="text-white bg-stone-800 h-12 border-gray-500 rounded-full border mb-3 pl-2"
          onChangeText={(text) => setUsername(text)}
          placeholder="Email"
          placeholderTextColor="white"
          value={username}
        />

        <CustomButton
          classNameProp="mb-4 h-12"
          title="Send Email"
          onPress={() => {
            handleForgot;
          }}
        />
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
