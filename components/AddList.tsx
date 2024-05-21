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
import React, { useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import LinearGradient from "react-native-linear-gradient";
import useUserStore from "utils/hooks/useUserStore";
import { FirebaseDB } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type AddListProps = NativeStackScreenProps<InsideStackParamList, "AddList"> & {
  movies: Movies;
};

type Movie = {
  id: string;
  title: string;
  poster: string;
};

type Movies = Movie[];

const AddList = ({ navigation, route }: AddListProps) => {
  const { movies } = route.params || [];
  const numColumns = 3; // Setting the number of columns to 3

  const user = useUserStore((state) => state.user);

  const [listName, setListName] = useState("");
  const [description, setDescription] = useState("");

  const listsRef = collection(FirebaseDB, "lists");

  const handleAddList = async () => {
    if (listName.trim() && description.trim()) {
      try {
        let listData = {
          timestamp: serverTimestamp(), // Adding the timestamp
          name: listName,
          description: description,
          movies: movies.map((movie) => movie.id),
          userId: user!.uid,
        };
        await addDoc(listsRef, listData);
        navigation.goBack();
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
    }
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
          onPress={() => navigation.navigate("ListContent", { movies: movies })}
        >
          <Text className="color-white m-3 text-base">Add Films..</Text>
          <FlatList
            key={numColumns} // Add key prop based on numColumns
            data={movies}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            renderItem={({ item }) => (
              <View style={styles.moviePosterContainer}>
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/w200${item.poster}`,
                  }}
                  style={styles.moviePoster}
                />
              </View>
            )}
          />
        </TouchableOpacity>
      </View>
      <View className="items-center">
        <View className="color-red-800 m-2 border-neutral-800 border w-full"></View>
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
    flex: 1 / 3, // Ensure the items take up 1/3rd of the row
  },
  moviePoster: {
    width: 125,
    height: 175,
  },
});

export default AddList;
