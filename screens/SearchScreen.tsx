import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { SearchResult, useSearch } from "utils/hooks/useSearch";

type SearchScreenProp = NativeStackScreenProps<
  InsideStackParamList,
  "SearchScreen"
>;

const SearchScreen = ({ navigation }: SearchScreenProp) => {
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [mediaType, setMediaType] = useState("multi"); // default: multi = "movie" | "tv" | "person"

  const handleSearch = (text: string) => {
    if (text.length > 0) {
      setSearchQuery(text);
      const { data, error, isLoading, isError } = useSearch(mediaType, text);

      if (isLoading) {
        return console.error("Loading...");
      }
      if (isError) {
        console.error(error);
        return;
      }

      setResults(data.results);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  return (
    <ScrollView className="bg-black">
      <View className="bg-black">
        <Text className="color-white text-2xl">Moview'de Ara</Text>
        <TextInput
          className="text-white bg-stone-800 h-12 border-gray-500 rounded-full border mb-3 pl-2"
          placeholder="Aramak istediğiniz şey"
          placeholderTextColor="white"
          onChangeText={handleSearch}
          value={searchQuery}
        />

        {showResults && (
          <View>
            <Text className="color-white m-1 text-2xl">Film Sonuçları</Text>
            <FlatList
              data={results?.filter((item) => item.media_type == "movie")}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("MovieDetails", {
                      movieId: item.id.toString(),
                    })
                  }
                  className="m-2"
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

            <Text className="color-white m-1 text-2xl">Kişi Sonuçları</Text>
            <FlatList
              data={results?.filter((item) => item.media_type == "person")}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("PersonScreen", {
                      personId: item.id,
                    })
                  }
                  className="m-2"
                >
                  <Image
                    className="w-28 h-40 bg-red-500 m-1"
                    source={{
                      uri: `https://image.tmdb.org/t/p/w200${item.profile_path}`,
                    }}
                  />
                  <Text className="color-white m-1">{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default SearchScreen;
