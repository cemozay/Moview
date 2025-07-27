import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { OutsideStackParamList } from "navigation/OutsideNavigation";
import CustomButton from "../../components/CustomButton";
import Icon from "@expo/vector-icons/FontAwesome";

type ForgotPasswordScreenProp = NativeStackScreenProps<
  OutsideStackParamList,
  "ForgotPassword"
>;

const ForgotPasswordScreen = ({ navigation }: ForgotPasswordScreenProp) => {
  const [email, setEmail] = useState("");

  const handleForgot = () => {
    // TODO: Implement forgot password functionality
    console.log("Forgot password for:", email);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Back Button */}
      <View className="px-6 pt-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center"
        >
          <Icon name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 justify-center px-6">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-white text-center mb-4">
            Forgot Password?
          </Text>
          <Text className="text-lg text-gray-400 text-center leading-6">
            Don't worry! It happens. Please enter the email address associated
            with your account.
          </Text>
        </View>

        {/* Email Input */}
        <View className="mb-6">
          <TextInput
            className="text-white bg-gray-800 h-14 rounded-2xl px-4 border border-gray-700"
            onChangeText={(text) => setEmail(text)}
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Send Button */}
        <CustomButton
          classNameProp="h-14 bg-white mb-6"
          title="Send Reset Link"
          onPress={handleForgot}
        />

        {/* Back to Login */}
        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="py-3"
        >
          <Text className="text-center text-gray-400">
            Remember your password?{" "}
            <Text className="text-white font-semibold">Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
