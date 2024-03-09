import { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { getDoc, doc } from "firebase/firestore";
import { FirebaseDB } from "../../firebaseConfig";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import useUserStore from "utils/userStore";

export type LikedMoviesProp = NativeStackScreenProps<
  InsideStackParamList,
  "LikedMovies"
>;

const LikedMovies = ({ navigation }: LikedMoviesProp) => {
  const user = useUserStore((state) => state.user);
  const docRef = doc(FirebaseDB, "likedmovie", user!.uid);
  const [movieDataList, setMovieDataList] = useState([]);

  // Useeffectler düzeltilecek
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const fieldNames = Object.keys(docSnap.data());
          const movieDataPromises = fieldNames.map(async (fieldName) => {
            const options = {
              method: "GET",
              headers: {
                accept: "application/json",
                Authorization:
                  "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2UzY2MwNDE2ZjcwM2RmOTI1NmM1ZTgyYmEwZTVmYiIsInN1YiI6IjY1ODM2NTZhMDgzNTQ3NDRmMzNlODc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nv0234eCrGmSRXSURyFUGO7uIub5OAOeCA0t9kCPLr0",
              },
            };

            try {
              const movieResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${fieldName}?language=en-US`,
                options
              );

              const movieData = await movieResponse.json();
              return movieData;
            } catch (error) {
              console.error("Error fetching movie data:", error);
              return null;
            }
          });

          const resolvedMovieDataList = await Promise.all(movieDataPromises);
          setMovieDataList(resolvedMovieDataList.filter(Boolean) as never[]); // ??
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  // Useeffectler düzeltilecek

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
