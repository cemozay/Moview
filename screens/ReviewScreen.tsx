import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/FontAwesome";
import { getFirestore, collection, query, getDocs } from "firebase/firestore";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2UzY2MwNDE2ZjcwM2RmOTI1NmM1ZTgyYmEwZTVmYiIsInN1YiI6IjY1ODM2NTZhMDgzNTQ3NDRmMzNlODc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nv0234eCrGmSRXSURyFUGO7uIub5OAOeCA0t9kCPLr0",
  },
};

export default function ReviewScreen() {
  const navigation = useNavigation();
  const dataBase = getFirestore();
  const reviewRef = collection(dataBase, "reviews");

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(query(reviewRef));
        const reviewList = snapshot.docs.map((doc) => doc.data());
        setReviews(reviewList);
      } catch (e) {
        alert(e);
      }
    };

    fetchData();
  }, [reviewRef]);

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 10,
        }}
      >
        <View>
          <Text style={{ color: "white", fontSize: 30 }}>Moview</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 3 }}>
          <TouchableOpacity onPress={() => navigation.navigate("SearchScreen")}>
            <Icon name="search" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="heart" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        {reviews.map((review, index) => (
          <View className="bg-red-500" key={index}>
            <Text className="color-white">{review.date}</Text>
            <Text className="color-white">{review.movieid}</Text>
            <Text className="color-white">{review.puan}</Text>
            <Text className="color-white">{review.reviewd}</Text>
          </View>
        ))}
      </ScrollView>
      <View className="items-end pb-4 pr-4">
        <TouchableOpacity
          onPress={() => navigation.navigate("Selectlist")}
          className="mx-4 h-16 w-16 bg-white justify-center items-center rounded-full"
        >
          <Icon name="heart" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
