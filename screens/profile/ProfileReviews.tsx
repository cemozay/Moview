import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { collection, where, query, getDocs } from "firebase/firestore";
import { FirebaseDB } from "../../firebaseConfig";
import useUserStore from "../../utils/userStore";

interface Review {
  date: string;
  movieid: string;
  puan: string;
  reviewd: string;
}

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2UzY2MwNDE2ZjcwM2RmOTI1NmM1ZTgyYmEwZTVmYiIsInN1YiI6IjY1ODM2NTZhMDgzNTQ3NDRmMzNlODc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nv0234eCrGmSRXSURyFUGO7uIub5OAOeCA0t9kCPLr0",
  },
};

const ProfileReviews = () => {
  const user = useUserStore((state) => state.user);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [movieDataMap, setMovieDataMap] = useState<{ [key: string]: any }>({});

  const reviewRef = collection(FirebaseDB, "reviews");

  const fetchMovieData = async (review: Review) => {
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

  const q = query(reviewRef, where("user", "==", user!.uid));

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(q);
      const reviewList = snapshot.docs.map((doc) => doc.data() as Review);
      setReviews(reviewList);

      const movieIds = reviewList.map((review) => review.movieid);

      movieIds.forEach((movieid) => {
        fetchMovieData({
          movieid,
          date: "",
          puan: "",
          reviewd: "",
        });
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
};

export default ProfileReviews;
