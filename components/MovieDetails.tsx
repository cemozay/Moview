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
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { useMovieData } from "utils/hooks/useMovieData";
import LinearGradient from "react-native-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FloatingAction } from "react-native-floating-action";
import Icon from "@expo/vector-icons/FontAwesome";

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

const MovieDetailScreen = ({ navigation, route }: MovieDetailsProp) => {
  const { movieId } = route.params;
  const apiResponse = useMovieData(movieId);
  const movieData = apiResponse.data;
  const [cast, setCast] = useState<People[]>([]);
  const [crew, setCrew] = useState<People[]>([]);

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

  useEffect(() => {
    fetchData();
  }, [movieId]);

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
  return (
    <View className="bg-black flex-1 ">
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
                  <Text className="color-red-700 text-xl">
                    {movieData.release_date}
                  </Text>
                  <Text className="color-red-700 text-xl">
                    {movieData.genres.name}
                  </Text>
                </View>
              </ImageBackground>
              <View>
                <Text className="color-white">{movieData.overview}</Text>
              </View>
            </View>
            <View className="m-2">
              <Text className="color-white text-2xl">Cast</Text>
              <FlatList
                horizontal
                data={cast}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 10 }}
              />
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

export default MovieDetailScreen;
