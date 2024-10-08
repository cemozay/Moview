import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { collection, query, getDocs } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { FirebaseDB } from "firebaseConfig";
import { useMovieData } from "utils/hooks/useMovieData";
import { formatTimestamp } from "utils/functions";

type ListScreenProp = NativeStackScreenProps<
  InsideStackParamList,
  "ListsScreen"
>;

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

type Movie = {
  id: string;
  title: string;
  poster: string;
};

type Movies = Movie[];

const MovieItem = ({ mediaId }: MovieItemProps) => {
  const { data: movie, isLoading, isError } = useMovieData(mediaId);

  if (isLoading) {
    return (
      <View className="mr-3 h-48 w-24 bg-gray-500">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="mr-3 h-48 w-24 bg-gray-500">
        <Text className="text-white">Error loading movie data</Text>
      </View>
    );
  }

  return (
    <Image
      className="h-36 w-24 rounded-xl"
      source={{
        uri: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
      }}
    />
  );
};

const ListScreen = ({ navigation }: ListScreenProp) => {
  const listsRef = collection(FirebaseDB, "lists");
  const [array] = useState<Movies[]>([]);
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
      className="flex-row justify-between bg-neutral-800 rounded-xl p-3 border border-neutral-600"
      onPress={() =>
        navigation.navigate("ListDetailsScreen", { listId: item.id })
      }
    >
      <View>
        <View className="w-full flex-row justify-between">
          <View>
            <Text className="color-white text-xl">{item.name}</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="color-white">{item.userId}</Text>
            <Image
              className="w-10 h-10 rounded-full"
              source={require("./avatar.jpg")}
            />
          </View>
        </View>
        <View className="pb-2">
          <Text numberOfLines={2} className="color-white">
            {item.description}
          </Text>
        </View>
        <FlatList
          data={item.movies}
          keyExtractor={(mediaId) => mediaId}
          horizontal
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          renderItem={({ item: mediaId }) => <MovieItem mediaId={mediaId} />}
        />
        <View className="flex-row justify-between gap-3">
          <View className="gap-3">
            <Text className="text-white">
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>
          <View className="flex-row gap-3">
            <Text className="text-white">
              {item.movies ? item.movies.length : 0} Film
            </Text>
            <Text className="text-white">X Yorum</Text>
            <Text className="text-white">X Beğeni</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-black">
      <View className="flex-row justify-between items-center p-3">
        <View>
          <Text className="text-white text-3xl">Lists</Text>
        </View>
        <View className="flex-row gap-3">
          <TouchableOpacity onPress={() => navigation.navigate("SearchScreen")}>
            <Icon name="search" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRefresh}>
            <Icon name="refresh" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        {lists.map((list) => renderListItem({ item: list }))}
      </ScrollView>
      <View className="items-end pb-4 pr-4">
        <TouchableOpacity
          onPress={() => navigation.navigate("AddList", { movies: array })}
          className="ml-4 h-16 w-16 bg-white justify-center items-center rounded-full"
        >
          <Icon name="heart" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default ListScreen;
