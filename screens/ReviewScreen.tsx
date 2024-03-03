import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
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
  const [movieDataMap, setMovieDataMap] = useState({});

  const fetchMovieData = async (review) => {
    try {
      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${review.movieid}?language=en-US`,
        options
      );
      const movieData = await movieResponse.json();

      // movieDataMap'i güncelle, movieid ile eşleştirilmiş bir şekilde
      setMovieDataMap((prevMap) => ({
        ...prevMap,
        [review.movieid]: movieData,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(query(reviewRef));
      const reviewList = snapshot.docs.map((doc) => doc.data());
      setReviews(reviewList);

      // Tüm incelemelerin movieid'lerini al
      const movieIds = reviewList.map((review) => review.movieid);

      // Her bir movieid için fetchMovieData çağır
      movieIds.forEach((movieid) => {
        fetchMovieData({ movieid });
      });
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
          <TouchableOpacity onPress={handleRefresh}>
            <Icon name="refresh" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        {reviews.map((review, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "red",
              borderWidth: 1,
              borderColor: "white",
              padding: 10,
              margin: 5,
            }}
          >
            <View>
              <Text style={{ color: "white" }}>{review.date}</Text>
              <Text style={{ color: "white" }}>{review.movieid}</Text>
              <Text style={{ color: "white" }}>{review.puan}</Text>
              <Text style={{ color: "white" }}>{review.reviewd}</Text>
            </View>
            {movieDataMap[review.movieid] && (
              <Image
                style={{ width: 150, height: 200 }}
                source={{
                  uri: `https://image.tmdb.org/t/p/original${
                    movieDataMap[review.movieid].poster_path
                  }`,
                }}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View
        style={{ alignItems: "flex-end", paddingBottom: 4, paddingRight: 4 }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("Selectlist")}
          style={{
            marginLeft: 4,
            height: 60,
            width: 60,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 30,
          }}
        >
          <Icon name="heart" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
