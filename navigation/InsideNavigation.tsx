import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MovieDetails from "../components/MovieDetails";

export type InsideStackParamList = {
  HomeStack: undefined;
  MovieDetails: undefined;
};

const InsideStack = createNativeStackNavigator<InsideStackParamList>();

export type TabParamList = {
  Home: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const screenOptions = {
  headerShown: false,
};

const InsideNavigation = () => {
  return (
    <InsideStack.Navigator
      screenOptions={screenOptions}
      initialRouteName={"HomeStack"}
    >
      <InsideStack.Screen name="HomeStack" component={HomeTabs} />
      <InsideStack.Screen name="MovieDetails" component={MovieDetails} />
    </InsideStack.Navigator>
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default InsideNavigation;
