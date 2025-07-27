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
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { useMovieData } from "../utils/hooks/useMovieData";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FontAwesome6 } from "@expo/vector-icons";
import Icon from "@expo/vector-icons/FontAwesome";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FirebaseDB } from "../firebaseConfig";
import { fetchTrailer } from "../utils/hooks/useFetchTrailer";
import useFetchCrew from "../utils/hooks/useFetchCrew";
import { FloatingAction } from "../utils/FloatingActionPlaceholder";
import { formatTimestamp } from "../utils/functions";

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

type ActionItem = {
  text: string;
  icon: JSX.Element;
  onPress?: () => void;
  name: string;
  position: number;
  color: string;
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

  const actions: ActionItem[] = movieData
    ? [
        {
          text: "Already Watched",
          icon: <Icon name="check" size={24} color="white" />,
          name: "bt_alreadywatch",
          position: 1,
          color: "#FF5C00",
          onPress: () => {
            console.log("Already Watched pressed");
            // Add your already watched logic here
          },
        },
        {
          text: "Watchlist",
          icon: <Icon name="bookmark" size={24} color="white" />,
          name: "bt_watchlist",
          position: 2,
          color: "#FF5C00",
          onPress: () => {
            console.log("Watchlist pressed");
            // Add your watchlist logic here
          },
        },
        {
          text: "AddList",
          icon: <Icon name="plus" size={24} color="white" />,
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
          icon: <FontAwesome6 name="pen" size={16} color="white" />,
          name: "bt_review",
          position: 4,
          color: "#FF5C00",
          onPress: () => {
            navigation.navigate("AddReview", {
              reviewId: null,
              movieId: movieData.id.toString(),
            });
          },
        },
      ]
    : [];

  const renderItem = ({ item }: { item: People }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("PersonScreen", { personId: item.id })}
      className="items-center"
    >
      <View className="w-20 h-28 rounded-lg overflow-hidden mb-2">
        {item.profile_path ? (
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/original${item.profile_path}`,
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require("../screens/avatar.jpg")}
            className="w-full h-full"
            resizeMode="cover"
          />
        )}
      </View>
      <Text
        className="color-white text-xs text-center font-medium"
        numberOfLines={2}
        style={{ width: 80 }}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderReviewItem = ({ item }: { item: Review }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ReviewScreen", { reviewId: item.id })}
      style={{ width: screenWidth - 32 }}
      className="bg-gray-900/40 rounded-lg p-4 mx-2"
    >
      <Text
        numberOfLines={3}
        className="color-gray-200 text-base leading-5 mb-3"
      >
        {item.text}
      </Text>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Image
            className="w-8 h-8 rounded-full"
            source={require("../screens/avatar.jpg")}
          />
          <View className="ml-2">
            <Text className="text-sm color-white font-medium">
              {item.userId}
            </Text>
            <Text className="color-gray-400 text-xs">
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center space-x-3">
          <View className="flex-row items-center">
            <Icon name="comment" size={14} color="#FF5C00" />
            <Text className="color-gray-400 ml-1 text-xs">0</Text>
          </View>
          <View className="flex-row items-center">
            <Icon name="heart" size={14} color="#FF5C00" />
            <Text className="color-gray-400 ml-1 text-xs">0</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        {movieData && (
          <View>
            {/* Header with poster */}
            <View className="relative">
              <ImageBackground
                style={{ width: "100%", height: 400 }}
                resizeMode="cover"
                source={{
                  uri: `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`,
                }}
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.9)"]}
                  style={StyleSheet.absoluteFillObject}
                />

                {/* Navigation */}
                <View className="flex-row justify-between px-4 pt-12">
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="bg-black/50 rounded-full p-2"
                  >
                    <AntDesign name="left" size={24} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-black/50 rounded-full p-2">
                    <Icon name="heart" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                {/* Movie Info */}
                <View className="absolute bottom-6 left-4 right-4">
                  <View className="flex-row">
                    <Image
                      className="h-40 w-28 rounded-lg mr-4"
                      source={{
                        uri: `https://image.tmdb.org/t/p/original${movieData.poster_path}`,
                      }}
                    />
                    <View className="flex-1 justify-end">
                      <Text className="color-white text-2xl font-bold mb-2">
                        {movieData.title}
                      </Text>
                      <Text className="color-gray-300 text-base mb-3">
                        {movieData.release_date?.toString() || "TBA"}
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {movieData.genres?.slice(0, 2).map((genre: any) => (
                          <Text
                            key={genre.id}
                            className="color-orange-400 text-sm bg-orange-500/20 px-2 py-1 rounded"
                          >
                            {genre.name}
                          </Text>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </View>

            {/* Movie Details */}
            <View className="px-4 py-4">
              <Text className="color-gray-200 text-base leading-6 mb-4">
                {movieData.overview}
              </Text>

              <View className="flex-row justify-between mb-6">
                <View className="flex-row items-center bg-gray-900/50 rounded-lg px-3 py-2">
                  <Text className="color-white text-base font-bold">
                    ⭐ {movieData.vote_average?.toFixed(1)}
                  </Text>
                  <Text className="color-gray-400 text-sm ml-2">
                    ({movieData.vote_count?.toLocaleString()})
                  </Text>
                </View>
                <TouchableOpacity
                  className="flex-row items-center bg-orange-500/20 rounded-lg px-4 py-2"
                  onPress={handlePress}
                >
                  <AntDesign name="playcircleo" size={18} color="#FF5C00" />
                  <Text className="color-orange-400 text-base font-medium ml-2">
                    Trailer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Cast Section */}
            <View className="mb-6">
              <TouchableOpacity
                className="flex-row justify-between items-center px-4 py-2"
                onPress={() =>
                  navigation.navigate("SeeMoreComponent", {
                    name: "Cast",
                    array: cast,
                  })
                }
              >
                <Text className="color-white text-xl font-bold">Cast</Text>
                <View className="flex-row items-center">
                  <Text className="color-orange-400 text-sm mr-2">
                    See More
                  </Text>
                  <Icon color="#FF5C00" name="chevron-right" size={12} />
                </View>
              </TouchableOpacity>
              <FlatList
                horizontal
                data={cast}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
              />
            </View>

            {/* Crew Section */}
            <View className="mb-6">
              <TouchableOpacity
                className="flex-row justify-between items-center px-4 py-2"
                onPress={() =>
                  navigation.navigate("SeeMoreComponent", {
                    name: "Crew",
                    array: crew,
                  })
                }
              >
                <Text className="color-white text-xl font-bold">Crew</Text>
                <View className="flex-row items-center">
                  <Text className="color-orange-400 text-sm mr-2">
                    See More
                  </Text>
                  <Icon color="#FF5C00" name="chevron-right" size={12} />
                </View>
              </TouchableOpacity>
              <FlatList
                horizontal
                data={crew}
                renderItem={renderItem}
                keyExtractor={(item, index) =>
                  `crew-${item.credit_id}-${index}`
                }
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
              />
            </View>

            {/* Reviews Section */}
            <View className="px-4 pb-20">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="color-white text-xl font-bold">Reviews</Text>
                <TouchableOpacity>
                  <Text className="color-orange-400 text-sm">See all</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={reviews}
                keyExtractor={(item) => item.userId + item.timestamp}
                renderItem={renderReviewItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                snapToAlignment="center"
                decelerationRate="fast"
                snapToInterval={screenWidth - 32}
                contentContainerStyle={{ gap: 12 }}
              />
            </View>
          </View>
        )}
      </ScrollView>
      <FloatingAction
        actions={actions}
        color="#FF5C00"
        distanceToEdge={16}
        overlayColor="rgba(0, 0, 0, 0.85)"
        onPressItem={(name: string) => {
          const action = actions.find((item) => item.name === name);
          if (action && action.onPress) {
            action.onPress();
          } else {
            console.log(`No onPress function defined for action: ${name}`);
          }
        }}
      />
    </SafeAreaView>
  );
};

export default MovieDetailScreen;
