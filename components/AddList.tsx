import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  ImageBackground,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import LinearGradient from "react-native-linear-gradient";
import { FirebaseDB } from "../firebaseConfig";
import useUserStore from "../utils/hooks/useUserStore";
import {
  collection,
  getDoc,
  doc,
  addDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useMovieData } from "utils/hooks/useMovieData";

type AddListProps = NativeStackScreenProps<InsideStackParamList, "AddList"> & {
  route: {
    params: {
      movies: string[] | undefined;
      listId: string | null;
    };
  };
};

const AddList = ({ navigation, route }: AddListProps) => {
  const listid = route.params.listId || null;
  const numColumns = 3; // Setting the number of columns to 3

  const [listName, setListName] = useState("");
  const [description, setDescription] = useState("");
  const [localMovies, setLocalMovies] = useState<string[]>([]);
  const [listMovies, setListMovies] = useState<string[]>([]);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchListData = async () => {
      if (listid) {
        const listsRef = collection(FirebaseDB, "lists");
        const reviewDocRef = doc(listsRef, listid);
        const reviewDoc = await getDoc(reviewDocRef);

        if (reviewDoc.exists()) {
          const data = reviewDoc.data();
          setListName(data.name);
          setDescription(data.description);
          const movieIds = data.movies || [];

          setListMovies(movieIds);
        }
      }
    };

    fetchListData();
  }, [listid]);

  useEffect(() => {
    if (route.params.movies) {
      setLocalMovies(route.params.movies);
    } else if (listMovies.length > 0) {
      setLocalMovies(listMovies);
    } else {
      setLocalMovies([]);
    }
  }, [route.params.movies, listMovies]);

  console.log(localMovies);

  const handleAddList = async () => {
    if (listName.trim() && description.trim()) {
      try {
        const listsRef = collection(FirebaseDB, "lists");
        const listData = {
          timestamp: serverTimestamp(),
          name: listName,
          description: description,
          movies: localMovies.map((movie) => movie),
          userId: user!.uid,
        };

        if (listid) {
          const reviewDocRef = doc(listsRef, listid);
          await setDoc(reviewDocRef, listData);
        } else {
          await addDoc(listsRef, listData);
        }

        navigation.navigate("ListDetailsScreen", { listId: listid });
      } catch (error) {
        console.error("Error adding or updating document: ", error);
      }
    } else {
      console.error("List name and description cannot be empty!");
    }
  };

  const MovieItem = ({ movieId }: { movieId: string }) => {
    const { data: movie } = useMovieData(movieId);

    if (!movieId) {
      return null;
    }

    return (
      <View style={styles.moviePosterContainer}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w200${movie.poster_path}`,
          }}
          style={styles.moviePoster}
        />
        <Text className="color-white">{movie.title}a</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black">
      <ImageBackground
        style={styles.imageBackground}
        source={require("../screens/profile.jpg")}
      >
        <View className="justify-between flex-row z-10">
          <View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="justify-center items-center pt-4 pl-3"
            >
              <FontAwesome6 name="angle-left" size={26} color="white" />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={handleAddList}
              className="justify-center items-center pt-4 pr-3"
            >
              <FontAwesome6 name="check" size={26} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <LinearGradient
          className="justify-end"
          colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
          style={StyleSheet.absoluteFillObject}
        >
          <View className="mx-3 border-neutral-800 border-b">
            <TextInput
              style={{
                color: "white",
                textAlignVertical: "center",
                textAlign: "center",
                fontSize: 24,
              }}
              maxLength={32}
              selectTextOnFocus={true}
              multiline={false}
              numberOfLines={1}
              placeholder="Listenin ismi"
              placeholderTextColor="white"
              value={listName}
              onChangeText={setListName}
            />
          </View>
        </LinearGradient>
      </ImageBackground>

      <View className="m-3 border-neutral-800 border-b">
        <TextInput
          style={{
            color: "white",
            textAlignVertical: "center",
            fontSize: 18,
            textAlign: "center",
          }}
          multiline={true}
          placeholder="Açıklama"
          maxLength={100}
          placeholderTextColor="white"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View className="items-center m-3">
        <TouchableOpacity
          style={{
            padding: 16,
            backgroundColor: "#1E1E1E",
            borderRadius: 30,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#FF5C00" }}>Afişi Değiştir</Text>
        </TouchableOpacity>
      </View>
      <View className="items-center">
        <View className="color-red-800 m-2 border-neutral-800 border w-full"></View>
      </View>
      <View className="flex-1 bg-black">
        <TouchableOpacity
          className="flex-1"
          onPress={() =>
            navigation.navigate("ListContent", {
              movies: localMovies,
              movieId: null,
              listid: listid,
            })
          }
        >
          <Text className="color-white m-3 text-base">Add Films..</Text>
          <FlatList
            key={numColumns}
            scrollEnabled
            data={localMovies}
            keyExtractor={(item) => item}
            numColumns={numColumns}
            renderItem={({ item }) => <MovieItem movieId={item} />}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  imageBackground: {
    width: "100%",
    height: 300,
  },
  moviePosterContainer: {
    padding: 5,
    flex: 1 / 3,
  },
  moviePoster: {
    width: 125,
    height: 175,
  },
});

export default AddList;
