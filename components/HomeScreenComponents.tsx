import React from "react";
import {
  View,
  ScrollView,
  Dimensions,
  StatusBar,
  FlatList,
  Text,
  ActivityIndicator,
} from "react-native";
import { baseImagePath } from "../utils/functions";
import CategoryHeader from "./CategoryHeader";
import SubMovieCard from "./SubMovieCard";
import MovieCard from "./MovieCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { useMovieLists } from "utils/hooks/useMovieLists";

const { width } = Dimensions.get("window");

const ComingSoon = ({
  navigation,
}: NativeStackScreenProps<InsideStackParamList, "HomeScreen">) => {
  const nowPlayingMoviesData = useMovieLists("now_playing");
  const popularMoviesData = useMovieLists("upcoming");
  const upcomingMoviesData = useMovieLists("popular");

  if (
    nowPlayingMoviesData.isError ||
    popularMoviesData.isError ||
    upcomingMoviesData.isError
  ) {
    console.log("Error!");
  } else if (
    nowPlayingMoviesData.isLoading ||
    popularMoviesData.isLoading ||
    upcomingMoviesData.isLoading
  ) {
    console.log("Loading...");
  }

  const nowPlayingMoviesList = useMovieLists("now_playing").data?.results;
  const popularMoviesList = useMovieLists("upcoming").data?.results;
  const upcomingMoviesList = useMovieLists("popular").data?.results;

  if (!nowPlayingMoviesList && !popularMoviesList && !upcomingMoviesList) {
    return (
      <ScrollView
        className="flex bg-black"
        bounces={false}
        contentContainerStyle={{ flex: 1 }}
      >
        <StatusBar hidden />
        <View className="flex-1 justify-center self-center	">
          <ActivityIndicator size={"large"} color={"white"} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex bg-black" bounces={false}>
      <StatusBar hidden />
      <View>
        <FlatList
          data={nowPlayingMoviesList}
          keyExtractor={(item) => item.id.toString()}
          bounces={false}
          snapToInterval={width * 0.7 + 36}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate={0}
          contentContainerStyle={{ gap: 36 }}
          renderItem={({ item, index }) => {
            if (!item.original_title) {
              return (
                <View
                  style={{
                    width: (width - (width * 0.7 + 34 * 2)) / 2,
                  }}
                ></View>
              );
            }
            return (
              <MovieCard
                shoudlMarginatedAtEnd={true}
                cardFunction={() => {
                  navigation.navigate("MovieDetails", {
                    movieId: item.id.toString(),
                  });
                }}
                cardWidth={width * 0.7}
                isFirst={index == 0 ? true : false}
                isLast={index == upcomingMoviesList?.length - 1 ? true : false}
                title={item.original_title}
                imagePath={baseImagePath("w780", item.poster_path)}
                genre={item.genre_ids.slice(1, 4)}
              />
            );
          }}
        />
      </View>
      <CategoryHeader
        title={"Popüler"}
        onPress={() =>
          navigation.navigate("SeeMoreComponent", {
            array: popularMoviesList,
            name: "Popüler",
          })
        }
      />
      <FlatList
        data={popularMoviesList}
        keyExtractor={(item: any) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ gap: 36 }}
        renderItem={({ item, index }) => (
          <SubMovieCard
            shoudlMarginatedAtEnd={true}
            cardFunction={() => {
              navigation.navigate("MovieDetails", {
                movieId: item.id.toString(),
              });
            }}
            cardWidth={width / 3}
            isFirst={index == 0 ? true : false}
            isLast={index == upcomingMoviesList?.length - 1 ? true : false}
            title={item.original_title}
            imagePath={baseImagePath("w342", item.poster_path)}
          />
        )}
      />
      <CategoryHeader
        title={"Upcoming"}
        onPress={() =>
          navigation.navigate("SeeMoreComponent", {
            array: upcomingMoviesList,
            name: "Upcoming",
          })
        }
      />
      <FlatList
        data={upcomingMoviesList}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 36 }}
        renderItem={({ item, index }) => (
          <SubMovieCard
            shoudlMarginatedAtEnd={true}
            cardFunction={() => {
              navigation.navigate("MovieDetails", {
                movieId: item.id.toString(),
              });
            }}
            cardWidth={width / 3}
            isFirst={index == 0 ? true : false}
            isLast={index == upcomingMoviesList?.length - 1 ? true : false}
            title={item.original_title}
            imagePath={baseImagePath("w342", item.poster_path)}
            release_date={item.release_date}
            genre={item.genre_ids.slice(1, 4)}
          />
        )}
      />
    </ScrollView>
  );
};

const HomeScreenAnimeScreen = ({
  navigation,
}: NativeStackScreenProps<InsideStackParamList, "HomeScreen">) => {
  return (
    <ScrollView>
      <Text className="color-red-500">HomeScreenAnimeScreen</Text>
    </ScrollView>
  );
};
const HomeScreenMovieScreen = ({
  navigation,
}: NativeStackScreenProps<InsideStackParamList, "HomeScreen">) => {
  return (
    <ScrollView>
      <Text className="color-red-500">HomeScreenMovieScreen</Text>
    </ScrollView>
  );
};
const HomeScreenTvSerials = ({
  navigation,
}: NativeStackScreenProps<InsideStackParamList, "HomeScreen">) => {
  return (
    <ScrollView>
      <Text className="color-red-500">HomeScreenTvSerials</Text>
    </ScrollView>
  );
};
export {
  HomeScreenAnimeScreen,
  HomeScreenMovieScreen,
  HomeScreenTvSerials,
  ComingSoon,
};
