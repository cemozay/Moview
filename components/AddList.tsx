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
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import LinearGradient from "react-native-linear-gradient";

type AddListProps = NativeStackScreenProps<InsideStackParamList, "AddList"> & {
  movies: Movies; // "movies" prop'u ekleniyor
};

type Movie = {
  id: string;
  title: string;
  poster: string;
};

type Movies = Movie[];

const AddList = ({ navigation, route }: AddListProps & Movies) => {
  const { movies } = route.params || [];

  return (
    <View className="flex-1 bg-black">
      <ImageBackground
        style={styles.imageBackground}
        source={require("../screens/profile.jpg")}
      >
        <View className=" justify-between flex-row z-10">
          <View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className=" justify-center items-center pt-4 pl-3 "
            >
              <FontAwesome6 name="angle-left" size={26} color="white" />
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity className=" justify-center items-center pt-4 pr-3 ">
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
            data={movies}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.movieItem}>
                <Text style={styles.movieTitle}>{item.title}</Text>
                <Image
                  source={{ uri: item.poster }}
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
  movieItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  movieTitle: {
    color: "white",
    fontSize: 18,
    marginRight: 10,
  },
  moviePoster: {
    width: 50,
    height: 70,
  },
});
export default AddList;
