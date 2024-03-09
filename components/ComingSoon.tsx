import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from "react-native";
import {
  upcomingMovies,
  nowPlayingMovies,
  popularMovies,
  baseImagePath,
} from "../utils/apicalls";
import CategoryHeader from "./CategoryHeader";
import SubMovieCard from "./SubMovieCard";
import MovieCard from "./MovieCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";

const { width } = Dimensions.get("window");

// Aşağıdaki fonksiyonların alıp verdiği değerlerin tipi belirtilmeli
const getNowPlayingMoviesList = async () => {
  try {
    let response = await fetch(nowPlayingMovies);
    let json = await response.json();
    return json;
  } catch (error) {
    console.error("444", error);
  }
};

const getUpcomingMoviesList = async () => {
  try {
    let response = await fetch(upcomingMovies);
    let json = await response.json();
    return json;
  } catch (error) {
    console.error("444", error);
  }
};

const getPopularMoviesList = async () => {
  try {
    let response = await fetch(popularMovies);
    let json = await response.json();
    return json;
  } catch (error) {
    console.error(" 444", error);
  }
};

// Buraya kadar

const ComingSoon = ({
  navigation,
}: NativeStackScreenProps<InsideStackParamList, "HomeStack">) => {
  const [popularMoviesList, setPopularMoviesList] = useState<any>(undefined); // any yerine bir tip belirtilmeli
  const [upcomingMoviesList, setUpcomingMoviesList] = useState<any>(undefined); // any yerine bir tip belirtilmeli
  // const [personList, setPersonList] = useState<any>(undefined); // any yerine bir tip belirtilmeli
  const [nowPlayingMoviesList, setNowPlayingMoviesList] =
    useState<any>(undefined); // any yerine bir tip belirtilmeli

  // Aşağıdaki kod bloğu yeni fonksiyon yazılarak düzenlenmeli
  useEffect(() => {
    (async () => {
      let tempNowPlaying = await getNowPlayingMoviesList();
      setNowPlayingMoviesList([
        { id: "kukla1" },
        ...tempNowPlaying.results,
        { id: "kukla2" },
      ]);

      let tempPopular = await getPopularMoviesList();
      setPopularMoviesList(tempPopular.results);

      let tempUpcoming = await getUpcomingMoviesList();
      setUpcomingMoviesList(tempUpcoming.results);
    })();
  }, []);

  // Bu if bloğu doğru mu?
  if (!nowPlayingMoviesList && !popularMoviesList && !upcomingMoviesList) {
    return (
      <ScrollView
        className="flex bg-black"
        bounces={false}
        contentContainerStyle={{ flex: 1 }}
      >
        <StatusBar hidden />
        <View className="flex-1 justify-center self-center	">
          <ActivityIndicator size={"large"} color={"white"} />
        </View>
      </ScrollView>
    );
  }
  // Bu if bloğu doğru mu?

  return (
    <ScrollView className="flex bg-black" bounces={false}>
      <StatusBar hidden />
      <FlatList
        data={nowPlayingMoviesList}
        keyExtractor={(item) => item.id}
        bounces={false}
        snapToInterval={width * 0.7 + 36}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate={0}
        contentContainerStyle={{ gap: 36 }}
        renderItem={({ item, index }) => {
          if (!item.original_title) {
            return (
              <View
                style={{
                  width: (width - (width * 0.7 + 34 * 2)) / 2,
                }}
              ></View>
            );
          }
          return (
            <MovieCard
              shoudlMarginatedAtEnd={true}
              cardFunction={() => {
                navigation.navigate("MovieDetails", { movieId: item.id });
              }}
              cardWidth={width * 0.7}
              isFirst={index == 0 ? true : false}
              isLast={index == upcomingMoviesList?.length - 1 ? true : false}
              title={item.original_title}
              imagePath={baseImagePath("w780", item.poster_path)}
              genre={item.genre_ids.slice(1, 4)}
            />
          );
        }}
      />
      <CategoryHeader title={"Popüler"} />
      <FlatList
        data={popularMoviesList}
        keyExtractor={(item: any) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{ gap: 36 }}
        renderItem={({ item, index }) => (
          <SubMovieCard
            shoudlMarginatedAtEnd={true}
            cardFunction={() => {
              navigation.navigate("MovieDetails", { movieId: item.id });
            }}
            cardWidth={width / 3}
            isFirst={index == 0 ? true : false}
            isLast={index == upcomingMoviesList?.length - 1 ? true : false}
            title={item.original_title}
            imagePath={baseImagePath("w342", item.poster_path)}
          />
        )}
      />
      <CategoryHeader title={"Upcoming"} />
      <FlatList
        data={upcomingMoviesList}
        keyExtractor={(item) => item.id}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 36 }}
        renderItem={({ item, index }) => (
          <SubMovieCard
            shoudlMarginatedAtEnd={true}
            cardFunction={() => {
              navigation.navigate("MovieDetails", { movieId: item.id });
            }}
            cardWidth={width / 3}
            isFirst={index == 0 ? true : false}
            isLast={index == upcomingMoviesList?.length - 1 ? true : false}
            title={item.original_title}
            imagePath={baseImagePath("w342", item.poster_path)}
            release_date={item.release_date}
            genre={item.genre_ids.slice(1, 4)}
          />
        )}
      />
    </ScrollView>
  );
};

export default ComingSoon;
