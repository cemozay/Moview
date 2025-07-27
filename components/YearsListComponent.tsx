import React from "react";
import {
  View,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import useFetchYearsMovie from "../utils/hooks/useFetchYearsMovie";
import { baseImagePath } from "../utils/functions";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "navigation/InsideNavigation";
import CategoryHeader from "./CategoryHeader";

export type Page = {
  results: Result[];
  total_pages: string;
  page: string;
  total_results: string;
};
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
type YearsListComponentProps = NativeStackScreenProps<
  RootStackParamList,
  "YearsListComponent"
> & {
  route: {
    params: {
      start: string;
      end: string;
    };
  };
};

const { width } = Dimensions.get("window");

const MoviesList = ({
  data,
  navigation,
}: {
  data: Result[];
  navigation: YearsListComponentProps["navigation"];
}) => {
  if (!Array.isArray(data)) {
    console.error("Invalid data format: ", data);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Invalid data format</Text>
      </View>
    );
  }

  return (
    <View>
      <CategoryHeader
        title={"Popüler"}
        onPress={() =>
          navigation.navigate("SeeMoreComponent", {
            array: data,
            name: "Popüler",
          })
        }
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={{
                marginRight: index === data.length - 1 ? 0 : 16,
                marginLeft: index === 0 ? 0 : 16,
                width: width / 3,
              }}
              onPress={() => {
                navigation.navigate("MovieDetails", {
                  movieId: item.id.toString(),
                });
              }}
            >
              <Image
                source={{ uri: baseImagePath("w342", item.poster_path) }}
                style={{
                  width: width / 3,
                  height: width / 2,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              />
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontSize: 12,
                }}
              >
                {item.original_title}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const YearsListComponent = ({ navigation, route }: YearsListComponentProps) => {
  const { start, end } = route.params;
  const { data, error } = useFetchYearsMovie(start, end);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Error loading data</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View>
      <MoviesList data={data.results} navigation={navigation} />
    </View>
  );
};

export default YearsListComponent;
