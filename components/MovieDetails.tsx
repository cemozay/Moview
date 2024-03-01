import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ProfileReviews from "../screens/Profile parts/ProfileReviews";
import MovieCreditsList from "./PersonList";

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

  const FirstRoute = () => <ProfileReviews />;

  const SecondRoute = () => (
    <View>
      {response && (
        <View className=" w-scren h-56 border-y border-white justify-center">
          <View>
            <Text className="color-white text-2xl">Başrol Ouncuları</Text>
          </View>
          <View>
            <Text className="color-white text-lg">{response.overview}</Text>
          </View>
        </View>
      )}
    </View>
  );
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Profile" },
    { key: "second", title: "List" },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

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
              <View className="pt-1 justify-center items-center">
                <Text className="color-white text-2xl">{response.title}</Text>
                <Text className="pt-1 color-white text-1xl">
                  {response.release_date}
                </Text>
                <View className="flex pt-1 flex-row flex-wrap">
                  {response.genres.map((genre) => (
                    <Text key={genre.id} className="color-white  mr-2">
                      {genre.name}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
            <View className="w-screen h-72  justify-end">
              <View className=" h-20 flex-row">
                <View className=" w-1/2 justify-center items-center">
                  <Text className="color-white">⭐⭐⭐⭐</Text>
                </View>
                <View className="w-1/2 justify-center items-center">
                  <Text className="color-white">190 Review</Text>
                </View>
              </View>
            </View>
          </View>
          <View className=" w-scren h-28 border-y border-white items-center flex-row justify-center">
            <TouchableOpacity className="mx-4 h-16 w-16 bg-white justify-center items-center rounded-full">
              <Icon name="heart" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="mx-4 h-16 w-16 bg-white justify-center items-center rounded-full">
              <Icon name="list" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="mx-4 h-16 w-16 bg-white justify-center items-center rounded-full">
              <Icon name="save" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity className="mx-4 h-16 w-16 bg-white justify-center items-center rounded-full">
              <Icon name="star" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <Button title="Geri Git" onPress={() => navigation.goBack()} />
      <MovieCreditsList movieid={movieid} />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "white" }}
            style={{ backgroundColor: "black" }}
            activeColor={"white"}
            inactiveColor={"white"}
            labelStyle={{ fontSize: 12 }}
          />
        )}
      />
    </ScrollView>
  );
};

export default MovieDetailScreen;
