import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/OnboardingScreen";
import LoginScreen from "../screens/login/LoginScreen";
import SignUpScreen from "../screens/login/SignUpScreen";
import ForgotPasswordScreen from "../screens/login/ForgotPasswordScreen";
import InsideNavigation from "./InsideNavigation";
import { getStorageBoolean } from "../utils/Mmkv";

export type OutsideStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  InsideNavigation: { screen: string; params: any };
};

const OutsideStack = createNativeStackNavigator<OutsideStackParamList>();

const screenOptions = {
  headerShown: false,
};

const OutsideNavigation = () => {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    checkAlreadyOnboarded();
  }, []);

  const checkAlreadyOnboarded = () => {
    const alreadyOnboarded = getStorageBoolean("alreadyOnboarded");

    if (alreadyOnboarded == null) setShowOnboarding(true);
    else setShowOnboarding(!alreadyOnboarded);
  };

  if (showOnboarding == null) {
    return null; // Loading screen can be added here
  }

  return (
    <OutsideStack.Navigator
      screenOptions={screenOptions}
      initialRouteName={showOnboarding == true ? "Onboarding" : "Login"}
    >
      <OutsideStack.Screen name="Onboarding" component={OnboardingScreen} />
      <OutsideStack.Screen name="Login" component={LoginScreen} />
      <OutsideStack.Screen name="SignUp" component={SignUpScreen} />
      <OutsideStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
      <OutsideStack.Screen
        name="InsideNavigation"
        component={InsideNavigation}
      />
    </OutsideStack.Navigator>
  );
};

export default OutsideNavigation;
