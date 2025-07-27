import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { View, ViewStyle } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import CommunityScreen from "../screens/CommunityScreen";
import MovieDetails from "../components/MovieDetails";
import AddReview from "../components/AddReview";
import ListDetailsScreen from "../components/ListDetailsScreen";
import ListContent from "../components/ListContent";
import YearsListComponent from "../components/YearsListComponent";
import Selectlist from "../components/Selectlist";
import PersonScreen from "../screens/PersonScreen";
import ReviewScreen from "../components/ReviewScreen";
import AddList from "../components/AddList";
import SelectFilmForList from "../components/SelectFilmForList";
import MovieDetailAddlist from "../components/MovieDetailAddlist";
import SeeMoreComponent from "../components/SeeMoreComponent";
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

// Ana Tab Navigation Parametreleri
export type TabParamList = {
  HomeTab: undefined;
  SearchTab: undefined;
  CommunityTab: undefined;
  ProfileTab: undefined;
};

// Stack Navigation Parametreleri (Modal ve Detail Sayfalar)
export type RootStackParamList = {
  // Tab Navigator
  MainTabs: undefined;

  // Modal/Detail Sayfalar
  MovieDetails: { movieId: string };
  PersonScreen: { personId: number };
  ListDetailsScreen: { listId: string | null };
  ReviewScreen: { reviewId: string };
  AddReview: { movieId: string; reviewId: string | null };
  AddList: { movies: string[] | undefined; listId: string | null };
  ListContent: {
    movies: string[];
    listid: string | null;
    movieId: string | null;
  };
  Selectlist: undefined;
  SelectFilmForList: { listId: string | null };
  MovieDetailAddlist: { movieId: string };
  SeeMoreComponent: { array: Result[] | People[]; name: string };
  YearsListComponent: { start: string; end: string };

  // Profile Alt Sayfalar
  ProfileReviews: undefined;
  ProfileAyarlar: undefined;
  ProfileList: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

const tabScreenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 10,
    height: 70,
    backgroundColor: "#000",
    borderTopWidth: 1,
    borderTopColor: "#333",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  } as ViewStyle,
};

const stackScreenOptions = {
  headerShown: false,
  presentation: "modal" as const,
};

// Tab Icon Component
const TabIcon = ({
  name,
  focused,
}: {
  name: keyof typeof MaterialIcons.glyphMap;
  focused: boolean;
}) => (
  <View className="items-center justify-center p-2">
    <MaterialIcons name={name} size={26} color={focused ? "#FFD700" : "#fff"} />
    {focused && <View className="w-1 h-1 bg-yellow-400 rounded-full mt-1" />}
  </View>
);

// Ana Tab Navigator
const MainTabs = () => {
  return (
    <Tab.Navigator screenOptions={tabScreenOptions}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="movie" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="search" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="CommunityTab"
        component={CommunityScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="people" focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name="account-circle" focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Ana Root Navigator
const AppNavigation = () => {
  const user = useUserStore((state) => state.user);

  if (!user) {
    return null;
  }

  return (
    <RootStack.Navigator
      screenOptions={stackScreenOptions}
      initialRouteName="MainTabs"
    >
      {/* Ana Tab Navigator */}
      <RootStack.Screen name="MainTabs" component={MainTabs} />

      {/* Modal ve Detail Sayfalar */}
      <RootStack.Screen name="MovieDetails" component={MovieDetails} />
      <RootStack.Screen name="PersonScreen" component={PersonScreen} />
      <RootStack.Screen
        name="ListDetailsScreen"
        component={ListDetailsScreen}
      />
      <RootStack.Screen name="ReviewScreen" component={ReviewScreen} />
      <RootStack.Screen name="AddReview" component={AddReview} />
      <RootStack.Screen name="AddList" component={AddList} />
      <RootStack.Screen name="ListContent" component={ListContent} />
      <RootStack.Screen name="Selectlist" component={Selectlist} />
      <RootStack.Screen
        name="SelectFilmForList"
        component={SelectFilmForList}
      />
      <RootStack.Screen
        name="MovieDetailAddlist"
        component={MovieDetailAddlist}
      />
      <RootStack.Screen name="SeeMoreComponent" component={SeeMoreComponent} />
      <RootStack.Screen
        name="YearsListComponent"
        component={YearsListComponent}
      />

      {/* Profile Alt Sayfalar */}
      <RootStack.Screen name="ProfileReviews" component={ProfileReviews} />
      <RootStack.Screen name="ProfileAyarlar" component={ProfileAyarlar} />
      <RootStack.Screen name="ProfileList" component={ProfileList} />
    </RootStack.Navigator>
  );
};

export default AppNavigation;
