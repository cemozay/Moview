import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { SearchResult, useSearch } from "utils/hooks/useSearch";

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
    <ScrollView className="bg-black">
      <View className="bg-black">
        <Text className="color-white text-2xl">Moview'de Ara</Text>
        <TextInput
          className="text-white bg-stone-800 h-12 border-gray-500 rounded-full border mb-3 pl-2"
          placeholder="Search"
          placeholderTextColor="white"
          onChangeText={handleSearch}
          value={searchQuery}
        />

        {isLoading ? (
          <Text className="color-white">Loading...</Text>
        ) : isError ? (
          <Text className="color-white">Error</Text>
        ) : (
          showResults && (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => selectMovie(item.id.toString())} // Use item.id here
                  className="flex-row items-center m-2"
                >
                  <Image
                    className="w-28 h-40 bg-red-500 m-1"
                    source={{
                      uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
                    }}
                  />
                  <Text className="color-white m-1">{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          )
        )}
      </View>
    </ScrollView>
  );
};

export default SelectFilmForList;
