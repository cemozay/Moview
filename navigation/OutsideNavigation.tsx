import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OnboardingScreen from "../screens/OnboardingScreen";
import LoginScreen from "../screens/login/LoginScreen";
import SignUpScreen from "../screens/login/SignUpScreen";
import ForgotPasswordScreen from "../screens/login/ForgotPasswordScreen";
import InsideStack from "./InsideNavigation";
import { getStorageBoolean } from "../utils/Mmkv";

export type OutsideStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  InsideStack: undefined;
};

const OutsideStack = createNativeStackNavigator<OutsideStackParamList>();

const screenOptions = {
  headerShown: false,
};
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
      <OutsideStack.Screen name="InsideStack" component={InsideStack} />
    </OutsideStack.Navigator>
  );
};

export default AppNavigation;
