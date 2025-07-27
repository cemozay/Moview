import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "navigation/InsideNavigation";
import { SearchResult, useSearch } from "../utils/hooks/useSearch";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Icon from "@expo/vector-icons/FontAwesome";

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SearchScreen = () => {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [mediaType, setMediaType] = useState("multi"); // "movie" | "tv" | "person" | "multi"

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

  const renderMovieItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("MovieDetails", {
          movieId: item.id.toString(),
        })
      }
      className="mr-4 mb-4"
      activeOpacity={0.8}
    >
      <View className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800/50">
        <Image
          className="w-32 h-48"
          source={{
            uri: `https://image.tmdb.org/t/p/w300${item.poster_path}`,
          }}
          resizeMode="cover"
        />
        <View className="absolute top-2 right-2">
          <View className="bg-black/70 rounded-full px-2 py-1 flex-row items-center">
            <Icon name="star" size={10} color="#FFD700" />
            <Text className="color-white text-xs ml-1 font-medium">
              {item.vote_average ? item.vote_average.toFixed(1) : "N/A"}
            </Text>
          </View>
        </View>
      </View>
      <View className="mt-2 px-1">
        <Text className="color-white text-sm font-medium" numberOfLines={2}>
          {item.title}
        </Text>
        {item.release_date && (
          <Text className="color-gray-400 text-xs mt-1">
            {new Date(item.release_date).getFullYear()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderPersonItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("PersonScreen", {
          personId: item.id,
        })
      }
      className="mr-4 mb-4"
      activeOpacity={0.8}
    >
      <View className="bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800/50">
        <Image
          className="w-32 h-48"
          source={{
            uri: item.profile_path
              ? `https://image.tmdb.org/t/p/w300${item.profile_path}`
              : "https://via.placeholder.com/300x450/374151/9CA3AF?text=No+Image",
          }}
          resizeMode="cover"
        />
      </View>
      <View className="mt-2 px-1">
        <Text className="color-white text-sm font-medium" numberOfLines={2}>
          {item.name}
        </Text>
        {item.known_for_department && (
          <Text className="color-gray-400 text-xs mt-1">
            {item.known_for_department}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center px-8 py-20">
      <View className="bg-gray-900/30 rounded-xl p-8 items-center border border-gray-800/50">
        <FontAwesome6 name="magnifying-glass" size={48} color="#6B7280" />
        <Text className="color-gray-300 text-lg font-medium mt-4 mb-2 text-center">
          Search Movies & People
        </Text>
        <Text className="color-gray-500 text-center text-sm">
          Find your favorite movies, TV shows, and actors
        </Text>
      </View>
    </View>
  );

  const renderLoadingState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <View className="bg-gray-900/50 p-8 rounded-xl border border-gray-700/30">
        <ActivityIndicator size="large" color="#FF5C00" />
        <Text className="color-gray-300 text-lg mt-4 text-center font-medium">
          Searching...
        </Text>
      </View>
    </View>
  );

  const renderErrorState = () => (
    <View className="flex-1 justify-center items-center px-8 py-20">
      <View className="bg-red-900/20 rounded-xl p-8 items-center border border-red-500/20">
        <FontAwesome6 name="triangle-exclamation" size={48} color="#EF4444" />
        <Text className="color-red-400 text-lg font-medium mt-4 mb-2 text-center">
          Search Error
        </Text>
        <Text className="color-gray-400 text-center text-sm">
          Something went wrong. Please try again.
        </Text>
      </View>
    </View>
  );

  const movieResults =
    results?.filter((item) => item.media_type === "movie") || [];
  const personResults =
    results?.filter((item) => item.media_type === "person") || [];

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <Text className="color-white text-xl font-bold">Search</Text>
        <View className="w-10" />
      </View>

      {/* Search Input */}
      <View className="px-6 mb-6">
        <View className="bg-gray-900/50 rounded-xl border border-gray-800/50 flex-row items-center">
          <View className="pl-4 pr-2">
            <FontAwesome6 name="magnifying-glass" size={16} color="#9CA3AF" />
          </View>
          <TextInput
            className="flex-1 text-white py-4 pr-4 text-base"
            placeholder="Search movies, shows, people..."
            placeholderTextColor="#9CA3AF"
            onChangeText={handleSearch}
            value={searchQuery}
            autoFocus={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                setShowResults(false);
              }}
              className="pr-4"
              activeOpacity={0.8}
            >
              <FontAwesome6 name="xmark" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="px-6 mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            {[
              { key: "multi", label: "All" },
              { key: "movie", label: "Movies" },
              { key: "tv", label: "TV Shows" },
              { key: "person", label: "People" },
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => {
                  setMediaType(filter.key);
                  if (searchQuery.length > 0) {
                    refetch();
                  }
                }}
                activeOpacity={0.8}
                className={`px-4 py-2 rounded-lg border ${
                  mediaType === filter.key
                    ? "bg-orange-500 border-orange-500"
                    : "bg-gray-900/50 border-gray-800"
                }`}
              >
                <Text
                  className={`font-medium ${
                    mediaType === filter.key ? "text-white" : "text-gray-300"
                  }`}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          renderLoadingState()
        ) : isError ? (
          renderErrorState()
        ) : !showResults || !searchQuery ? (
          renderEmptyState()
        ) : (
          <View className="px-6">
            {/* Movies Section */}
            {movieResults.length > 0 && (
              <View className="mb-8">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="color-white text-xl font-bold">Movies</Text>
                  <Text className="color-gray-400 text-sm">
                    {movieResults.length} results
                  </Text>
                </View>
                <FlatList
                  data={movieResults}
                  keyExtractor={(item) => `movie-${item.id}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderMovieItem}
                  contentContainerStyle={{ paddingRight: 24 }}
                />
              </View>
            )}

            {/* People Section */}
            {personResults.length > 0 && (
              <View className="mb-8">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="color-white text-xl font-bold">People</Text>
                  <Text className="color-gray-400 text-sm">
                    {personResults.length} results
                  </Text>
                </View>
                <FlatList
                  data={personResults}
                  keyExtractor={(item) => `person-${item.id}`}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={renderPersonItem}
                  contentContainerStyle={{ paddingRight: 24 }}
                />
              </View>
            )}

            {/* No Results */}
            {showResults &&
              movieResults.length === 0 &&
              personResults.length === 0 && (
                <View className="flex-1 justify-center items-center py-20">
                  <View className="bg-gray-900/30 rounded-xl p-8 items-center border border-gray-800/50">
                    <FontAwesome6 name="face-frown" size={48} color="#6B7280" />
                    <Text className="color-gray-300 text-lg font-medium mt-4 mb-2 text-center">
                      No Results Found
                    </Text>
                    <Text className="color-gray-500 text-center text-sm">
                      Try searching with different keywords
                    </Text>
                  </View>
                </View>
              )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
