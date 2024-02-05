import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/OnboardingScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileAyar from "../screens/ProfileAyarlar";
import { getStorageBoolean } from "../utils/Mmkv";

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Profile: undefined;
  ProfileA: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  useEffect(() => {
    checkAlreadyOnboarded();
  }, []);

  const checkAlreadyOnboarded = () => {
    const alreadyOnboarded = getStorageBoolean("alreadyOnboarded");

    if (alreadyOnboarded == null) setShowOnboarding(true);
    else setShowOnboarding(alreadyOnboarded!);
  };

  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName={showOnboarding == true ? "Onboarding" : "Profile"}
      >
        <RootStack.Screen
          name="Onboarding"
          options={{ headerShown: false }}
          component={OnboardingScreen}
        />
        <RootStack.Screen
          name="ProfileA"
          options={{ headerShown: false }}
          component={ProfileAyar}
        />
        <RootStack.Screen
          name="Profile"
          options={{ headerShown: false }}
          component={ProfileScreen}
        />
        <RootStack.Screen
          name="Login"
          options={{ headerShown: false }}
          component={LoginScreen}
        />
        <RootStack.Screen
          name="SignUp"
          options={{ headerShown: false }}
          component={SignUpScreen}
        />
        <RootStack.Screen
          name="Home"
          options={{ headerShown: false }}
          component={HomeScreen}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
