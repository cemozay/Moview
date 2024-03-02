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
import CustomButton from "../components/CustomButton";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movieResults, setMovieResults] = useState([]);
  const [personResults, setPersonResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const navigation = useNavigation();
  const navigateToPersonScreen = (personId) => {
    navigation.navigate("PersonScreen", { personId });
  };

  const apiKey = "23e3cc0416f703df9256c5e82ba0e5fb";

  const search = async (mediaType) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/${mediaType}?api_key=${apiKey}&query=${searchQuery}`
      );

      if (!response.ok) {
        throw new Error("Arama sırasında bir hata oluştu.");
      }

      const data = await response.json();

      if (mediaType === "movie") {
        setMovieResults(data.results);
      } else if (mediaType === "person") {
        setPersonResults(data.results);
      }

      setShowResults(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView className="bg-black">
      <View className="bg-black">
        <Text className="color-white text-2xl">Moview'de Ara</Text>
        <TextInput
          className="text-white bg-stone-800 h-12 border-gray-500 rounded-full border mb-3 pl-2"
          onChangeText={(text) => {
            setSearchQuery(text);
            setShowResults(false);
          }}
          placeholder="Aramak istediğiniz şey"
          placeholderTextColor="white"
          value={searchQuery}
        />

        <CustomButton
          title="Ara"
          onPress={() => {
            search("movie");
            search("person");
          }}
        />

        {showResults && (
          <View>
            <Text className="color-white m-1 text-2xl">Film Sonuçları</Text>
            <FlatList
              data={movieResults}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("MovieDetails", { movieid: item.id })
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
              keyExtractor={(item) => item.id.toString()}
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
