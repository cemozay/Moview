import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { useMovieData } from "utils/hooks/useMovieData";
import LinearGradient from "react-native-linear-gradient";
import { FloatingAction } from "react-native-floating-action";
import AntDesign from "@expo/vector-icons/AntDesign";
import Icon from "@expo/vector-icons/FontAwesome";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FirebaseDB } from "firebaseConfig";

type MovieDetailsProp = NativeStackScreenProps<
  InsideStackParamList,
  "MovieDetails"
>;

const screenWidth = Dimensions.get("window").width;

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

type Review = {
  timestamp: any;
  mediaId: string;
  rating: string;
  text: string;
  userId: string;
  id: string;
};

const MovieDetailScreen = ({ navigation, route }: MovieDetailsProp) => {
  const { movieId } = route.params;
  const apiResponse = useMovieData(movieId);
  const movieData = apiResponse.data;
  const [cast, setCast] = useState<People[]>([]);
  const [crew, setCrew] = useState<People[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchData = async () => {
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2UzY2MwNDE2ZjcwM2RmOTI1NmM1ZTgyYmEwZTVmYiIsInN1YiI6IjY1ODM2NTZhMDgzNTQ3NDRmMzNlODc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nv0234eCrGmSRXSURyFUGO7uIub5OAOeCA0t9kCPLr0",
        },
      };

      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
        options
      );
      const data = await response.json();

      setCast(data.cast);
      setCrew(data.crew);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const reviewQuery = query(
        collection(FirebaseDB, "reviews"),
        where("mediaId", "==", movieId)
      );
      const snapshot = await getDocs(reviewQuery);
      const reviewList = snapshot.docs.map((doc) => {
        const reviewData = doc.data() as Review;
        return { ...reviewData, id: doc.id };
      });
      setReviews(reviewList);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [movieId]);

  useEffect(() => {
    fetchReviews();
  }, [movieData]);

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "";
    const now = new Date();
    const date = timestamp.toDate();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInHours = diffInSeconds / 3600;
    const diffInDays = diffInSeconds / 86400;
    const diffInWeeks = diffInSeconds / (86400 * 7);
    const diffInMonths = diffInSeconds / (86400 * 30);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} days ago`;
    } else if (diffInWeeks < 4) {
      return `${Math.floor(diffInWeeks)} weeks ago`;
    } else {
      return `${Math.floor(diffInMonths)} months ago`;
    }
  };

  const actions = [
    {
      text: "Accessibility",
      icon: <Icon name="search" size={30} color="white" />,
      name: "bt_accessibility",
      position: 2,
      color: "gray",
    },
    {
      text: "Language",
      icon: <Icon name="search" size={30} color="white" />,
      name: "bt_language",
      position: 1,
      color: "gray",
    },
    {
      text: "Location",
      icon: <Icon name="search" size={30} color="white" />,
      name: "bt_room",
      position: 3,
      color: "gray",
    },
    {
      text: "Video",
      icon: <Icon name="search" size={30} color="white" />,
      name: "bt_videocam",
      position: 4,
      color: "gray",
    },
  ];

  const renderItem = ({ item }: { item: People }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("PersonScreen", { personId: item.id })}
    >
      <View style={{ margin: 3 }}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original${item.profile_path}`,
          }}
          className="h-36 w-24 rounded-2xl"
        />
        <Text className="color-white">{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderReviewItem = ({ item }: { item: Review }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ReviewScreen", { reviewId: item.id })}
    >
      {movieData && (
        <View style={[styles.reviewContainer, { width: screenWidth }]}>
          <ImageBackground
            style={styles.imageBackground}
            imageStyle={styles.imageBackgroundImage}
            source={{
              uri: `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`,
            }}
          >
            <LinearGradient
              colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.5)"]}
              style={StyleSheet.absoluteFillObject}
            />
            <View className="flex-row justify-between m-4">
              <Text className="color-white text-2xl">{movieData.title}</Text>
            </View>
            <View className="flex-row m-2">
              <View className="flex-1 ml-3">
                <Text numberOfLines={4} className="color-white">
                  {item.text}
                </Text>
                <View>
                  <View className="flex-row items-center m-2">
                    <Image
                      className="w-10 h-10 rounded-full"
                      source={require("../screens/avatar.jpg")}
                    />
                    <View>
                      <Text className="text-xs color-white">
                        Alperen Ağırman
                      </Text>
                    </View>
                    <View className="justify-center items-center">
                      <Icon name="search" size={24} color="white" />

                      <Text className="color-white ml-2 text-xs">X Yorum</Text>
                    </View>
                    <View className="justify-center items-center">
                      <Icon name="search" size={24} color="white" />
                      <Text className="color-white ml-2 text-xs">X Beğeni</Text>
                    </View>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="color-white text-xs">
                    {formatTimestamp(item.timestamp)}
                  </Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-black">
      <ScrollView>
        {movieData && (
          <View>
            <View>
              <ImageBackground
                style={{ width: "100%", height: 500 }}
                className="w-screen h-96"
                resizeMode="cover"
                source={{
                  uri: `https://image.tmdb.org/t/p/original${movieData.poster_path}`,
                }}
              >
                <View className="flex-row items-center absolute z-10">
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className=" justify-center items-center pt-4 pl-2 "
                  >
                    <AntDesign name="left" size={26} color="white" />
                  </TouchableOpacity>
                </View>
                <LinearGradient
                  colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.9999)"]}
                  style={{ ...StyleSheet.absoluteFillObject }}
                />
                <View className="w-full h-full justify-end items-center">
                  <Image
                    className="h-48 w-36 rounded-2xl"
                    source={{
                      uri: `https://image.tmdb.org/t/p/original${movieData.poster_path}`,
                    }}
                  />
                  <Text className="color-white text-2xl">
                    {movieData.title}
                  </Text>
                  <Text className="text-neutral-700 text-2xl">
                    {movieData.release_date}
                  </Text>
                  <Text className="color-red-700 text-xl">
                    {movieData.genres.name}
                  </Text>
                </View>
              </ImageBackground>
              <View>
                <Text className="mb-3 mx-3 text-base color-white">
                  {movieData.overview}
                </Text>
                <View className="justify-between flex-row m-2">
                  <View className="flex-row items-center">
                    <Text className="color-white text-base"> ⭐ 9.4/10 </Text>
                    <Text className="pl-3 color-neutral-500 text-base">
                      52.780 Vote
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <AntDesign name="playcircleo" size={24} color="white" />
                    <Text className="pr-3 color-white text-base">
                      Watch Trailer
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View>
              <View className="items-center">
                <View className="color-red-800 border-neutral-800 border w-11/12"></View>
              </View>
              <View className="m-3">
                <Text className="color-white text-2xl">Cast</Text>
                <FlatList
                  horizontal
                  data={cast}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 10 }}
                />
                <View className="items-center">
                  <View className="color-red-800 border-neutral-800 border w-11/12"></View>
                </View>
                <Text className="color-white text-2xl">Crew</Text>
                <FlatList
                  horizontal
                  data={crew}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id.toString()}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 10 }}
                />
              </View>
            </View>
            <View>
              <View className="items-center">
                <View className="color-red-800 border-neutral-800 border w-11/12"></View>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="m-3 color-white text-2xl">Review</Text>
                <TouchableOpacity>
                  <Text className="m-3 color-orange-500 text-base">
                    See all
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <FlatList
                  data={reviews}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderReviewItem}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  pagingEnabled
                  snapToAlignment="center"
                  decelerationRate="fast"
                  snapToInterval={screenWidth}
                  getItemLayout={(data, index) => ({
                    length: screenWidth,
                    offset: screenWidth * index,
                    index,
                  })}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <FloatingAction
        actions={actions}
        color="gray"
        overlayColor="rgba(68, 68, 68, 0.7)"
        onPressItem={(name) => {
          console.log(`selected button: ${name}`);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  reviewContainer: {
    borderColor: "#585858",
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 40, // Add border radius to the container
    overflow: "hidden", // Ensure child components are clipped to the rounded corners
  },
  imageBackground: {
    width: "100%",
    height: 230,
  },
  imageBackgroundImage: {
    borderRadius: 16, // Add border radius to the ImageBackground
  },
});

export default MovieDetailScreen;
