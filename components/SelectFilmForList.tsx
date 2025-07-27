import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { SearchResult, useSearch } from "../utils/hooks/useSearch";

type SelectFilmForListProps = NativeStackScreenProps<
  InsideStackParamList,
  "SelectFilmForList"
>;

const SelectFilmForList = ({ navigation }: SelectFilmForListProps) => {
  const selectMovie = (item: string) => {
    navigation.navigate("ListContent", {
      movies: [],
      listid: null,
      movieId: item,
    });
  };
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaType] = useState("movie");

  const { data, error, isLoading, isError, refetch } = useSearch(
    mediaType,
    searchQuery
  );

  const handleSearch = (text: string) => {
    if (text.length > 0) {
      setSearchQuery(text);
      refetch();
    } else {
      setSearchQuery("");
      setShowResults(false);
    }
  };

  useEffect(() => {
    if (!isLoading && !isError && data) {
      setResults(data.results);
      setShowResults(true);
    } else {
      setResults(null);
      setShowResults(false);
      if (isError) {
        console.log(error);
      }
    }
  }, [data, isLoading, isError]);

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-12 pb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="bg-gray-900/50 rounded-full p-2"
        >
          <Text className="color-white text-lg">‹</Text>
        </TouchableOpacity>
        <Text className="color-white text-xl font-bold">Add Movie</Text>
        <View className="w-10" />
      </View>

      {/* Search Input */}
      <View className="px-6 mb-6">
        <View className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
          <TextInput
            className="text-white text-base"
            placeholder="Search for movies..."
            placeholderTextColor="#9CA3AF"
            onChangeText={handleSearch}
            value={searchQuery}
            autoFocus
          />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1 px-6">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <View className="bg-gray-900/50 rounded-xl p-6">
              <Text className="color-gray-300 text-center">Loading...</Text>
            </View>
          </View>
        ) : isError ? (
          <View className="flex-1 justify-center items-center">
            <View className="bg-red-900/20 rounded-xl p-6 border border-red-500/20">
              <Text className="color-red-400 text-center">
                Something went wrong
              </Text>
            </View>
          </View>
        ) : !showResults ? (
          <View className="flex-1 justify-center items-center">
            <View className="bg-gray-900/30 rounded-xl p-8">
              <Text className="color-gray-400 text-center text-base">
                Start typing to search for movies
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => selectMovie(item.id.toString())}
                className="bg-gray-900/40 rounded-xl p-4 mb-3 flex-row items-center"
                activeOpacity={0.7}
              >
                <Image
                  className="w-16 h-24 rounded-lg bg-gray-800"
                  source={{
                    uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
                  }}
                />
                <View className="flex-1 ml-4">
                  <Text
                    className="color-white text-base font-medium mb-1"
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  {item.release_date && (
                    <Text className="color-gray-400 text-sm">
                      {new Date(item.release_date).getFullYear()}
                    </Text>
                  )}
                  {item.vote_average && (
                    <View className="flex-row items-center mt-2">
                      <Text className="color-orange-400 text-xs">⭐</Text>
                      <Text className="color-gray-300 text-xs ml-1">
                        {item.vote_average.toFixed(1)}
                      </Text>
                    </View>
                  )}
                </View>
                <View className="bg-orange-500/20 rounded-lg p-2">
                  <Text className="color-orange-400 text-xs font-medium">
                    Add
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default SelectFilmForList;
