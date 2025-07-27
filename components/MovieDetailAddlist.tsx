import { Text, TouchableOpacity, ScrollView, View } from "react-native";
import React, { useState, useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { FirebaseDB } from "../firebaseConfig";
import useUserStore from "../utils/hooks/useUserStore";
import { collection, query, where, getDocs } from "firebase/firestore";

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
      setLists(listCollection);

      setMovieIdArray((prevMovieIds) => [...prevMovieIds, movieId]);
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
      className="bg-neutral-800 p-3 rounded-xl border border-neutral-600"
      onPress={() =>
        navigation.navigate("ListContent", {
          movies: item.movies,
          listid: item.id,
          movieId: movieId,
        })
      }
    >
      <View>
        <View>
          <Text className="color-white text-xl">{item.name}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
      <TouchableOpacity
        className="h-4 w-4 bg-red-500"
        onPress={() =>
          navigation.navigate("AddList", { movies: movieIdArray, listId: null })
        }
      ></TouchableOpacity>
    </ScrollView>
  );
};

export default MovieDetailAddlist;
