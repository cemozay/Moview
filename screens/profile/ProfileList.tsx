import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  FlatList,
} from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { FirebaseDB } from "firebaseConfig";
import { UserData } from "../ProfileScreen";

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

const screenWidth = Dimensions.get("window").width;

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
      className="p-2 mx-2"
      style={{ width: screenWidth / 2 - 24 }}
      onPress={() =>
        navigation.navigate("ListDetailsScreen", { listId: item.id })
      }
    >
      <Image
        className="w-full rounded-xl h-40"
        source={require("../profile.jpg")}
      />
      <Text className="text-white text-lg">{item.name}</Text>
      <Text className="text-gray-400 text-sm">{item.userId}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={lists}
        renderItem={renderListItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 8 }}
      />
    </View>
  );
};
export default ProfileList;
