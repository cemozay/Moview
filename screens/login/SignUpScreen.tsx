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
import { OutsideStackParamList } from "navigation/OutsideNavigation";
import CustomButton from "../../components/CustomButton";
import { FirebaseAuth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

type SignUpScreenProp = NativeStackScreenProps<OutsideStackParamList, "SignUp">;

const { height } = Dimensions.get("window");

const SignUpScreen = ({ navigation }: SignUpScreenProp) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(FirebaseAuth, email, password);
      navigation.navigate("InsideNavigation", {
        screen: "HomeStack",
        params: {
          screen: "Home",
        },
      });
    } catch (error: any) {
      console.error(error);
      alert("Sign up Failed: " + error.message);
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

          {/* Sign up illustration */}
          <View className="items-center justify-center flex-1">
            {/* User profile creation icon */}
            <View className="bg-gray-700 rounded-full p-6 shadow-xl">
              <View className="w-20 h-20 bg-gray-800 rounded-full items-center justify-center relative">
                {/* User icon with plus */}
                <View className="w-8 h-8 bg-white/80 rounded-full mb-1" />
                <View className="w-12 h-6 bg-white/80 rounded-t-full" />

                {/* Plus icon for new account */}
                <View className="absolute -top-2 -right-2">
                  <View className="w-6 h-6 bg-green-500 rounded-full items-center justify-center">
                    <View className="w-3 h-0.5 bg-white rounded-full" />
                    <View className="w-0.5 h-3 bg-white rounded-full absolute" />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View className="flex-1 justify-center px-6">
        <View className="mb-8">
          <Text className="text-4xl font-bold text-white text-center mb-2">
            Create Account
          </Text>
          <Text className="text-lg text-gray-400 text-center mt-4">
            Join Moview community
          </Text>
        </View>

        {/* Sign Up Form */}
        <View className="space-y-4">
          <TextInput
            className="text-white bg-gray-800 h-14 rounded-2xl px-4 border border-gray-700"
            onChangeText={(text) => setUsername(text)}
            placeholder="Username"
            placeholderTextColor="#9CA3AF"
            value={username}
            autoCapitalize="none"
          />

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
        </View>

        {/* Sign Up Button */}
        <View className="mt-6">
          <CustomButton
            classNameProp="h-14 bg-white"
            title="Create Account"
            loading={loading}
            onPress={handleSignUp}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
