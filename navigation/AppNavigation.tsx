import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OutsideNavigation from "./OutsideNavigation";
import InsideNavigation from "./InsideNavigation";
import { useAuthentication } from "utils/useAuthentication";

export type RootStackParamList = {
  OutsideNav: undefined;
  InsideNav: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation = () => {
  const { user, loading } = useAuthentication();

  if (loading) {
    return null; // Loading splash screen
  }

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
