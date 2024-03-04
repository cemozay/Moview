import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Icon from "@expo/vector-icons/FontAwesome";
export type aaa = {
  personId: string;
};
const PersonScreen = ({ route }: aaa) => {
  const navigation = useNavigation();
  const [personDetails, setPersonDetails] = useState(null);
  const [movieCredits, setMovieCredits] = useState([]);
  const window = useWindowDimensions();

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
  };
  const [expanded, setExpanded] = useState(false);

  const handleSeeMore = () => {
    setExpanded(!expanded);
  };

  const handleSeeLess = () => {
    setExpanded(false);
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
        <Text numberOfLines={0} className="color-white text-base">
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView className="bg-black">
      {personDetails ? (
        <View>
          <ImageBackground
            source={{
              uri: `https://image.tmdb.org/t/p/original${personDetails.profile_path}`,
            }}
            style={{
              height: window.height * 0.75,
              width: window.width,
              alignItems: "flex-start",
              justifyContent: "flex-end",
              overflow: "hidden",
            }}
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.95)"]} // Renk sırasını değiştirdik
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 0,
              }}
            />
            <View className="w-screen justify-between items-center  flex-row">
              <View className="">
                <Text className=" color-white text-3xl pl-4">
                  {personDetails.name}
                </Text>
                <Text className="color-white text-1xl  pl-5">
                  {personDetails.popularity} Takipçi
                </Text>
              </View>
              <View className="pr-4">
                <TouchableOpacity className=" h-16 w-16 bg-white justify-center items-center rounded-full">
                  <Icon name="star" size={30} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
          <View className="justify-between items-center flex-row">
            <View>
              <Text className="color-white text-2xl m-2">Filmography</Text>
            </View>
            <View>
              <TouchableOpacity>
                <Text className="text-blue-500 m-2">See More </Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={movieCredits}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMovieItem}
            horizontal
          />
          <View>
            <Text className="color-white text-2xl m-2">Biography</Text>
            <Text
              numberOfLines={expanded ? undefined : 4}
              className="color-white text-base m-2"
            >
              {personDetails.biography}
            </Text>
            <View className="items-center">
              {!expanded ? (
                <TouchableOpacity onPress={handleSeeMore}>
                  <Text className=" text-blue-500 text-xl">See more</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={handleSeeLess}>
                  <Text className="text-blue-500 text-xl">See less</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ) : (
        <Text className="color-white">Kişi bilgileri yükleniyor...</Text>
      )}

      <TouchableOpacity onPress={handleGoBack}>
        <View>
          <Text className="color-white">Geri Dön</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PersonScreen;
