import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { FirebaseDB } from "firebaseConfig";
import { useMovieData } from "utils/hooks/useMovieData";
import { UserData } from "../ProfileScreen";
import { formatTimestamp } from "utils/functions";

type ProfileListProp = NativeStackScreenProps<
  InsideStackParamList,
  "ProfileList"
> & {
  user: UserData;
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

const ProfileList = ({ navigation, user }: ProfileListProp) => {
  const baseUser = user;
  const listsRef = collection(FirebaseDB, "lists");
  const [lists, setLists] = useState<List[]>([]);
  const doc_query = query(listsRef, where("userId", "==", baseUser.uid));

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(doc_query);
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
              source={require("../avatar.jpg")}
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
      <ScrollView>
        {lists.map((list) => renderListItem({ item: list }))}
      </ScrollView>
    </View>
  );
};
export default ProfileList;
