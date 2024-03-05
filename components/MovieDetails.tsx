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
import { FirebaseAuth, FirebaseDB } from "../firebaseConfig";

type MovieDetailsProp = NativeStackScreenProps<
  InsideStackParamList,
  "MovieDetails"
>;

const user = FirebaseAuth.currentUser;
const docRef = doc(FirebaseDB, "likedmovie", user!.uid);

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2UzY2MwNDE2ZjcwM2RmOTI1NmM1ZTgyYmEwZTVmYiIsInN1YiI6IjY1ODM2NTZhMDgzNTQ3NDRmMzNlODc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nv0234eCrGmSRXSURyFUGO7uIub5OAOeCA0t9kCPLr0",
  },
};

const MovieDetailScreen = ({ route, navigation }: MovieDetailsProp) => {
  const [response, setResponseData] = useState(null); // Buna type atanacak
  const [renk, setRenk] = useState("white"); // Buna type atanacak

  const { movieId } = route.params;

  // Fetch fonksiyon tekrarı
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

  useEffect(() => {
    fetchData();

    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setResponseData(response);

        // movieId içeriyorsa yeşil, içermiyorsa kırmızı renk ata
        if (
          response &&
          response.genres.some((genre) => genre.name === "movieId")
        ) {
          setRenk("green");
        } else {
          setRenk("red");
        }
      })
      .catch((err) => console.error(err));
  }, [movieId]);

  // Fetch fonksiyon tekrarı

  return (
    <ScrollView className="bg-black">
      {response && (
        <View>
          <View className="justify-center items-center	">
            <ImageBackground
              className="w-screen h-64"
              resizeMode="contain"
              source={{
                uri: `https://image.tmdb.org/t/p/original${response.backdrop_path}`,
              }}
            />
            <View className="absolute items-center">
              <Image
                className="w-48 h-72"
                source={{
                  uri: `https://image.tmdb.org/t/p/original${response.poster_path}`,
                }}
              />
              <View className="pt-1 justify-center items-center">
                <Text className="color-white text-2xl">{response.title}</Text>
                <Text className="pt-1 color-white text-1xl">
                  {response.release_date}
                </Text>
                <View className="flex pt-1 flex-row flex-wrap">
                  {response.genres.map((genre) => (
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
                navigation.navigate("AddReview", { movieId: response.id })
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
