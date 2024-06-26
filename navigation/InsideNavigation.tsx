import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { View, ViewStyle } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MovieDetails from "../components/MovieDetails";
import AddReview from "../components/AddReview";
import ListDetailsScreen from "../components/ListDetailsScreen";
import ListContent from "../components/ListContent";
import YearsListComponent from "../components/YearsListComponent";
import Selectlist from "../components/Selectlist";
import PersonScreen from "../screens/PersonScreen";
import SearchScreen from "../screens/SearchScreen";
import ListsScreen from "../screens/ListsScreen";
import ReviewScreen from "../components/ReviewScreen";
import AddList from "../components/AddList";
import SelectFilmForList from "../components/SelectFilmForList";
import MovieDetailAddlist from "../components/MovieDetailAddlist";
import SeeMoreComponent from "../components/SeeMoreComponent";
import ReviewsScreen from "../screens/ReviewsScreen";
import ProfileReviews from "../screens/profile/ProfileReviews";
import ProfileAyarlar from "../screens/profile/ProfileAyarlar";
import ProfileList from "../screens/profile/ProfileList";
import useUserStore from "../utils/hooks/useUserStore";

type Result = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

type People = {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: null | string;
  cast_id?: number;
  character?: string;
  credit_id: string;
  order?: number;
  department?: string;
  job?: string;
};

export type InsideStackParamList = {
  HomeScreen: undefined;
  MovieDetails: { movieId: string };
  PersonScreen: { personId: number };
  SearchScreen: undefined;
  ListsScreen: undefined;
  ListDetailsScreen: { listId: string | null };
  Review: { movieid: string; route: string };
  ReviewScreen: { reviewId: string };
  AddReview: { movieId: string; reviewId: string | null };
  ComingSoon: undefined;
  Selectlist: undefined;
  ReviewsScreen: undefined;
  LikedMovies: undefined;
  ProfileReviews: undefined;
  ProfileScreen: { route: string };
  ProfileAyarlar: undefined;
  ProfileList: undefined;
  AddList: { movies: string[] | undefined; listId: string | null };
  ListContent: {
    movies: string[];
    listid: string | null;
    movieId: string | null;
  };
  SelectFilmForList: { listId: string | null };
  MovieDetailAddlist: { movieId: string };
  SeeMoreComponent: { array: Result[] | People[]; name: string };
  YearsListComponent: { start: string; end: string };
};

const InsideStack = createNativeStackNavigator<InsideStackParamList>();

const stackScreenOptions = {
  headerShown: false,
};

const InsideNavigation = () => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return null;
  } else {
    return (
      <InsideStack.Navigator
        screenOptions={stackScreenOptions}
        initialRouteName="HomeScreen"
      >
        <InsideStack.Screen name="HomeScreen" component={HomeScreen} />
        <InsideStack.Screen name="MovieDetails" component={MovieDetails} />
        <InsideStack.Screen name="PersonScreen" component={PersonScreen} />
        <InsideStack.Screen name="SearchScreen" component={SearchScreen} />
        <InsideStack.Screen name="ListsScreen" component={ListsScreen} />
        <InsideStack.Screen
          name="ListDetailsScreen"
          component={ListDetailsScreen}
        />
        <InsideStack.Screen name="AddReview" component={AddReview} />
        <InsideStack.Screen name="ProfileList" component={ProfileList} />
        <InsideStack.Screen name="Selectlist" component={Selectlist} />
        <InsideStack.Screen name="ReviewsScreen" component={ReviewsScreen} />
        <InsideStack.Screen name="ReviewScreen" component={ReviewScreen} />
        <InsideStack.Screen name="ProfileReviews" component={ProfileReviews} />
        <InsideStack.Screen name="ProfileScreen" component={ProfileScreen} />
        <InsideStack.Screen name="ProfileAyarlar" component={ProfileAyarlar} />
        <InsideStack.Screen name="AddList" component={AddList} />
        <InsideStack.Screen name="ListContent" component={ListContent} />
        <InsideStack.Screen
          name="YearsListComponent"
          component={YearsListComponent}
        />

        <InsideStack.Screen
          name="SeeMoreComponent"
          component={SeeMoreComponent}
        />
        <InsideStack.Screen
          name="MovieDetailAddlist"
          component={MovieDetailAddlist}
        />
        <InsideStack.Screen
          name="SelectFilmForList"
          component={SelectFilmForList}
        />
      </InsideStack.Navigator>
    );
  }
};

export type TabParamList = {
  Home: undefined;
  ListsScreen: undefined;
  ProfileScreen: undefined;
  ReviewsScreen: { movieid: string };
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
    backgroundColor: "#000",
  } as ViewStyle,
};

const HomeTabs = () => {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="Home"
        component={InsideNavigation}
        options={{
          tabBarStyle: {
            backgroundColor: "black",
          },
          tabBarIcon: () => {
            return (
              <View className="items-center justify-center">
                <Entypo name="home" size={24} color={"#fff"} />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="ListsScreen"
        component={ListsScreen}
        options={{
          tabBarStyle: {
            backgroundColor: "black",
          },
          tabBarIcon: () => {
            return (
              <View className="items-center justify-center">
                <FontAwesome5 name="list-ul" size={24} color="white" />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="ReviewsScreen"
        component={ReviewsScreen}
        options={{
          tabBarStyle: {
            backgroundColor: "black",
          },
          tabBarIcon: () => {
            return (
              <View className="items-center justify-center">
                <MaterialIcons name="reviews" size={24} color="white" />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarStyle: {
            backgroundColor: "black",
          },
          tabBarIcon: () => {
            return <View className="items-center justify-center"></View>;
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default HomeTabs;
