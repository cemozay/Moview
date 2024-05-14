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
import { useMovieData } from "utils/hooks/useMovieData";
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
  const reviewRef = collection(FirebaseDB, "reviews");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [movieDataMap, setMovieDataMap] = useState<MovieData>({});

  const fetchMovieData = async (review: Review) => {
    const apiResponse = await useMovieData(review.mediaId);
    const movieData = apiResponse.data;
    setMovieDataMap((prevMap) => ({
      ...prevMap,
      [review.mediaId]: movieData,
    }));
  };

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(query(reviewRef));
      const reviewList = snapshot.docs.map((doc) => {
        const reviewData = doc.data() as Review;
        return { ...reviewData, id: doc.id };
      });
      setReviews(reviewList);

      const movieIds = reviewList.map((review) => review.mediaId);

      movieIds.forEach((mediaId) => {
        fetchMovieData({
          mediaId,
          timestamp: "",
          rating: "",
          text: "",
          userId: "",
          id: "", // Dummy id for fetchMovieData
        });
      });
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
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
        {reviews.map((review) => (
          <TouchableOpacity
            key={review.id}
            onPress={() =>
              navigation.navigate("ReviewScreen", { reviewId: review.id })
            }
          >
            <ImageBackground
              className=" bg-black border-y border-white p-4 "
              source={null}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.7)"]}
                style={{ ...StyleSheet.absoluteFillObject }}
              />
              <View className="flex-row justify-between">
                {/*                 {movieDataMap[review.mediaId] && (
                 */}
                <View>
                  <Text className="text-white text-2xl">
                    Filmin Adı
                    {/* {movieDataMap[review.mediaId].poster_path} */}
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
                  {/*                 {movieDataMap[review.mediaId] && (
                   */}
                  <Image
                    className="h-36 rounded-xl w-24 "
                    source={
                      require("../poster.jpg")
                      /*             {
                                            uri: `https://image.tmdb.org/t/p/original${
                        movieDataMap[review.mediaId].poster_path
                      }`,
                    } */
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
