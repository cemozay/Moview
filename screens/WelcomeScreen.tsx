import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { OutsideStackParamList } from "../navigation/OutsideNavigation";
import { useGoogleAuth, useFacebookAuth } from "../utils/expoAuth";
import Icon from "@expo/vector-icons/FontAwesome";

type WelcomeScreenProp = NativeStackScreenProps<
  OutsideStackParamList,
  "Welcome"
>;

const { height } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }: WelcomeScreenProp) => {
  const { signInWithGoogle } = useGoogleAuth();
  const { signInWithFacebook } = useFacebookAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigation.navigate("InsideNavigation", {
        screen: "HomeStack",
        params: {
          screen: "Home",
        },
      });
    } catch (error: any) {
      console.error(error);
      alert("Google Sign-In Failed: " + error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      await signInWithFacebook();
      navigation.navigate("InsideNavigation", {
        screen: "HomeStack",
        params: { screen: "Home" },
      });
    } catch (error: any) {
      console.error(error);
      alert("Facebook Login Error: " + error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Hero Image Section - 35% of screen */}
      <View style={{ height: height * 0.35 }} className="relative">
        <View className="flex-1 bg-gradient-to-b from-gray-800 to-gray-900 items-center justify-center relative overflow-hidden">
          {/* Background decorative elements */}
          <View className="absolute top-8 left-6 w-4 h-4 bg-white/10 rounded-full" />
          <View className="absolute top-12 right-8 w-3 h-3 bg-white/20 rotate-45" />
          <View className="absolute bottom-12 left-8 w-6 h-6 border-2 border-white/10 rounded-full" />
          <View
            className="absolute bottom-8 right-6 w-4 h-4 bg-white/15"
            style={{
              transform: [{ rotate: "45deg" }],
              borderRadius: 2,
            }}
          />

          {/* Main illustration area */}
          <View className="items-center justify-center flex-1">
            {/* Phone mockup - Movie Review focused */}
            <View className="bg-gray-700 rounded-2xl p-2 shadow-xl">
              <View className="w-32 h-52 bg-gray-800 rounded-xl items-center justify-center relative">
                {/* Phone screen content - Movie Review themed */}
                <View className="absolute top-2 left-2 right-2">
                  {/* Movie poster with review */}
                  <View className="bg-gray-900 rounded-lg p-2 mb-2">
                    <View className="flex-row mb-1">
                      <View className="w-10 h-12 bg-gray-600 rounded mr-2" />
                      <View className="flex-1">
                        <View className="w-12 h-1.5 bg-gray-500 rounded mb-1" />
                        <View className="w-10 h-1 bg-gray-500 rounded mb-1" />
                        {/* Star rating */}
                        <View className="flex-row mb-1">
                          <View className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-0.5" />
                          <View className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-0.5" />
                          <View className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-0.5" />
                          <View className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-0.5" />
                          <View className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                        </View>
                      </View>
                    </View>

                    {/* Review text lines */}
                    <View className="space-y-0.5">
                      <View className="w-full h-0.5 bg-gray-500 rounded" />
                      <View className="w-4/5 h-0.5 bg-gray-500 rounded" />
                      <View className="w-3/4 h-0.5 bg-gray-500 rounded" />
                    </View>
                  </View>

                  {/* Review interaction buttons */}
                  <View className="flex-row justify-between px-1">
                    <View className="w-4 h-3 bg-gray-600 rounded" />
                    <View className="w-4 h-3 bg-gray-600 rounded" />
                    <View className="w-4 h-3 bg-white rounded" />
                  </View>
                </View>
              </View>
            </View>

            {/* Movie review icon */}
            <View className="absolute -bottom-3 -right-6">
              <View className="w-12 h-12 bg-white/10 rounded-full items-center justify-center">
                {/* Review/comment icon representation */}
                <View className="w-6 h-4 border-2 border-white/60 rounded-lg relative">
                  <View className="absolute -bottom-0.5 left-1 w-1.5 h-1.5 bg-white/60 transform rotate-45" />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Content Section - 65% of screen */}
      <View className="flex-1 px-6 justify-center">
        {/* Welcome Text */}
        <View className="mb-8">
          <Text className="text-4xl font-bold text-white text-center mb-2">
            Hello
          </Text>
          <Text className="text-lg text-gray-400 text-center leading-6">
            Welcome To Moview, where{"\n"}you discover and review amazing movies
          </Text>
        </View>

        {/* Main Action Buttons */}
        <View className="space-y-4 mb-6">
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            className="bg-white h-14 rounded-full items-center justify-center shadow-lg"
            activeOpacity={0.8}
          >
            <Text className="text-black text-lg font-semibold">Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("SignUp")}
            className="bg-gray-800 h-14 rounded-full items-center justify-center border-2 border-gray-700"
            activeOpacity={0.8}
          >
            <Text className="text-white text-lg font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Social Login Section */}
        <View className="items-center">
          <Text className="text-gray-400 text-sm mb-4">Sign up using</Text>

          <View className="flex-row justify-center space-x-4">
            <TouchableOpacity
              onPress={handleFacebookSignIn}
              className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center border border-gray-700"
              activeOpacity={0.8}
            >
              <Icon name="facebook" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGoogleSignIn}
              className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center border border-gray-700"
              activeOpacity={0.8}
            >
              <Icon name="google" size={20} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {}}
              className="w-12 h-12 bg-gray-800 rounded-full items-center justify-center border border-gray-700"
              activeOpacity={0.8}
            >
              <Icon name="linkedin" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
