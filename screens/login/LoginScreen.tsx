import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { OutsideStackParamList } from "../../navigation/OutsideNavigation";
import CustomButton from "../../components/CustomButton";
import { FirebaseAuth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

type LoginScreenProp = NativeStackScreenProps<OutsideStackParamList, "Login">;

const { height } = Dimensions.get("window");

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

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Back Button */}
      <View className="absolute top-12 left-4 z-10">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-gray-800 rounded-full items-center justify-center border border-gray-700"
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Image Section - 30% of screen */}
      <View style={{ height: height * 0.2 }} className="relative">
        <View className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 items-center justify-center relative overflow-hidden">
          {/* Background decorative elements */}
          <View className="absolute top-6 left-4 w-3 h-3 bg-white/10 rounded-full" />
          <View className="absolute top-8 right-6 w-2 h-2 bg-white/20 rotate-45" />
          <View className="absolute bottom-8 left-6 w-4 h-4 border-2 border-white/10 rounded-full" />

          {/* Login illustration */}
          <View className="items-center justify-center flex-1">
            {/* Simple login icon representation */}
            <View className="bg-gray-700 rounded-full p-6 shadow-xl">
              <View className="w-20 h-20 bg-gray-800 rounded-full items-center justify-center relative">
                {/* User icon */}
                <View className="w-8 h-8 bg-white/80 rounded-full mb-1" />
                <View className="w-12 h-6 bg-white/80 rounded-t-full" />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View className="flex-1 justify-center px-6">
        <View className="mb-6">
          <Text className="text-4xl font-bold text-white text-center mb-2">
            Welcome to
          </Text>
          <Text className="text-4xl font-bold text-white text-center">
            Moview
          </Text>
          <Text className="text-lg text-gray-400 text-center mt-4">
            Sign in to continue
          </Text>
        </View>

        {/* Login Form */}
        <View className="space-y-4">
          <TextInput
            className="text-white bg-gray-800 h-14 rounded-2xl px-4 border border-gray-700"
            onChangeText={(text) => setEmail(text)}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            className="text-white bg-gray-800 h-14 rounded-2xl px-4 border border-gray-700"
            onChangeText={(text) => setPassword(text)}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            secureTextEntry
          />

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
            className="self-end py-2"
          >
            <Text className="text-gray-400 text-sm">Forgot password?</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <View className="mt-6">
          <CustomButton
            classNameProp="h-14 bg-white"
            title="Sign In"
            loading={loading}
            onPress={handleLogin}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
