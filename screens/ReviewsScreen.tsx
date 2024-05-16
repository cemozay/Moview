import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { collection, query, getDocs } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { FirebaseDB } from "firebaseConfig";
import { useMovieDataArray } from "utils/hooks/useMovieDataArray";
import LinearGradient from "react-native-linear-gradient";

type ReviewsScreenProp = NativeStackScreenProps<
  InsideStackParamList,
  "ReviewsScreen"
>;

type MovieData = {
  [key: string]: any;
};

type Review = {
  timestamp: any;
  mediaId: string;
  rating: string;
  text: string;
  userId: string;
  id: string;
};

export default function ReviewScreen({ navigation }: ReviewsScreenProp) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [movies, setMovies] = useState<MovieData[]>([]);

  const movieIds = reviews.map((review) => review.mediaId);
  const {
    data: movieData,
    isLoading,
    isError,
    error,
    refetch,
  } = useMovieDataArray(movieIds);

  const reviewRef = collection(FirebaseDB, "reviews");
  const doc_query = query(reviewRef);

  const fetchReviews = async () => {
    try {
      const snapshot = await getDocs(doc_query);
      const reviewList = snapshot.docs.map((doc) => {
        const reviewData = doc.data() as Review;
        return { ...reviewData, id: doc.id };
      });

      setReviews(reviewList);
    } catch (err) {
      alert(err);
    }
  };

  const handleRefresh = () => {
    fetchReviews();
    refetch();
  };

  useEffect(() => {
    console.log(movieData);
    if (!isLoading && !isError && movieData) {
      setMovies(movieData);
    } else {
      setMovies([]);
      if (isError) {
        console.log(error);
      }
    }
  }, []);

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

  return (
    <View className="flex-1 bg-black">
      <View className="flex-row justify-between items-center p-3">
        <View>
          <Text className="text-white text-3xl">Review</Text>
        </View>
        <View className="flex-row gap-3">
          <TouchableOpacity onPress={() => navigation.navigate("SearchScreen")}>
            <Icon name="search" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRefresh}>
            <Icon name="refresh" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        {reviews.length > 0 &&
          movies.length > 0 &&
          reviews.map((review) => (
            <TouchableOpacity
              key={review.id}
              onPress={() =>
                navigation.navigate("ReviewScreen", { reviewId: review.id })
              }
            >
              <ImageBackground
                className=" bg-black border-y border-white p-4 "
                source={
                  movies.find((movie) => movie.id.toString() === review.mediaId)
                    ?.backdrop_path
                }
              >
                <LinearGradient
                  colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.7)"]}
                  style={{ ...StyleSheet.absoluteFillObject }}
                />
                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-white text-2xl">
                      {
                        movies.find(
                          (movie) => movie.id.toString() === review.mediaId
                        )?.title
                      }
                    </Text>
                    <Text className="text-white">{review.rating}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-white">{review.userId}</Text>
                    <Image
                      className="w-10 h-10 rounded-full"
                      source={require("./avatar.jpg")}
                    />
                  </View>
                </View>
                <View className="flex-row mt-2">
                  <View className="w-1/4">
                    <Image
                      className="h-36 rounded-xl w-24 "
                      source={
                        movies.find(
                          (movie) => movie.id.toString() === review.mediaId
                        )?.poster_path
                      }
                    />
                  </View>
                  <View className="justify-center ml-1 w-3/4">
                    <View className="my-4 ">
                      <Text numberOfLines={4} className="text-white text-sm	">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Et sit enim nisi corrupti labore officiis, dolores
                        voluptatum debitis officia deserunt porro obcaecati, eos
                        aspernatur facere nemo quaerat dicta quisquam X
                      </Text>
                    </View>
                    <View className="my-4 flex-row gap-3">
                      <Text className="text-white">
                        {formatTimestamp(review.timestamp)}
                      </Text>
                      <Text className="color-white">X Yorum</Text>
                      <Text className="color-white">X Beğeni</Text>
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
      </ScrollView>
      <View className="items-end pb-4 pr-4">
        <TouchableOpacity
          onPress={() => navigation.navigate("Selectlist")}
          className="ml-4 h-16 w-16 bg-white justify-center items-center rounded-full"
        >
          <Icon name="heart" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
