import React, { useState } from "react";
import { View, Text, TextInput, ImageBackground } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { OutsideStackParamList } from "navigation/OutsideNavigation";
import CustomButton from "../components/CustomButton";
import { FirebaseAuth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

type SignUpScreenProp = NativeStackScreenProps<OutsideStackParamList, "SignUp">;

const SignUpScreen = ({ navigation }: SignUpScreenProp) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FirebaseAuth;

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
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
      <View className="w-scren justify-end h-1/3">
        <ImageBackground className="w-full h-full" source={backgroundImage} />

        <View className="w-screen items-center justify-center bg-black rounded-t-full self-center absolute h-12">
          <Text className="text-3xl color-white absolute">Moview</Text>
        </View>
      </View>

      <View className="flex-1 bg-black p-10">
        <Text className="mb-2 color-white">Email</Text>
        <TextInput
          className="h-10 border-gray-500 border mb-4 pl-2"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />

        <Text className="mb-2 color-white">Password</Text>
        <TextInput
          className="h-10 border-gray-500 border mb-4 pl-2"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />

        <CustomButton
          classNameProp="mb-4"
          title="Sign up"
          loading={loading}
          onPress={handleSignUp}
        />

        <Text className="mb-4 color-white">------------ OR -----------</Text>

        <View className="flex flex-row justify-center">
          <CustomButton
            classNameProp="w-1/6 mb-4 mx-1 bg-white-500"
            title="G"
            onPress={() => {}}
          />

          <CustomButton
            classNameProp="w-1/6 mb-4 mx-1 bg-white-500"
            title="T"
            onPress={() => {}}
          />

          <CustomButton
            classNameProp="w-1/6 mb-4 mx-1 bg-white-500"
            title="F"
            onPress={() => {}}
          />
        </View>

        <Text className="mb-4 color-white">
          ---------------------------------------
        </Text>
      </View>
    </View>
  );
};

export default SignUpScreen;
