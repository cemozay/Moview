import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { getDoc, doc } from "firebase/firestore";
import { FirebaseDB } from "../../firebaseConfig";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import useUserStore from "utils/hooks/useUserStore";
import { useMovieData } from "utils/hooks/useMovieData";

export type LikedMoviesProp = NativeStackScreenProps<
  InsideStackParamList,
  "LikedMovies"
>;

const LikedMovies = ({ navigation }: LikedMoviesProp) => {
  const user = useUserStore((state) => state.user);
  const docRef = doc(FirebaseDB, "likedmovie", user!.uid);
  const [movieDataList, setMovieDataList] = useState([]);

  useEffect(() => {
    async () => {
      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fieldNames = Object.keys(docSnap.data());
          const movieDataList = fieldNames.map((movieId) => {
            const apiResponse = useMovieData(movieId);
            const movieData = apiResponse.data;
            return movieData;
          });
          setMovieDataList(movieDataList.filter(Boolean) as never[]); // as never olayı nedir?
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  }, []);

  type itemProp = { id: string; poster_path: string; title: string };
  const renderItem = (
    { item }: { item: itemProp } // burası düzeltilecek
  ) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("MovieDetails", { movieId: item.id });
      }}
    >
      <Image
        style={{ width: 150, height: 200 }}
        source={{
          uri: `https://image.tmdb.org/t/p/original${item.poster_path}`,
        }}
      />
      <Text className="text-white">{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="bg-black w-screen h-12">
      <Text className="text-white">{user!.uid}</Text>
      <FlatList
        data={movieDataList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default LikedMovies;
