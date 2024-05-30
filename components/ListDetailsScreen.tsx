import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { FirebaseDB } from "firebaseConfig";
import { getDoc, doc, deleteDoc } from "firebase/firestore";
import { useMovieData } from "utils/hooks/useMovieData";
import LinearGradient from "react-native-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useUserStore from "../utils/hooks/useUserStore";

type ListDetailsScreenNavigate = NativeStackScreenProps<
  InsideStackParamList,
  "ListDetailsScreen"
>;

type ListDetailsScreenProp = {
  navigation: ListDetailsScreenNavigate["navigation"];
  route: ListDetailsScreenNavigate["route"];
};

type ListProps = {
  id: string;
  name: string;
  movies: Array<string>;
  timestamp: any;
  userId: string;
  description: string;
};

const ListDetailsScreen = ({ navigation, route }: ListDetailsScreenProp) => {
  const user = useUserStore((state) => state.user);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const numColumns = 3;

  const { listId } = route.params;
  const [listData, setListData] = useState<ListProps | null>(null);

  const { movies, userId } = listData || {};

  const listDocRef = doc(FirebaseDB, "lists", listId);

  useEffect(() => {
    const fetchListData = async () => {
      try {
        const listDocSnap = await getDoc(listDocRef);

        if (listDocSnap.exists()) {
          const data = listDocSnap.data() as ListProps;
          setListData(data);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document: ", error);
      }
    };

    fetchListData();
  }, [listId]);

  if (!listData) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  const MovieItem = ({ movieId }: any) => {
    const { data: movieData } = useMovieData(movieId);

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("MovieDetails", {
            movieId: movieData.id.toString(),
          })
        }
        style={styles.moviePosterContainer}
      >
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w200${movieData.poster_path}`,
          }}
          style={styles.moviePoster}
        />
      </TouchableOpacity>
    );
  };

  const handleDeleteList = async () => {
    try {
      await deleteDoc(doc(listDocRef, listId));
      console.log("Review deleted successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <GestureHandlerRootView>
      <ScrollView className="bg-black">
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
              <TouchableOpacity
                onPress={openBottomSheet}
                className=" justify-center items-center pt-4 pr-3 "
              >
                <Entypo name="dots-three-vertical" size={26} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <LinearGradient
            className="justify-end"
            colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
            style={StyleSheet.absoluteFillObject}
          >
            <View className=" flex-row  items-center justify-between ">
              <View className="flex-row items-center m-3 pt-10">
                <Image
                  className="w-12 h-12 rounded-full"
                  source={require("../screens/avatar.jpg")}
                />
                <View>
                  <Text className="text-base color-white ml-1">
                    Alperen Ağırman
                  </Text>
                  <View className="flex-row items-center ml-1">
                    <Text className="text-base color-white"></Text>
                    <Text className="text-base color-gray-500"></Text>
                  </View>
                </View>
              </View>
              <View></View>
            </View>
          </LinearGradient>
        </ImageBackground>
        <View className="flex-1 bg-black">
          <View className="items-center">
            <View className="color-red-800 border-neutral-800 border w-11/12"></View>
          </View>
          <FlatList
            data={movies}
            keyExtractor={(item) => item.toString()}
            numColumns={numColumns}
            renderItem={({ item }) => <MovieItem movieId={item} />}
          />

          <View className="items-center">
            <View className="color-red-800 border-neutral-800 border w-11/12"></View>
          </View>
        </View>

        <View>
          <View className="flex-row justify-between items-center">
            <Text className="m-3 color-white text-2xl">Comment</Text>
            <TouchableOpacity>
              <Text className="m-3 color-orange-500 text-base">See all</Text>
            </TouchableOpacity>
          </View>
          <View></View>
        </View>
        <View className="items-center">
          <View className="color-red-800 border-neutral-800 border w-11/12"></View>
        </View>
      </ScrollView>

      <BottomSheet
        enablePanDownToClose
        ref={bottomSheetRef}
        index={-1}
        snapPoints={[300, 400]}
        backgroundStyle={{ backgroundColor: "black" }}
        handleIndicatorStyle={{ backgroundColor: "white" }}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetText}>Options</Text>
          {user && user.uid === userId && (
            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("AddList", {
                    listId: route.params.listId,
                    movies: undefined,
                  })
                }
              >
                <Text style={styles.textStyle}>Edit List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleDeleteList}
              >
                <Text style={styles.textStyle}>Delete List</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  imageBackground: { width: "100%", height: 300 },
  bottomSheetContent: {
    padding: 20,
    flex: 1,
    backgroundColor: "black", // Arka plan rengini siyah yap
  },
  bottomSheetText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#333", // Buton arka plan rengini değiştir
    marginBottom: 10,
  },
  buttonClose: {
    backgroundColor: "#555", // Kapat butonunun arka plan rengini değiştir
  },
  textStyle: {
    color: "white", // Buton metin rengini beyaz yap
    textAlign: "center",
  },
  whiteText: {
    color: "white", // Metin rengini beyaz yap
  },
  bottomSheet: { backgroundColor: "black" },
  container: {
    flex: 1,
    backgroundColor: "black",
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

export default ListDetailsScreen;
