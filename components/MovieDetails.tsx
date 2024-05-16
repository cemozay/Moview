import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import MovieCreditsList from "./MovieCreditsList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { getDoc, doc } from "firebase/firestore";
import { FirebaseDB } from "../firebaseConfig";
import useUserStore from "../utils/hooks/useUserStore";
import { useMovieData } from "utils/hooks/useMovieData";

type MovieDetailsProp = NativeStackScreenProps<
  InsideStackParamList,
  "MovieDetails"
>;

const MovieDetailScreen = ({ navigation, route }: MovieDetailsProp) => {
  const user = useUserStore((state) => state.user);
  const docRef = doc(FirebaseDB, "likedmovie", user!.uid);

  const { movieId } = route.params;

  const apiResponse = useMovieData(movieId);
  const movieData = apiResponse.data;

  const fetchData = async () => {
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fieldNames = Object.keys(docSnap.data());

        if (fieldNames.includes("movieId")) {
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [movieId]);

  return (
    <View className="bg-black">
      {movieData && (
        <View>
          <View className="items-center">
            <ImageBackground
              className="w-screen h-96"
              resizeMode="cover"
              resizeMethod="auto"
              source={{
                uri: `https://image.tmdb.org/t/p/original${movieData.poster_path}`,
              }}
            ></ImageBackground>
          </View>
        </View>
      )}
    </View>
  );
};

export default MovieDetailScreen;
{
  /*                 <MovieCreditsList movieId={movieId} /> */
}
