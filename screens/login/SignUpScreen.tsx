import React, { useState } from "react";
import { View, Text, TextInput, ImageBackground } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { OutsideStackParamList } from "navigation/OutsideNavigation";
import CustomButton from "../../components/CustomButton";
import { FirebaseAuth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

type SignUpScreenProp = NativeStackScreenProps<OutsideStackParamList, "SignUp">;

const SignUpScreen = ({ navigation }: SignUpScreenProp) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(FirebaseAuth, email, password);
      navigation.navigate("InsideStack");
    } catch (error: any) {
      console.error(error);
      alert("Sign up Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const backgroundImage = require("./profile.jpg");

  return (
    <View className="flex-1">
      <View className="w-scren justify-end h-3/6">
        <ImageBackground className="w-full h-full" source={backgroundImage} />
        <View className="w-scren justify-end">
          <View className="w-screen items-center justify-end bg-black rounded-t-full self-center absolute h-28">
            <Text className="text-4xl color-white absolute">Sign Up</Text>
          </View>
        </View>
        <View className="w-screen items-end h-16 bg-black"></View>
      </View>

      <View className="flex-1 bg-black px-6">
        <TextInput
          className="text-white bg-stone-800 h-12 border-gray-500 rounded-full border mb-4 pl-2"
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          placeholderTextColor="white"
          value={email}
        />

        <TextInput
          className="text-white bg-stone-800 h-12 border-gray-500 rounded-full border mb-4 pl-2"
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          placeholderTextColor="white"
          value={password}
          secureTextEntry
        />
        <TextInput
          className="text-white bg-stone-800 h-12 border-gray-500 rounded-full border mb-4 pl-2"
          placeholder="Kullanıcı Adı"
          placeholderTextColor="white"
        />

        <CustomButton
          classNameProp="mb-4 h-12"
          title="Sign up"
          loading={loading}
          onPress={handleSignUp}
        />
        <Text className="text-center mb-4 color-white">Or sign up with </Text>
        <View className="h-0.5 w-36 bg-white self-center" />

        <View className="flex flex-row justify-center">
          <CustomButton
            classNameProp="w-1/5 my-4 mx-1 bg-white-500"
            title="G"
            onPress={() => {}}
          />

          <CustomButton
            classNameProp="w-1/5 my-4 mx-1 bg-white-500"
            title="T"
            onPress={() => {}}
          />

          <CustomButton
            classNameProp="w-1/5 my-4 mx-1 bg-white-500"
            title="F"
            onPress={() => {}}
          />
        </View>
      </View>
    </View>
  );
};

export default SignUpScreen;
