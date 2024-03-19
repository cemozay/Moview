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
import MovieCreditsList from "./PersonList";
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

const MovieDetailScreen = ({ route, navigation }: MovieDetailsProp) => {
  const user = useUserStore((state) => state.user);
  const docRef = doc(FirebaseDB, "likedmovie", user!.uid);
  const [renk, setRenk] = useState("white"); // Buna type atanacak

  const { movieId } = route.params;

  const apiResponse = useMovieData(movieId);
  const movieData = apiResponse.data;

  const fetchData = async () => {
    try {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fieldNames = Object.keys(docSnap.data());

        if (fieldNames.includes("movieId")) {
          setRenk("green");
        }
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // movieId içeriyorsa yeşil, içermiyorsa kırmızı renk ata
  useEffect(() => {
    fetchData();
    if (
      movieData &&
      movieData.genres.some((genre: any) => genre.name === "movieId")
    ) {
      setRenk("green");
    } else {
      setRenk("red");
    }
  }, [movieId]);

  return (
    <ScrollView className="bg-black">
      {movieData && (
        <View>
          <View className="justify-center items-center	">
            <ImageBackground
              className="w-screen h-64"
              resizeMode="contain"
              source={{
                uri: `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`,
              }}
            />
            <View className="absolute items-center">
              <Image
                className="w-48 h-72"
                source={{
                  uri: `https://image.tmdb.org/t/p/original${movieData.poster_path}`,
                }}
              />
              <View className="pt-1 justify-center items-center">
                <Text className="color-white text-2xl">{movieData.title}</Text>
                <Text className="pt-1 color-white text-1xl">
                  {movieData.release_date.toString()}
                </Text>
                <View className="flex pt-1 flex-row flex-wrap">
                  {movieData.genres.map((genre: any) => (
                    <Text key={genre.id} className="color-white  mr-2">
                      {genre.name}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
            <View className="w-screen h-72  justify-end">
              <View className=" h-20 flex-row">
                <View className=" w-1/2 justify-center items-center">
                  <Text className="color-white">⭐⭐⭐⭐</Text>
                </View>
                <View className="w-1/2 justify-center items-center">
                  <Text className="color-white">190 Review</Text>
                </View>
              </View>
            </View>
          </View>
          <View className=" w-scren h-16 border-white items-center flex-row justify-center">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AddReview", {
                  movieId: movieData.id.toString(),
                })
              }
              className="mx-4 h-16 w-16 bg-white justify-center items-center rounded-full"
            >
              <Icon name="heart" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="mx-4 h-16 w-16 bg-white justify-center items-center rounded-full">
              <Icon name="list" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="mx-4 h-16 w-16 bg-white justify-center items-center rounded-full">
              <Icon name="save" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                marginLeft: 4,
                height: 60,
                width: 60,
                backgroundColor: renk,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 30,
              }}
            >
              <Icon name="star" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <MovieCreditsList movieId={movieId} />
      <View className="border-b border-white items-center justify-between flex-row">
        <Text className="text-white text-2xl m-2">Review</Text>
        <Text className="text-white text-base m-2">1200 Review</Text>
      </View>
      <Button title="Geri Git" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

export default MovieDetailScreen;
