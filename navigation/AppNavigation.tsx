import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OutsideNavigation from "./OutsideNavigation";
import InsideNavigation from "./InsideNavigation";
import { useAuthentication } from "utils/hooks/useAuthentication";
import { View, Text } from "react-native";
import { Settings } from "react-native-fbsdk-next";

export type RootStackParamList = {
  Navigation: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerShown: false,
};

Settings.initializeSDK();

const AppNavigation = () => {
  const { user, loading } = useAuthentication();

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={screenOptions}
        initialRouteName="Navigation"
      >
        <RootStack.Screen
          name="Navigation"
          component={user ? InsideNavigation : OutsideNavigation}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
