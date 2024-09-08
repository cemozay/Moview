import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { UserData } from "screens/ProfileScreen";
import useUserStore from "utils/hooks/useUserStore";
import { FirebaseDB } from "firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useMovieData } from "utils/hooks/useMovieData";
import { formatTimestamp } from "utils/functions";

type ProfileMainProp = {
  user: UserData;
  route: any;
  navigation: any;
};
type MovieItemProps = {
  mediaId: string;
};

type List = {
  id: string;
  name: string;
  movies: string[];
  timestamp: any;
  userId: string;
  description: string;
};

type Item = {
  type: string;
  key: string;
  text: string;
  isSelected: boolean;
  id: string;
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

const ProfileMain = ({ user, navigation }: ProfileMainProp) => {
  const baseUser = useUserStore((state) => state.user);
  const docRef = collection(FirebaseDB, "users");
  const [data, setData] = useState<Item[]>([]);
  const [lists, setLists] = useState<List[]>([]);

  useEffect(() => {
    const fetchDocs = async () => {
      if (baseUser) {
        const doc_query = query(docRef, where("userId", "==", baseUser.uid));
        const snapshot = await getDocs(doc_query);

        snapshot.docs.forEach((doc) => {
          const showCaseArray = doc.data().showCase;
          setData(showCaseArray);
          console.log(showCaseArray);
        });
      }
    };

    fetchDocs();

    const fetchLists = async () => {
      try {
        const listsSnapshot = await getDocs(collection(FirebaseDB, "lists"));
        const fetchedLists = listsSnapshot.docs.map(
          (doc) => doc.data() as List
        );
        setLists(fetchedLists);
        console.log(fetchedLists);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };

    fetchLists();
  }, [baseUser]);

  const renderItem = ({ item }: { item: Item }) => {
    if (item.type === "review") {
      return (
        <View
          key={item.id}
          style={{ padding: 10, backgroundColor: "white", marginVertical: 5 }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.text}</Text>
        </View>
      );
    } else if (item.type === "list") {
      const list = lists.find((list) => list.id === item.id);
      if (!list) return null;
      return (
        <TouchableOpacity
          key={list.id}
          className="flex-row justify-between bg-neutral-800 rounded-xl p-3 border border-neutral-600"
          onPress={() =>
            navigation.navigate("ListDetailsScreen", { listId: list.id })
          }
        >
          <View>
            <View className="w-full flex-row justify-between">
              <View className="flex-row items-center">
                <Text className="color-white">{list.userId}</Text>
              </View>
            </View>
            <View className="pb-2">
              <Text numberOfLines={2} className="color-white">
                {list.description}
              </Text>
            </View>
            <FlatList
              data={list?.movies}
              keyExtractor={(mediaId) => mediaId}
              horizontal
              ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
              renderItem={({ item: mediaId }) => (
                <MovieItem mediaId={mediaId} />
              )}
            />
            <View className="flex-row justify-between gap-3">
              <View className="gap-3">
                <Text className="text-white">
                  {formatTimestamp(list?.timestamp)}
                </Text>
              </View>
              <View className="flex-row gap-3">
                <Text className="text-white">
                  {list?.movies ? list?.movies.length : 0} Film
                </Text>
                <Text className="text-white">X Yorum</Text>
                <Text className="text-white">X Beğeni</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ProfileMain;
