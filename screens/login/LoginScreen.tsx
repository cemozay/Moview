import React, { useState } from "react";
import { View, Text, TextInput, ImageBackground } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { OutsideStackParamList } from "../../navigation/OutsideNavigation";
import CustomButton from "../../components/CustomButton";
import { FirebaseAuth } from "../../firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

type LoginScreenProp = NativeStackScreenProps<OutsideStackParamList, "Login">;

const LoginScreen = ({ navigation }: LoginScreenProp) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(FirebaseAuth, email, password);
      navigation.navigate("InsideNavigation", {
        screen: "HomeStack",
        params: {
          screen: "Home",
        },
      });
    } catch (error: any) {
      console.error(error);
      alert("Log In Failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = GoogleAuthProvider.credential(userInfo.idToken);
      await signInWithCredential(FirebaseAuth, googleCredential);
      navigation.navigate("InsideNavigation", {
        screen: "HomeStack",
        params: {
          screen: "Home",
        },
      });
    } catch (error: any) {
      console.error(error);
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          alert("Sign in cancelled");
          break;
        case statusCodes.IN_PROGRESS:
          alert("Sign in in progress");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          alert("Play services not available");
          break;
        default:
          alert("Google Sign-In Failed: " + error.message);
          break;
      }
    }
  };

  const backgroundImage = require("../profile.jpg");

  return (
    <View className="flex-1">
      <View className="w-scren justify-end h-3/6">
        <ImageBackground className="w-full h-full" source={backgroundImage} />
        <View className="w-screen items-end h-16 bg-black">
          <Text className="text-4xl pr-16 color-white ">Moview</Text>
        </View>
      </View>

      <View className="flex-1 bg-black p-6">
        <TextInput
          className="text-white bg-stone-800 h-12 border-gray-500 rounded-full border mb-3 pl-2"
          onChangeText={(text) => setEmail(text)}
          placeholder="Username"
          placeholderTextColor="white"
          value={email}
        />
        <TextInput
          className="text-white bg-stone-800 h-12 border-gray-500 rounded-full border mb-3 pl-2"
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          placeholderTextColor="white"
          value={password}
          secureTextEntry
        />

        <Text
          className="text-right mb-4 color-white "
          onPress={() => navigation.navigate("ForgotPassword")}
        >
          Forgot password?
        </Text>
        <CustomButton
          classNameProp="mb-4 h-12"
          title="Log in"
          loading={loading}
          onPress={handleLogin}
        />

        <Text className="text-center mb-4 color-white">Or sign in with </Text>
        <View className="h-0.5 w-36 bg-white self-center" />

        <View className="flex flex-row justify-center">
          <CustomButton
            classNameProp="w-1/5 my-4 mx-1 bg-white-500"
            title="G"
            onPress={handleGoogleSignIn}
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

        <View className="h-0.5 w-36 bg-white self-center" />

        <View>
          <Text
            className="text-center color-white"
            onPress={() => navigation.navigate("SignUp")}
          >
            I dont have an account{" "}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
