import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  ImageBackground,
  Image,
  ScrollView,
} from "react-native";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2UzY2MwNDE2ZjcwM2RmOTI1NmM1ZTgyYmEwZTVmYiIsInN1YiI6IjY1ODM2NTZhMDgzNTQ3NDRmMzNlODc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nv0234eCrGmSRXSURyFUGO7uIub5OAOeCA0t9kCPLr0",
  },
};

const MovieDetailScreen = ({ route, navigation }) => {
  const [response, setResponseData] = useState(null);
  const { movieid } = route.params;

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movieid}?language=en-US`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setResponseData(response);
      })
      .catch((err) => console.error(err));
  }, [movieid]);

  return (
    <ScrollView className="bg-black">
      {response && (
        <View>
          <View className="justify-center items-center	">
            <ImageBackground
              className="w-screen h-64"
              resizeMode="contain"
              source={{
                uri: `https://image.tmdb.org/t/p/original${response.backdrop_path}`,
              }}
            />
            <View className="absolute items-center">
              <Image
                className="w-48 h-72"
                source={{
                  uri: `https://image.tmdb.org/t/p/original${response.poster_path}`,
                }}
              />
              <View className=" justify-center">
                <Text className="color-white">{response.title}</Text>
              </View>
            </View>
            <View className="w-screen h-64 justify-center"></View>
          </View>

          <Button title="Geri Git" onPress={() => navigation.goBack()} />
        </View>
      )}
    </ScrollView>
  );
};

export default MovieDetailScreen;
