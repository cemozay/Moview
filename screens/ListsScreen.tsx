import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { collection, query, getDocs } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { FirebaseDB } from "firebaseConfig";

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
type Movie = {
  id: string;
  title: string;
  poster: string;
};

type Movies = Movie[];

const screenWidth = Dimensions.get("window").width;

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
      className="p-2 mx-2"
      style={{ width: screenWidth / 2 - 24 }}
      onPress={() =>
        navigation.navigate("ListDetailsScreen", { listId: item.id })
      }
    >
      <Image
        className="w-full rounded-xl h-40"
        source={require("./profile.jpg")}
      />
      <Text className="text-white text-lg">{item.name}</Text>
      <Text className="text-gray-400 text-sm">{item.userId}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-black">
      <View className="flex-row justify-between items-center p-3">
        <Text className="text-white text-3xl">Lists</Text>
        <View className="flex-row gap-">
          <TouchableOpacity onPress={() => navigation.navigate("SearchScreen")}>
            <Icon name="search" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleRefresh}>
            <Icon name="refresh" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={lists}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
      />

      <View className="absolute bottom-4 right-4">
        <TouchableOpacity
          onPress={() => navigation.navigate("AddList", { movies: array })}
          className="h-16 w-16 bg-white justify-center items-center rounded-full"
        >
          <Icon name="heart" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ListScreen;
