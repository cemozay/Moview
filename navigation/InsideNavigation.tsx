import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MovieDetails from "../components/MovieDetails";
import AddReview from "../components/AddReview";
import Selectlist from "../components/Selectlist";
import PersonScreen from "../screens/PersonScreen";
import SearchScreen from "../screens/SearchScreen";
import Review from "../screens/ReviewScreen";
import { Entypo } from "@expo/vector-icons";
import { View } from "react-native";

export type InsideStackParamList = {
  HomeStack: undefined;
  MovieDetails: undefined;
  PersonScreen: undefined;
  SearchScreen: undefined;
  ProfileA: undefined;
  AddReview: undefined;
  Selectlist: undefined;
};

const InsideStack = createNativeStackNavigator<InsideStackParamList>();

export type TabParamList = {
  Home: undefined;
  Profile: undefined;
  Review: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const screenOptions = {
  headerShown: false,
};
const screenOptions2 = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 60,
    background: "#000",
  },
};
const InsideNavigation = () => {
  return (
    <InsideStack.Navigator
      screenOptions={screenOptions}
      initialRouteName={"HomeStack"}
    >
      <InsideStack.Screen name="HomeStack" component={HomeTabs} />
      <InsideStack.Screen name="MovieDetails" component={MovieDetails} />
      <InsideStack.Screen name="PersonScreen" component={PersonScreen} />
      <InsideStack.Screen name="SearchScreen" component={SearchScreen} />
      <InsideStack.Screen name="Review" component={Review} />
      <InsideStack.Screen name="AddReview" component={AddReview} />
      <InsideStack.Screen name="Selectlist" component={Selectlist} />
    </InsideStack.Navigator>
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions2}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarStyle: {
            backgroundColor: "black",
          },
          tabBarIcon: () => {
            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Entypo name="home" size={24} color={"#fff"} />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Review"
        component={Review}
        options={{
          tabBarStyle: {
            backgroundColor: "black",
          },
          tabBarIcon: () => {
            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Entypo name="home" size={24} color={"#fff"} />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarStyle: {
            backgroundColor: "black",
          },
          tabBarIcon: () => {
            return (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Entypo name="home" size={24} color={"#fff"} />
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default InsideNavigation;
