import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList } from "./AppNavigation";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProfileAyar from "../screens/ProfileAyarlar";

const InsideStack = createNativeStackNavigator<RootStackParamList>();

export type TabParamList = {
  Home: undefined;
  Profile: undefined;
  ProfileA: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const InsideNavigation = () => {
  return (
    <InsideStack.Navigator initialRouteName={"HomeStack"}>
      <InsideStack.Screen
        name="HomeStack"
        options={{ headerShown: false }}
        component={HomeTabs}
      />
    </InsideStack.Navigator>
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="ProfileA" component={ProfileAyar} />
    </Tab.Navigator>
  );
};

export default InsideNavigation;
