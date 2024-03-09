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
import { useNavigation } from "@react-navigation/native";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movieResults, setMovieResults] = useState([]);
  const [personResults, setPersonResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigation = useNavigation();

  const navigateToPersonScreen = (personId: string) => {
    navigation.navigate("PersonScreen", { personId: personId });
  };

  const apiKey = "23e3cc0416f703df9256c5e82ba0e5fb";

  const search = async (movieId: string) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/${movieId}?api_key=${apiKey}&query=${searchQuery}`
      );

      if (!response.ok) {
        throw new Error("Arama sırasında bir hata oluştu.");
      }

      const data = await response.json();

      if (movieId === "movie") {
        setMovieResults(data.results);
      } else if (movieId === "person") {
        setPersonResults(data.results);
      }

      setShowResults(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    // Her harf girişinde arama yap
    if (text.length > 0) {
      search("movie");
      search("person");
    } else {
      setShowResults(false);
    }
  };
  type itemProp = {
    id: string;
    poster_path: string;
    title: string;
    name: string;
    profile_path: string;
  };

  return (
    <ScrollView className="bg-black">
      <View className="bg-black">
        <Text className="color-white text-2xl">Moview'de Ara</Text>
        <TextInput
          className="text-white bg-stone-800 h-12 border-gray-500 rounded-full border mb-3 pl-2"
          onChangeText={handleSearchChange}
          placeholder="Aramak istediğiniz şey"
          placeholderTextColor="white"
          value={searchQuery}
        />

        {showResults && (
          <View>
            <Text className="color-white m-1 text-2xl">Film Sonuçları</Text>
            <FlatList
              data={movieResults}
              keyExtractor={(item: itemProp) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("MovieDetails", { movieId: item.id })
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
              data={personResults}
              keyExtractor={(item: itemProp) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigateToPersonScreen(item.id)}
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
