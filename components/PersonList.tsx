import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import React, { useState, useEffect } from "react";
import { View, FlatList, Text, Image, TouchableOpacity } from "react-native";

type MovieCreditsListProp = NativeStackScreenProps<
  InsideStackParamList,
  "MovieCreditsList"
>;

type MovieIdProps = {
  movieId: string;
};

type creditsProps = {
  id: string;
  profile_path: string;
  name: string;
  character: string;
};

const MovieCreditsList = ({ movieId }: MovieCreditsListProp & MovieIdProps) => {
  const [credits, setCredits] = useState<Array<creditsProps>>([]);

  useEffect(() => {
    const fetchCredits = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2UzY2MwNDE2ZjcwM2RmOTI1NmM1ZTgyYmEwZTVmYiIsInN1YiI6IjY1ODM2NTZhMDgzNTQ3NDRmMzNlODc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nv0234eCrGmSRXSURyFUGO7uIub5OAOeCA0t9kCPLr0",
        },
      };

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
          options
        );
        const data = await response.json();
        setCredits(data.cast);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCredits();
  }, [movieId]);

  const renderCreditItem = ({ item }: { item: creditsProps }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("PersonScreen", { personId: item.id })}
    >
      <View className="m-4">
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original${item.profile_path}`,
          }}
          className="h-40 w-28 rounded-lg"
        />
        <Text className="color-white mt-2">{item.name}</Text>
        <Text className="color-gray-500">{item.character}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className=" m-2">
      <Text className="color-white text-2xl">Top Billed Cast</Text>

      <FlatList
        data={credits}
        keyExtractor={(item) => item.id}
        renderItem={renderCreditItem}
        horizontal
      />
    </View>
  );
};

export default MovieCreditsList;
