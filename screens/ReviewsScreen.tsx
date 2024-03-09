import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { collection, query, getDocs } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { FirebaseDB } from "firebaseConfig";

type ReviewsScreenProp = NativeStackScreenProps<
  InsideStackParamList,
  "ReviewsScreen"
>;

interface MovieData {
  [key: string]: any;
}

interface Review {
  date: string;
  movieId: string;
  puan: string;
  review: string;
  id: string;
  user: string;
}

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2UzY2MwNDE2ZjcwM2RmOTI1NmM1ZTgyYmEwZTVmYiIsInN1YiI6IjY1ODM2NTZhMDgzNTQ3NDRmM3NlODc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nv0234eCrGmSRXSURyFUGO7uIub5OAOeCA0t9kCPLr0",
  },
};

export default function ReviewScreen({ navigation }: ReviewsScreenProp) {
  const reviewRef = collection(FirebaseDB, "reviews");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [movieDataMap, setMovieDataMap] = useState<MovieData>({});

  const fetchMovieData = async (review: Review) => {
    try {
      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${review.movieId}?language=en-US`,
        options
      );
      const movieData = await movieResponse.json();

      setMovieDataMap((prevMap) => ({
        ...prevMap,
        [review.movieId]: movieData,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(query(reviewRef));
      const reviewList = snapshot.docs.map((doc) => {
        const reviewData = doc.data() as Review;
        return { ...reviewData, id: doc.id }; // Eklenen satır: id ekleniyor
      });
      setReviews(reviewList);

      const movieIds = reviewList.map((review) => review.movieId);

      movieIds.forEach((movieId) => {
        fetchMovieData({
          movieId,
          date: "",
          puan: "",
          review: "",
          user: "",
          id: "",
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

  return (
    <View className="flex-1 bg-black">
      <View className="flex-row justify-between items-center py-3 px-3">
        <View>
          <Text className="text-white text-3xl">Moview</Text>
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
        {reviews.map((review, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row justify-between bg-red-500 border-2 border-white p-4 "
            onPress={() =>
              navigation.navigate("ReviewScreen", { reviewId: review.id })
            }
          >
            <View>
              <Text className="text-white">{review.date}</Text>
              <Text className="text-white">{review.puan}</Text>
              <Text className="text-white">{review.review}</Text>
              <Text className="text-white">{review.user}</Text>
            </View>
            {movieDataMap[review.movieId] && (
              <Image
                style={{ width: 150, height: 200 }}
                source={{
                  uri: `https://image.tmdb.org/t/p/original${
                    movieDataMap[review.movieId].poster_path
                  }`,
                }}
              />
            )}
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
