import React from "react";
import {
  View,
  Dimensions,
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
import { useMovieLists } from "../utils/hooks/useMovieLists";

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
  }

  const nowPlayingMoviesList = useMovieLists("now_playing").data?.results;
  const popularMoviesList = useMovieLists("upcoming").data?.results;
  const upcomingMoviesList = useMovieLists("popular").data?.results;

  if (!nowPlayingMoviesList && !popularMoviesList && !upcomingMoviesList) {
    return (
      <View className="flex-1 justify-center items-center bg-black py-20">
        <View className="bg-gray-900/50 p-8 rounded-xl border border-gray-700/30">
          <ActivityIndicator size={"large"} color={"#FF5C00"} />
          <Text className="color-gray-300 text-lg mt-4 text-center font-medium">
            Loading amazing content...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-black">
      {/* Hero Section */}
      <View>
        <FlatList
          data={nowPlayingMoviesList}
          keyExtractor={(item) => item.id.toString()}
          bounces={false}
          snapToInterval={width * 0.7 + 12} // Card width + gap
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate={0}
          contentContainerStyle={{
            gap: 12,
            paddingVertical: 10,
          }}
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
              <View>
                <MovieCard
                  shouldMarginatedAtEnd={true}
                  cardFunction={() => {
                    navigation.navigate("MovieDetails", {
                      movieId: item.id.toString(),
                    });
                  }}
                  cardWidth={width * 0.7}
                  isFirst={index == 0 ? true : false}
                  isLast={
                    index == upcomingMoviesList?.length - 1 ? true : false
                  }
                  title={item.original_title}
                  imagePath={baseImagePath("w780", item.poster_path)}
                  genre={item.genre_ids.slice(1, 4)}
                  rating={item.vote_average}
                />
              </View>
            );
          }}
        />
      </View>
      {/* Popular Section */}
      <View className="mb-6 ">
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
          contentContainerStyle={{
            gap: 20,
          }}
          renderItem={({ item, index }) => (
            <View>
              <SubMovieCard
                shoudlMarginatedAtEnd={true}
                cardFunction={() => {
                  navigation.navigate("MovieDetails", {
                    movieId: item.id.toString(),
                  });
                }}
                cardWidth={width / 3}
                isFirst={index == 0 ? true : false}
                isLast={index == popularMoviesList?.length - 1 ? true : false}
                title={item.original_title}
                imagePath={baseImagePath("w342", item.poster_path)}
              />
            </View>
          )}
        />
      </View>
      {/* Upcoming Section */}
      <View className="mb-6">
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
          contentContainerStyle={{
            gap: 20,
          }}
          renderItem={({ item, index }) => (
            <View>
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
            </View>
          )}
        />
      </View>
    </View>
  );
};

const HomeScreenAnimeScreen = ({
  navigation: _navigation,
}: NativeStackScreenProps<InsideStackParamList, "HomeScreen">) => {
  return (
    <View className="flex-1 bg-black px-5 py-8">
      <View className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-xl p-8 border border-purple-500/20">
        <Text className="color-white text-2xl font-bold text-center mb-4">
          🌸 Anime Section
        </Text>
        <Text className="color-gray-300 text-center text-base leading-6">
          Anime content is coming soon! Stay tuned for the best anime movies and
          series.
        </Text>
        <View className="bg-purple-500/10 rounded-lg p-6 mt-6">
          <Text className="color-purple-400 text-center font-semibold">
            Under Development 🚀
          </Text>
        </View>
      </View>
    </View>
  );
};
const HomeScreenMovieScreen = ({
  navigation: _navigation,
}: NativeStackScreenProps<InsideStackParamList, "HomeScreen">) => {
  return (
    <View className="flex-1 bg-black px-5 py-8">
      <View className="bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-xl p-8 border border-orange-500/20">
        <Text className="color-white text-2xl font-bold text-center mb-4">
          🎬 Movies Section
        </Text>
        <Text className="color-gray-300 text-center text-base leading-6">
          Discover the latest and greatest movies! This section will feature
          curated movie collections.
        </Text>
        <View className="bg-orange-500/10 rounded-lg p-6 mt-6">
          <Text className="color-orange-400 text-center font-semibold">
            Under Development 🎯
          </Text>
        </View>
      </View>
    </View>
  );
};
const HomeScreenTvSerials = ({
  navigation: _navigation,
}: NativeStackScreenProps<InsideStackParamList, "HomeScreen">) => {
  return (
    <View className="flex-1 bg-black px-5 py-8">
      <View className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-xl p-8 border border-blue-500/20">
        <Text className="color-white text-2xl font-bold text-center mb-4">
          📺 TV Series Section
        </Text>
        <Text className="color-gray-300 text-center text-base leading-6">
          Binge-watch the best TV series! From drama to comedy, find your next
          favorite show here.
        </Text>
        <View className="bg-blue-500/10 rounded-lg p-6 mt-6">
          <Text className="color-blue-400 text-center font-semibold">
            Under Development 📺
          </Text>
        </View>
      </View>
    </View>
  );
};
export {
  HomeScreenAnimeScreen,
  HomeScreenMovieScreen,
  HomeScreenTvSerials,
  ComingSoon,
};
