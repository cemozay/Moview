import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Linking,
  ScrollView,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { useMovieData } from "utils/hooks/useMovieData";
import LinearGradient from "react-native-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FontAwesome6 } from "@expo/vector-icons";
import Icon from "@expo/vector-icons/FontAwesome";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FirebaseDB } from "firebaseConfig";
import { fetchTrailer } from "utils/hooks/useFetchTrailer";
import useFetchCrew from "utils/hooks/useFetchCrew";
import { FloatingAction } from "react-native-floating-action";

const screenWidth = Dimensions.get("window").width;

type MovieDetailsProp = NativeStackScreenProps<
  InsideStackParamList,
  "MovieDetails"
>;

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
  const { data: movieData } = apiResponse;
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const { cast, crew } = useFetchCrew(movieId);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchTrailer(movieId, setTrailerUrl);
  }, [movieId]);

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
    fetchReviews();
  }, [movieData]);

  const handlePress = () => {
    if (trailerUrl) {
      Linking.openURL(trailerUrl);
    } else {
      alert("Trailer not available");
    }
  };

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
  type ActionItem = {
    text: string;
    icon: JSX.Element;
    onPress?: () => void;
    name: string;
    position: number;
    color: string;
  };
  const actions: ActionItem[] = [
    {
      text: "Already Watch",
      icon: <Icon name="search" size={30} color="white" />,
      name: "bt_alreadywatch",
      position: 1,
      color: "#FF5C00",
      onPress: () => {
        console.log("Already Watch pressed");
      },
    },
    {
      text: "WatchList",
      icon: <Icon name="search" size={30} color="white" />,
      name: "bt_watchlist",
      position: 2,
      color: "#FF5C00",
      onPress: () => {
        console.log("WatchList pressed");
      },
    },
    {
      text: "AddList",
      icon: <Icon name="search" size={30} color="white" />,
      name: "bt_addlist",
      position: 3,
      color: "#FF5C00",
      onPress: () => {
        navigation.navigate("MovieDetailAddlist", {
          movieId: movieData.id.toString(),
        });
      },
    },
    {
      text: "Review",
      icon: <FontAwesome6 name="add" size={16} color="white" />,
      name: "bt_review",
      position: 4,
      color: "#FF5C00",
      onPress: () => {
        console.log("Review pressed");
        navigation.navigate("AddReview", {
          reviewId: null,
          movieId: movieData.id.toString(),
        });
      },
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
                className="w-screen h-96 mb-12"
                resizeMode="cover"
                source={{
                  uri: `https://image.tmdb.org/t/p/original${movieData.poster_path}`,
                }}
              >
                <View className="flex-row justify-between z-10">
                  <View>
                    <TouchableOpacity
                      onPress={() => navigation.goBack()}
                      className=" justify-center items-center pt-4 pl-3 "
                    >
                      <AntDesign name="left" size={26} color="white" />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity className=" justify-center items-center pt-4 pr-3 ">
                      <Icon name="heart" size={26} color="white" />
                      {/* Eğer Beğendiği bir film ise kalp kırmızı olur eğer hali hazırda beğenmediği bir film ise rengini korur */}
                    </TouchableOpacity>
                  </View>
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
                    {/*                     {movieData.release_date}
                     */}
                    24 Mayıs 2023
                  </Text>
                  <Text className="color-red-700 text-xl">genres{}</Text>
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
                  <View>
                    <TouchableOpacity
                      className="flex-row items-center gap-2"
                      onPress={handlePress}
                    >
                      <AntDesign name="playcircleo" size={24} color="white" />
                      <Text className="pr-3 color-white text-base">
                        Watch Trailer
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
            <View>
              <View className="items-center">
                <View className="color-red-800 border-neutral-800 border w-11/12"></View>
              </View>
              <View className="m-3">
                <TouchableOpacity
                  className="flex-row justify-between items-center"
                  onPress={() =>
                    navigation.navigate("SeeMoreComponent", {
                      name: "Cast",
                      array: cast,
                    })
                  }
                >
                  <Text className="color-white text-2xl">Cast</Text>
                  <View className="flex-row pr-3 items-center">
                    <Text className="color-orange-400 pl-3 pr-2 py-3 text-xs">
                      See More
                    </Text>
                    <Icon color={"orange"} name="chevron-right" size={8} />
                  </View>
                </TouchableOpacity>
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
                <TouchableOpacity
                  className="flex-row justify-between items-center"
                  onPress={() =>
                    navigation.navigate("SeeMoreComponent", {
                      name: "Crew",
                      array: crew,
                    })
                  }
                >
                  <Text className="color-white text-2xl">Crew</Text>
                  <View className="flex-row pr-3 items-center">
                    <Text className="color-orange-400 pl-3 pr-2 py-3 text-xs">
                      See More
                    </Text>
                    <Icon color={"orange"} name="chevron-right" size={8} />
                  </View>
                </TouchableOpacity>
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
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <FloatingAction
        actions={actions}
        color="#FF5C00"
        distanceToEdge={16}
        overlayColor="rgba(0, 0, 0, 0.85)"
        onPressItem={(name) => {
          const action = actions.find((item) => item.name === name);
          if (action && action.onPress) {
            action.onPress();
          } else {
            console.log(`No onPress function defined for action: ${name}`);
          }
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
