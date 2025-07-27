import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { collection, query, getDocs } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FirebaseDB } from "../firebaseConfig";
import { useMovieData } from "../utils/hooks/useMovieData";
import { formatTimestamp } from "../utils/functions";
import { RootStackParamList } from "navigation/InsideNavigation";

type ListScreenProp = NativeStackScreenProps<RootStackParamList>;

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

const MovieItem = ({ mediaId }: MovieItemProps) => {
  const { data: movie, isLoading, isError } = useMovieData(mediaId);

  if (isLoading) {
    return (
      <View className="h-20 w-14 bg-gray-800/70 rounded-lg border border-gray-700/30 animate-pulse" />
    );
  }

  if (isError) {
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
      />
      <View className="absolute inset-0 bg-black/20 rounded-lg" />
    </View>
  );
};

const ListScreen = ({ navigation }: ListScreenProp) => {
  const listsRef = collection(FirebaseDB, "lists");
  const [lists, setLists] = useState<List[]>([]);

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(query(listsRef));
      const listCollection = snapshot.docs.map((doc) => {
        const listData = doc.data() as List;
        return { ...listData, id: doc.id };
      });
      setLists(listCollection);
    } catch (e) {
      alert(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const renderListItem = ({ item }: { item: List }) => (
    <TouchableOpacity
      key={item.id}
      className="bg-gray-900/60 rounded-2xl p-5 mb-4 border border-gray-800/30"
      onPress={() =>
        navigation.navigate("ListDetailsScreen", { listId: item.id })
      }
    >
      {/* Top section with user info */}
      <View className="flex-row items-center mb-4">
        <Image
          className="w-10 h-10 rounded-full mr-3 border-2 border-gray-700"
          source={require("./avatar.jpg")}
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
          <Text className="color-gray-400 text-sm leading-5" numberOfLines={3}>
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
                {item.movies.slice(0, 4).map((mediaId) => (
                  <MovieItem key={mediaId} mediaId={mediaId} />
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
              item.movies.map((mediaId) => (
                <MovieItem key={mediaId} mediaId={mediaId} />
              ))
            )}
          </View>
        </View>
      )}

      {/* Action indicator */}
      <View className="flex-row items-center justify-end">
        <Text className="color-gray-500 text-xs mr-2">View list</Text>
        <FontAwesome6 name="chevron-right" size={12} color="#6B7280" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row justify-between items-center px-5 py-4">
        <Text className="color-white text-2xl font-bold">Lists</Text>
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={handleRefresh}>
            <FontAwesome6 name="arrow-rotate-right" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lists Content */}
      <ScrollView className="flex-1 px-5">
        {lists.map((list) => renderListItem({ item: list }))}

        {lists.length === 0 && (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="color-gray-400 text-lg mb-2">No lists yet</Text>
            <Text className="color-gray-500 text-sm text-center">
              Create your first movie list to get started
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <View className="absolute bottom-20 right-6">
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AddList", { movies: undefined, listId: null })
          }
          className="h-14 w-14 bg-orange-500 justify-center items-center rounded-full shadow-lg"
        >
          <FontAwesome6 name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default ListScreen;
