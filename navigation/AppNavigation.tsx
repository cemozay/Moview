import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OutsideNavigation from "./OutsideNavigation";
import InsideNavigation from "./InsideNavigation";
import { useAuthentication } from "utils/hooks/useAuthentication";

export type RootStackParamList = {
  Navigation: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerShown: false,
};

const AppNavigation = () => {
  const { user, loading } = useAuthentication();

  if (loading) {
    return null; // Loading splash screen
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
