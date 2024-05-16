import { Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { FirebaseDB } from "firebaseConfig";
import { getDoc, doc } from "firebase/firestore";

type ListDetailsScreenNavigate = NativeStackScreenProps<
  InsideStackParamList,
  "ListDetailsScreen"
>;

type ListDetailsScreenProp = {
  navigation: ListDetailsScreenNavigate["navigation"];
  route: ListDetailsScreenNavigate["route"];
};

type ListData = {
  listName: string;
  mediaItems: string[];
  timestamp: any;
  userId: string;
};

const ListDetailsScreen = ({ navigation, route }: ListDetailsScreenProp) => {
  const { listId } = route.params;
  const [listData, setListData] = useState<ListData | null>(null);

  useEffect(() => {
    const fetchListData = async () => {
      try {
        const listDocRef = doc(FirebaseDB, "lists", listId);
        const listDocSnap = await getDoc(listDocRef);
        if (listDocSnap.exists()) {
          const data = listDocSnap.data() as ListData;
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

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>ListDetailsScreen</Text>
      </TouchableOpacity>
      <Text>{listData.listName}</Text>
    </View>
  );
};

export default ListDetailsScreen;
