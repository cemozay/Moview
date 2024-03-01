import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const PersonScreen = ({ route }) => {
  const navigation = useNavigation();
  const [personDetails, setPersonDetails] = useState(null);
  const [movieCredits, setMovieCredits] = useState([]);

  useEffect(() => {
    const { personId } = route.params;

    const fetchPersonDetails = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2UzY2MwNDE2ZjcwM2RmOTI1NmM1ZTgyYmEwZTVmYiIsInN1YiI6IjY1ODM2NTZhMDgzNTQ3NDRmMzNlODc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nv0234eCrGmSRXSURyFUGO7uIub5OAOeCA0t9kCPLr0",
        },
      };

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${personId}?language=en-US`,
          options
        );
        const data = await response.json();
        setPersonDetails(data);

        const movieCreditsResponse = await fetch(
          `https://api.themoviedb.org/3/person/${personId}/movie_credits?language=en-US`,
          options
        );
        const movieCreditsData = await movieCreditsResponse.json();
        setMovieCredits(movieCreditsData.cast);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPersonDetails();
  }, [route.params]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleMoviePress = (movieid) => {
    navigation.navigate("MovieDetails", { movieid });
    console.log(movieid);
  };

  const renderMovieItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMoviePress(item.id)}>
      <View className="mx-5 my-2">
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original${item.poster_path}`,
          }}
          className="h-40 w-28 rounded-lg"
        />
        <Text numberOfLines={1} className="color-white text-base">
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView className="bg-black">
      <TouchableOpacity onPress={handleGoBack}>
        <View>
          <Text className="color-white">Geri Dön</Text>
        </View>
      </TouchableOpacity>

      {personDetails ? (
        <View className="justify-center items-center">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/original${personDetails.profile_path}`,
            }}
            className="h-60 w-40 rounded-lg "
          />
          <Text className="color-white text-2xl">{personDetails.name}</Text>
          <Text className="color-white text-base">
            {personDetails.biography}
          </Text>
        </View>
      ) : (
        <Text className="color-white">Kişi bilgileri yükleniyor...</Text>
      )}

      <Text className="color-white text-2xl m-2">Film Kredileri</Text>
      <FlatList
        data={movieCredits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovieItem}
        horizontal
      />
    </ScrollView>
  );
};

export default PersonScreen;
