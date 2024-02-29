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
        initialRouteName={user == null ? "OutsideNav" : "InsideNav"}
      >
        <RootStack.Screen name="OutsideNav" component={OutsideNavigation} />
        <RootStack.Screen name="InsideNav" component={InsideNavigation} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
