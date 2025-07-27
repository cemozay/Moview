import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  SafeAreaView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import DraggableFlatList, {
  RenderItemParams,
} from "../utils/DraggableFlatListPlaceholder";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useMovieData } from "../utils/hooks/useMovieData";

type ListContentProps = NativeStackScreenProps<
  InsideStackParamList,
  "ListContent"
>;

const styles = StyleSheet.create({
  poster: {
    width: 60,
    height: 90,
    borderRadius: 8,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  addButton: {
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});

// Separate component for movie item to properly use hooks
const MovieItem = ({ item, drag, isActive }: RenderItemParams<string>) => {
  const { data: movieData } = useMovieData(item);

  if (!movieData) return null;

  return (
    <TouchableOpacity
      className={`flex-row items-center p-4 mx-4 mb-3 rounded-xl ${
        isActive ? "bg-gray-800" : "bg-gray-900/50"
      }`}
      onLongPress={drag}
      activeOpacity={0.8}
    >
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w300${movieData.poster_path}`,
        }}
        style={styles.poster}
        className="rounded-lg"
      />

      <View className="flex-1 ml-4">
        <Text
          className="color-white text-lg font-semibold mb-1"
          numberOfLines={2}
        >
          {movieData.title}
        </Text>
        <Text className="color-gray-400 text-sm">
          {movieData.release_date
            ? new Date(movieData.release_date).getFullYear()
            : "N/A"}
        </Text>
        <View className="flex-row items-center mt-2">
          <FontAwesome6 name="star" size={12} color="#FFD700" />
          <Text className="color-gray-300 text-xs ml-1">
            {movieData.vote_average ? movieData.vote_average.toFixed(1) : "N/A"}
          </Text>
        </View>
      </View>

      {/* Drag indicator */}
      <View className="ml-2">
        <FontAwesome6 name="grip-vertical" size={16} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );
};

const ListContent = ({ navigation, route }: ListContentProps) => {
  const lastList = route.params.movies || [];
  const [movies, setMovies] = useState<string[]>([]);
  const movieId = route.params.movieId;
  const listid = route.params.listid;

  useEffect(() => {
    setMovies((prevMovies) => [...prevMovies, ...lastList]);
  }, []);

  useEffect(() => {
    if (movieId !== null && !movies.includes(movieId)) {
      setMovies((prevMovies) => [...prevMovies, movieId]);
    }
  }, [movieId]);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <GestureHandlerRootView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 pt-4 pb-4">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-gray-900/50 rounded-full p-2 mr-3"
            >
              <FontAwesome6 name="angle-left" size={24} color="white" />
            </TouchableOpacity>
            <Text className="color-white text-xl font-bold">
              Organize Movies
            </Text>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddList", { movies: movies, listId: listid })
            }
            className="bg-orange-500 rounded-full p-2"
          >
            <FontAwesome6 name="check" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View className="px-4 mb-4">
          <View className="bg-gray-900/30 rounded-xl p-4">
            <Text className="color-gray-300 text-sm text-center">
              Long press and drag to reorder movies
            </Text>
          </View>
        </View>

        {/* Movies List */}
        <View className="flex-1">
          {movies.length > 0 ? (
            <DraggableFlatList
              data={movies}
              renderItem={MovieItem}
              keyExtractor={(item: string) => item}
              onDragEnd={({ data }: { data: string[] }) => {
                setMovies(data);
              }}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          ) : (
            <View className="flex-1 justify-center items-center px-8">
              <FontAwesome6 name="film" size={48} color="#6B7280" />
              <Text className="color-gray-400 text-lg font-medium mt-4 mb-2 text-center">
                No movies added yet
              </Text>
              <Text className="color-gray-500 text-center text-sm">
                Add movies to your list to organize them
              </Text>
            </View>
          )}
        </View>

        {/* Floating Add Button */}
        <View style={styles.floatingButton}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SelectFilmForList", { listId: listid })
            }
            className="bg-orange-500 rounded-full p-4 shadow-lg"
            style={styles.addButton}
          >
            <FontAwesome6 name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default ListContent;
