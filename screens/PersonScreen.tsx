import React, { useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
} from "react-native";
import { useWindowDimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "@expo/vector-icons/FontAwesome";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { useFetch } from "utils/hooks/useFetch";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

type PersonScreenProps = NativeStackScreenProps<
  InsideStackParamList,
  "PersonScreen"
>;

type PersonDetails = {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: Date;
  deathday: null;
  gender: number;
  homepage: null;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
};

type MovieCreditsList = {
  cast: Person[];
  crew: Person[];
  id: number;
};

type Person = {
  adult: boolean;
  backdrop_path: null | string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: null | string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  character?: string;
  credit_id: string;
  order?: number;
  department?: string;
  job?: string;
};

const PersonScreen = ({ route, navigation }: PersonScreenProps) => {
  const { personId } = route.params;

  const window = useWindowDimensions();
  const [expanded, setExpanded] = useState(false);

  const { data: personDetails }: { data: PersonDetails; isError: boolean } =
    useFetch(
      ["person", personId],
      `${process.env.EXPO_PUBLIC_TMDB_API_URL}/person/${personId}?language=en-US`,
      {
        headers: {
          accept: "application/json",
          Authorization: "Bearer " + process.env.EXPO_PUBLIC_TMDB_AUTH_KEY,
        },
      }
    );

  const {
    data: movieCredits,
    isError: movieCreditsError,
  }: { data: MovieCreditsList; isError: boolean } = useFetch(
    ["person", personId, "movie_credits"],
    `${process.env.EXPO_PUBLIC_TMDB_API_URL}/person/${personId}/movie_credits?language=en-US`,
    {
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + process.env.EXPO_PUBLIC_TMDB_AUTH_KEY,
      },
    }
  );

  // Check if movieCredits is loaded before accessing its properties
  const allCredits = movieCredits
    ? [...movieCredits.cast, ...movieCredits.crew]
    : [];

  if (movieCreditsError) {
    console.error("Error fetching person details or movie credits");
    return null;
  }

  const renderMovieItem = ({ item }: { item: Person }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("MovieDetails", {
          movieId: item.id.toString(),
        })
      }
    >
      <View className="mx-5 my-2">
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original${item.poster_path}`,
          }}
          className="h-40 w-28 rounded-lg"
        />
        <Text numberOfLines={0} className="color-white text-base">
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView className="bg-black">
      {personDetails ? (
        <View>
          <ImageBackground
            source={{
              uri: `https://image.tmdb.org/t/p/original${personDetails.profile_path}`,
            }}
            style={{
              height: window.height * 0.75,
              width: window.width,
              alignItems: "flex-start",
              overflow: "hidden",
            }}
          >
            <View className=" justify-between flex-row z-10">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className=" justify-center items-center pt-4 pl-3 "
              >
                <FontAwesome6 name="angle-left" size={26} color="white" />
              </TouchableOpacity>
            </View>
            <LinearGradient
              className="justify-end"
              colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
              style={StyleSheet.absoluteFillObject}
            >
              <View className="w-screen justify-between items-center flex-row">
                <View className="">
                  <Text className=" color-white text-3xl pl-4">
                    {personDetails.name}
                  </Text>
                  <Text className="color-white text-1xl  pl-5">
                    {personDetails.popularity} Takipçi
                  </Text>
                </View>
                <View className="pr-4">
                  <TouchableOpacity className=" h-16 w-16 bg-white justify-center items-center rounded-full">
                    <Icon name="star" size={30} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
          <View className="justify-between items-center flex-row">
            <View>
              <Text className="color-white text-2xl m-2">Filmography</Text>
            </View>
            <View>
              <TouchableOpacity>
                <Text className="text-blue-500 m-2">See More </Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={allCredits}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMovieItem}
            horizontal
          />
          <View>
            <Text className="color-white text-2xl m-2">Biography</Text>
            <Text
              numberOfLines={expanded ? undefined : 4}
              className="color-white text-base m-2"
            >
              {personDetails.biography}
            </Text>
            <View className="items-center">
              {!expanded ? (
                <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                  <Text className=" text-blue-500 text-xl">See more</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setExpanded(false)}>
                  <Text className="text-blue-500 text-xl">See less</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ) : (
        <Text className="color-white">Kişi bilgileri yükleniyor...</Text>
      )}
    </ScrollView>
  );
};

export default PersonScreen;
