import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import React from "react";
import { View, FlatList, Text, Image, TouchableOpacity } from "react-native";
import { useFetch } from "utils/hooks/useFetch";

type CreditList = {
  id: number;
  cast: People[];
  crew: People[];
};

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

const MovieCreditsList = ({
  navigation,
  movieId,
}: NativeStackScreenProps<InsideStackParamList, "MovieDetails"> & {
  movieId: string;
}) => {
  const { data: credits }: { data: CreditList } = useFetch(
    ["movies", movieId, "credits"],
    `${process.env.EXPO_PUBLIC_TMDB_API_URL}/movie/${movieId}?credits?language=en-US`,
    {
      headers: {
        accept: "application/json",
        Authorization: "Bearer " + process.env.EXPO_PUBLIC_TMDB_AUTH_KEY,
      },
    }
  );
  const allCredits = [...credits.cast, ...credits.crew];

  const renderCreditItem = ({ item }: { item: People }) => (
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
        data={allCredits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCreditItem}
        horizontal
      />
    </View>
  );
};

export default MovieCreditsList;
