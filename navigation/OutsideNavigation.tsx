import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./AppNavigation";
import OnboardingScreen from "../screens/OnboardingScreen";
import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import InsideStack from "./InsideNavigation";
import { getStorageBoolean } from "../utils/Mmkv";

const OutsideStack = createNativeStackNavigator<RootStackParamList>();

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
      initialRouteName={showOnboarding == true ? "Onboarding" : "Login"}
    >
      <OutsideStack.Screen
        name="Onboarding"
        options={{ headerShown: false }}
        component={OnboardingScreen}
      />
      <OutsideStack.Screen
        name="Login"
        options={{ headerShown: false }}
        component={LoginScreen}
      />
      <OutsideStack.Screen
        name="SignUp"
        options={{ headerShown: false }}
        component={SignUpScreen}
      />
      <OutsideStack.Screen
        name="ForgotPassword"
        options={{ headerShown: false }}
        component={ForgotPasswordScreen}
      />
      <OutsideStack.Screen
        name="InsideStack"
        options={{ headerShown: false }}
        component={InsideStack}
      />
    </OutsideStack.Navigator>
  );
};

export default AppNavigation;
