import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { FontAwesome6 } from "@expo/vector-icons";

type Result = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: Date;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
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

type SeeMoreComponentProps = NativeStackScreenProps<
  InsideStackParamList,
  "SeeMoreComponent"
>;

const SeeMoreComponent = ({ navigation, route }: SeeMoreComponentProps) => {
  const idArray: Result[] | People[] = route.params.array;

  const isResult = (item: Result | People): item is Result => {
    return "poster_path" in item;
  };

  const filteredArray = idArray.filter((item) => {
    return "poster_path" in item || "profile_path" in item;
  });

  return (
    <View className="bg-black flex-1">
      <View className="flex-row z-10 bg-black">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="justify-center items-center pt-4 pl-3"
        >
          <FontAwesome6 name="angle-left" size={26} color="white" />
        </TouchableOpacity>
        <Text className="color-white pt-4 pl-3 text-2xl">
          See More {route.params.name}
        </Text>
      </View>
      <FlatList
        data={filteredArray}
        keyExtractor={(index) => index.toString()}
        numColumns={3}
        renderItem={({ item }) => (
          <View className="p-2" style={{ flex: 1 / 3 }}>
            {isResult(item) ? (
              <View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("MovieDetails", {
                      movieId: item.id.toString(),
                    })
                  }
                >
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/original${item.poster_path}`,
                    }}
                    className="h-40 w-full rounded-lg"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("PersonScreen", {
                      personId: item.id,
                    })
                  }
                >
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/original${item.profile_path}`,
                    }}
                    className="h-40 w-full rounded-lg"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default SeeMoreComponent;
