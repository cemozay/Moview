import React, { useState, useEffect } from "react";
import { Text, StyleSheet, TouchableOpacity, View, Image } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/FontAwesome";
import { useMovieData } from "utils/hooks/useMovieData";

type ListContentProps = NativeStackScreenProps<
  InsideStackParamList,
  "ListContent"
>;

const ListContent = ({ navigation, route }: ListContentProps) => {
  const lastList = route.params.movies || [];
  const [movies, setMovies] = useState<string[]>([]);
  const movieId = route.params.movieId;
  const listid = route.params.listid;

  useEffect(() => {
    setMovies((prevMovies) => [...prevMovies, ...lastList]);
  }, []);

  useEffect(() => {
    if (movieId !== null && !movies.includes(movieId)) {
      setMovies((prevMovies) => [...prevMovies, movieId]);
    }
  }, [movieId]);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<string>) => {
    const { data: movieData } = useMovieData(item);

    if (!movieData) return null;

    return (
      <TouchableOpacity
        style={[
          styles.item,
          {
            borderColor: "white",
            borderWidth: 2,
            backgroundColor: isActive ? "#131313" : "#0000",
          },
        ]}
        onLongPress={drag}
      >
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w200${movieData.poster_path}`,
          }}
          style={styles.poster}
        />
        <Text style={{ color: "white" }}>{movieData.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.headerButton}
            >
              <FontAwesome6 name="angle-left" size={26} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Film...</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddList", { movies: movies, listId: listid })
            }
            style={styles.headerButton}
          >
            <FontAwesome6 name="check" size={26} color="white" />
          </TouchableOpacity>
        </View>
        <DraggableFlatList
          data={movies}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          onDragEnd={({ data }) => {
            setMovies(data);
          }}
        />
        <View style={styles.heartIconContainer}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SelectFilmForList", { listId: listid })
            }
            style={styles.heartIcon}
          >
            <Icon name="heart" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
    paddingLeft: 12,
    paddingRight: 12,
  },
  headerTitle: {
    color: "white",
    paddingTop: 16,
    paddingLeft: 12,
    fontSize: 24,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  poster: {
    width: 80,
    height: 120,
    marginRight: 16,
  },
  heartIconContainer: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  heartIcon: {
    width: 60,
    height: 60,
    backgroundColor: "black",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ListContent;
