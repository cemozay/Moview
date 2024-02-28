import React, { useState } from "react";
import { View, Text, TextInput, ImageBackground } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { OutsideStackParamList } from "../navigation/OutsideNavigation";
import CustomButton from "../components/CustomButton";
import { FirebaseAuth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

type LoginScreenProp = NativeStackScreenProps<OutsideStackParamList, "Login">;

const LoginScreen = ({ navigation }: LoginScreenProp) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FirebaseAuth;

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("InsideStack");
    } catch (error: any) {
      console.error(error);
      alert("Log In Failed: " + error.message);
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
        <Text className="mb-2 color-white">Username</Text>
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

        <Text
          className="mb-4 color-blue-500"
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          Forgot password?
        </Text>
        <CustomButton
          classNameProp="mb-4"
          title="Log in"
          loading={loading}
          onPress={handleLogin}
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

        <View>
          <Text className="color-white">
            Don't have an account?{" "}
            <Text
              className="color-blue-500"
              onPress={() => navigation.navigate("SignUp")}
            >
              Sign up
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
