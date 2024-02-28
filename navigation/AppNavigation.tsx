import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { User, onAuthStateChanged } from "firebase/auth";
import { FirebaseAuth } from "../firebaseConfig";
import OutsideNavigation from "./OutsideNavigation";
import InsideNavigation from "./InsideNavigation";

export type RootStackParamList = {
  OutsideNav: undefined;
  Onboarding: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  InsideStack: undefined;
  InsideNav: undefined;
  HomeStack: undefined;
  ProfileStack: undefined;
  ProfileAStack: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FirebaseAuth, (user) => {
      if (user) {
        setUser(user);
      } else setUser(null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName={user == null ? "OutsideNav" : "InsideNav"}
      >
        <RootStack.Screen
          name="OutsideNav"
          options={{ headerShown: false }}
          component={OutsideNavigation}
        />
        <RootStack.Screen
          name="InsideNav"
          options={{ headerShown: false }}
          component={InsideNavigation}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
