import React, { useState, useEffect } from "react";
import { View, FlatList, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const MovieCreditsList = ({ movieid }) => {
  const navigation = useNavigation();
  const [credits, setCredits] = useState([]);

  useEffect(() => {
    const fetchCredits = async () => {
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
          `https://api.themoviedb.org/3/movie/${movieid}/credits?language=en-US`,
          options
        );
        const data = await response.json();
        setCredits(data.cast);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCredits();
  }, [movieid]);

  const navigateToPersonScreen = (personId) => {
    navigation.navigate("PersonScreen", { personId });
  };

  const renderCreditItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToPersonScreen(item.id)}>
      <View style={{ margin: 10 }}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/original${item.profile_path}`,
          }}
          style={{ width: 100, height: 150, borderRadius: 8 }}
        />
        <Text style={{ color: "white", marginTop: 8 }}>{item.name}</Text>
        <Text style={{ color: "gray" }}>{item.character}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View>
      <Text className="color-white text-2xl">Top Billed Cast</Text>

      <FlatList
        data={credits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCreditItem}
        horizontal
      />
    </View>
  );
};

export default MovieCreditsList;
