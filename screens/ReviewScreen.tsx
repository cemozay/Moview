import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { collection, query, getDocs } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { FirebaseDB } from "firebaseConfig";

type ReviewScreenProp = NativeStackScreenProps<
  InsideStackParamList,
  "ReviewScreen"
>;

interface MovieData {
  [key: string]: any;
}

interface Review {
  date: string;
  movieid: string;
  puan: string;
  reviewd: string;
}

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2UzY2MwNDE2ZjcwM2RmOTI1NmM1ZTgyYmEwZTVmYiIsInN1YiI6IjY1ODM2NTZhMDgzNTQ3NDRmM3NlODc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nv0234eCrGmSRXSURyFUGO7uIub5OAOeCA0t9kCPLr0",
  },
};

export default function ReviewScreen({ navigation }: ReviewScreenProp) {
  const reviewRef = collection(FirebaseDB, "reviews");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [movieDataMap, setMovieDataMap] = useState<MovieData>({});

  const fetchMovieData = async (review: Review) => {
    try {
      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${review.movieid}?language=en-US`,
        options
      );
      const movieData = await movieResponse.json();

      setMovieDataMap((prevMap) => ({
        ...prevMap,
        [review.movieid]: movieData,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(query(reviewRef));
      const reviewList = snapshot.docs.map((doc) => doc.data() as Review);
      setReviews(reviewList);

      const movieIds = reviewList.map((review) => review.movieid);

      movieIds.forEach((movieid) => {
        fetchMovieData({ movieid, date: "", puan: "", reviewd: "" });
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
          >
            <View>
              <Text className="text-white">{review.date}</Text>
              <Text className="text-white">{review.movieid}</Text>
              <Text className="text-white">{review.puan}</Text>
              <Text className="text-white">{review.reviewd}</Text>
            </View>
            {movieDataMap[review.movieid] && (
              <Image
                style={{ width: 150, height: 200 }}
                source={{
                  uri: `https://image.tmdb.org/t/p/original${
                    movieDataMap[review.movieid].poster_path
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
