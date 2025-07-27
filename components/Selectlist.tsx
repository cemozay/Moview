import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "navigation/InsideNavigation";
import { SearchResult, useSearch } from "../utils/hooks/useSearch";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

type SelectListProp = NativeStackScreenProps<RootStackParamList, "Selectlist">;

const Selectlist = ({ navigation }: SelectListProp) => {
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mediaType = "multi"; // default: multi = "movie" | "tv" | "person"

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
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-gray-900/50 rounded-full p-2 mr-3"
          >
            <FontAwesome6 name="angle-left" size={24} color="white" />
          </TouchableOpacity>
          <Text className="color-white text-3xl font-bold">Search</Text>
        </View>
      </View>

      {/* Search Input */}
      <View className="px-6 pb-6">
        <View className="bg-gray-900/50 rounded-xl border border-gray-800">
          <TextInput
            className="text-white px-4 py-4 text-base"
            placeholder="Search movies, TV shows, people..."
            placeholderTextColor="#9CA3AF"
            onChangeText={handleSearch}
            value={searchQuery}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <View className="bg-gray-900/50 p-8 rounded-xl border border-gray-700/30">
              <Text className="color-gray-300 text-lg text-center font-medium">
                Searching...
              </Text>
            </View>
          </View>
        ) : isError ? (
          <View className="flex-1 justify-center items-center">
            <View className="bg-red-500/10 p-8 rounded-xl border border-red-500/20">
              <Text className="color-red-400 text-lg text-center font-medium">
                Something went wrong
              </Text>
            </View>
          </View>
        ) : showResults ? (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AddReview", {
                    movieId: item.id.toString(),
                    reviewId: null,
                  })
                }
                className="bg-gray-900/40 rounded-xl p-4 mb-3 border border-gray-800/50"
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <Image
                    className="w-16 h-24 rounded-lg bg-gray-700"
                    source={{
                      uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
                    }}
                    resizeMode="cover"
                  />
                  <View className="flex-1 ml-4">
                    <Text
                      className="color-white text-lg font-semibold mb-2"
                      numberOfLines={2}
                    >
                      {item.title || item.name}
                    </Text>
                    {item.release_date && (
                      <Text className="color-gray-400 text-sm mb-1">
                        {new Date(item.release_date).getFullYear()}
                      </Text>
                    )}
                    {item.overview && (
                      <Text
                        className="color-gray-500 text-sm"
                        numberOfLines={2}
                      >
                        {item.overview}
                      </Text>
                    )}
                  </View>
                  <View className="ml-2">
                    <View className="bg-orange-500/20 rounded-lg p-2">
                      <Text className="color-orange-400 text-xs font-medium">
                        ADD
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : searchQuery.length > 0 ? (
          <View className="flex-1 justify-center items-center px-6">
            <View className="bg-gray-900/50 p-8 rounded-xl border border-gray-700/30">
              <Text className="color-gray-300 text-lg text-center font-medium mb-2">
                No results found
              </Text>
              <Text className="color-gray-500 text-sm text-center">
                Try searching with different keywords
              </Text>
            </View>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center px-6">
            <View className="bg-gray-900/50 p-8 rounded-xl border border-gray-700/30">
              <Text className="color-gray-300 text-lg text-center font-medium mb-2">
                Start searching
              </Text>
              <Text className="color-gray-500 text-sm text-center">
                Enter a movie, TV show, or person name to get started
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

export default Selectlist;
