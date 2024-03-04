import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "@expo/vector-icons/FontAwesome";
import {
  getFirestore,
  collection,
  where,
  query,
  getDocs,
} from "firebase/firestore";
import { FirebaseAuth } from "../../firebaseConfig";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2UzY2MwNDE2ZjcwM2RmOTI1NmM1ZTgyYmEwZTVmYiIsInN1YiI6IjY1ODM2NTZhMDgzNTQ3NDRmMzNlODc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nv0234eCrGmSRXSURyFUGO7uIub5OAOeCA0t9kCPLr0",
  },
};

export default function ProfileReviews() {
  const navigation = useNavigation();
  const dataBase = getFirestore();
  const auth = FirebaseAuth;
  const reviewRef = collection(dataBase, "reviews");
  const userid = auth.currentUser.uid; // Auth objesinden uid alınmalı
  const [reviews, setReviews] = useState([]);
  const [movieDataMap, setMovieDataMap] = useState({});

  const fetchMovieData = async (review: object) => {
    try {
      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${review.movieid}?language=en-US`,
        options
      );
      const movieData = await movieResponse.json();

      setMovieDataMap((prevMap) => ({
        ...prevMap,
        [review.movieid]: movieData,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const q = query(reviewRef, where("user", "==", userid));

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(q);
      const reviewList = snapshot.docs.map((doc) => doc.data());
      setReviews(reviewList);

      const movieIds = reviewList.map((review) => review.movieid);

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
      <View>
        <TouchableOpacity onPress={handleRefresh}>
          <Icon name="refresh" size={30} color="white" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {reviews.map((review, index) => (
          <TouchableOpacity
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "red",
              borderWidth: 2,
              borderColor: "white",
              padding: 4,
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
    </View>
  );
}
