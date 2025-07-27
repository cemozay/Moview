import { Text, TouchableOpacity, ScrollView, View, Image } from "react-native";
import React, { useState, useEffect, memo, useCallback } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { FirebaseDB } from "../firebaseConfig";
import useUserStore from "../utils/hooks/useUserStore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useMovieData } from "../utils/hooks/useMovieData";
import { formatTimestamp } from "../utils/functions";

type MovieDetailAddlistProp = NativeStackScreenProps<
  InsideStackParamList,
  "MovieDetailAddlist"
>;

type MovieIdProps = {
  route: {
    params: {
      movieId: string;
    };
  };
};

type List = {
  id: string;
  name: string;
  movies: string[];
  timestamp: any;
  userId: string;
  description: string;
};

type MovieItemProps = {
  mediaId: string;
};

// MovieItem bileşenini ana bileşenin dışına taşıyoruz ve memo ile optimize ediyoruz
const MovieItem = memo(({ mediaId }: MovieItemProps) => {
  const { data: movie, isLoading, isError } = useMovieData(mediaId);

  if (isLoading) {
    return (
      <View className="h-20 w-14 bg-gray-800/70 rounded-lg border border-gray-700/30 justify-center items-center">
        <Text className="color-gray-400 text-xs">Loading...</Text>
      </View>
    );
  }

  if (isError || !movie) {
    return (
      <View className="h-20 w-14 bg-gray-800/70 rounded-lg border border-gray-700/30 justify-center items-center">
        <FontAwesome6 name="image" size={16} color="#6B7280" />
      </View>
    );
  }

  return (
    <View>
      <Image
        className="h-20 w-14 rounded-lg border border-gray-700/50"
        source={{
          uri: `https://image.tmdb.org/t/p/w342${movie.poster_path}`,
        }}
        resizeMode="cover"
      />
      <View className="absolute inset-0 bg-black/20 rounded-lg" />
    </View>
  );
});

const MovieDetailAddlist = ({
  navigation,
  route,
}: MovieDetailAddlistProp & MovieIdProps) => {
  const movieId = route.params.movieId;
  const [movieIdArray, setMovieIdArray] = useState<string[]>([]);
  const user = useUserStore((state) => state.user);
  const listsRef = collection(FirebaseDB, "lists");
  const [lists, setLists] = useState<List[]>([]);
  const doc_query = query(listsRef, where("userId", "==", user!.uid));

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(doc_query);
      const listCollection = snapshot.docs.map((doc) => {
        const listData = doc.data() as List;
        return { ...listData, id: doc.id };
      });

      // Film zaten listede varsa o listeyi filtrele
      const filteredLists = listCollection.filter(
        (list) => !list.movies || !list.movies.includes(movieId)
      );

      setLists(filteredLists);

      setMovieIdArray((prevMovieIds) => [...prevMovieIds, movieId]);
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderListItem = useCallback(
    ({ item }: { item: List }) => (
      <TouchableOpacity
        key={item.id}
        className="bg-gray-900/60 rounded-2xl p-5 mb-4 border border-gray-800/30"
        onPress={() =>
          navigation.replace("AddList", {
            movies: [...item.movies, movieId],
            listId: item.id,
          })
        }
      >
        {/* Top section with user info */}
        <View className="flex-row items-center mb-4">
          <Image
            className="w-10 h-10 rounded-full mr-3 border-2 border-gray-700"
            source={require("../screens/avatar.jpg")}
          />
          <View className="flex-1">
            <Text className="color-white text-sm font-semibold">
              {item.userId}
            </Text>
            <Text className="color-gray-500 text-xs">
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
          <View className="bg-gray-800/50 px-3 py-1 rounded-full">
            <Text className="color-gray-400 text-xs font-medium">
              {item.movies ? item.movies.length : 0} films
            </Text>
          </View>
        </View>

        {/* List Title and Description */}
        <View className="mb-4">
          <Text className="color-white text-xl font-bold mb-2 leading-6">
            {item.name}
          </Text>
          {item.description ? (
            <Text
              className="color-gray-400 text-sm leading-5"
              numberOfLines={3}
            >
              {item.description}
            </Text>
          ) : null}
        </View>

        {/* Movie Posters Grid */}
        {item.movies && item.movies.length > 0 && (
          <View className="mb-4">
            <View className="flex-row justify-between">
              {/* Show first 4 movies when there are more than 5 */}
              {item.movies.length > 5 ? (
                <>
                  {item.movies.slice(0, 4).map((mediaId, index) => (
                    <MovieItem key={`${mediaId}-${index}`} mediaId={mediaId} />
                  ))}
                  <View className="h-20 w-14 bg-gray-800/70 rounded-lg justify-center items-center border border-gray-700/50">
                    <Text className="color-white text-xs font-bold">
                      +{item.movies.length - 4}
                    </Text>
                    <Text className="color-gray-400 text-xs">more</Text>
                  </View>
                </>
              ) : (
                /* Show all movies when 5 or less */
                item.movies.map((mediaId, index) => (
                  <MovieItem key={`${mediaId}-${index}`} mediaId={mediaId} />
                ))
              )}
            </View>
          </View>
        )}

        {/* Action indicator */}
        <View className="flex-row items-center justify-end">
          <Text className="color-gray-500 text-xs mr-2">Edit list</Text>
          <FontAwesome6 name="chevron-right" size={12} color="#6B7280" />
        </View>
      </TouchableOpacity>
    ),
    [navigation, movieId]
  );

  return (
    <ScrollView className="bg-black">
      <View className=" flex-row bg-black">
        <View className="flex-row items-center ">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className=" justify-center items-center pt-4 pl-3 "
          >
            <FontAwesome6 name="angle-left" size={26} color="white" />
          </TouchableOpacity>
          <Text className="color-white pt-4 pl-3 text-2xl">Add List</Text>
        </View>
      </View>
      <View className="m-3">
        {lists.map((list) => renderListItem({ item: list }))}
      </View>

      {/* Create New List Button */}
      <View className="px-3 pb-6">
        <TouchableOpacity
          className="bg-orange-500 rounded-2xl p-4 flex-row items-center justify-center"
          onPress={() =>
            navigation.replace("AddList", {
              movies: movieIdArray,
              listId: null,
            })
          }
          activeOpacity={0.8}
        >
          <View className="bg-white/20 rounded-full p-2 mr-3">
            <FontAwesome6 name="plus" size={16} color="white" />
          </View>
          <Text className="color-white text-lg font-semibold">
            Create New List
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MovieDetailAddlist;
