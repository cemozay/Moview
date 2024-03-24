import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import { View } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MovieCreditsList from "../components/PersonList";
import MovieDetails from "../components/MovieDetails";
import AddReview from "../components/AddReview";
import Selectlist from "../components/Selectlist";
import PersonScreen from "../screens/PersonScreen";
import SearchScreen from "../screens/SearchScreen";
import ListScreen from "../screens/ListScreen";
import ReviewScreen from "../screens/ReviewScreen";
import Review from "../screens/ReviewsScreen";
import ReviewsScreen from "../screens/ReviewsScreen";
import ProfileReviews from "../screens/profile/ProfileReviews";
import useUserStore from "../utils/hooks/useUserStore";

export type InsideStackParamList = {
  HomeStack: { screen: string; params: any };
  MovieDetails: { movieId: string };
  PersonScreen: { personId: number };
  SearchScreen: undefined;
  Review: { movieid: string };
  ReviewScreen: { reviewId: string };
  AddReview: { movieId: string };
  ComingSoon: undefined;
  Selectlist: undefined;
  MovieCreditsList: { movieId: string };
  ReviewsScreen: undefined;
  LikedMovies: undefined;
  ProfileReviews: undefined;
};

const InsideStack = createNativeStackNavigator<InsideStackParamList>();

const stackScreenOptions = {
  headerShown: false,
};

const InsideNavigation = () => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return null; // Login ekranına atılacak
  } else {
    return (
      <InsideStack.Navigator
        screenOptions={stackScreenOptions}
        initialRouteName={"HomeStack"}
      >
        <InsideStack.Screen name="HomeStack" component={HomeTabs} />
        <InsideStack.Screen name="MovieDetails" component={MovieDetails} />
        <InsideStack.Screen name="PersonScreen" component={PersonScreen} />
        <InsideStack.Screen name="SearchScreen" component={SearchScreen} />
        <InsideStack.Screen name="Review" component={Review} />
        <InsideStack.Screen name="AddReview" component={AddReview} />
        <InsideStack.Screen name="Selectlist" component={Selectlist} />
        <InsideStack.Screen name="ReviewsScreen" component={ReviewsScreen} />
        <InsideStack.Screen name="ReviewScreen" component={ReviewScreen} />
        <InsideStack.Screen name="ProfileReviews" component={ProfileReviews} />
        <InsideStack.Screen
          name="MovieCreditsList"
          component={MovieCreditsList}
        />
      </InsideStack.Navigator>
    );
  }
};

export type TabParamList = {
  Home: undefined;
  ListScreen: undefined;
  Profile: undefined;
  Review: { movieid: string };
};

const Tab = createBottomTabNavigator<TabParamList>();

const tabScreenOptions = {
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

const HomeTabs = () => {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
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
        name="ListScreen"
        component={ListScreen}
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
