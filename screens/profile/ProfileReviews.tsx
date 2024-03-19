import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { collection, where, query, getDocs } from "firebase/firestore";
import { FirebaseDB } from "../../firebaseConfig";
import useUserStore from "../../utils/hooks/useUserStore";
import { useMovieData } from "utils/hooks/useMovieData";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";

type ProfileReviewsProp = NativeStackScreenProps<
  InsideStackParamList,
  "ProfileReviews"
>;

type Review = {
  date: string;
  movieId: string;
  puan: string;
  review: string;
};

const ProfileReviews = ({ navigation }: ProfileReviewsProp) => {
  const user = useUserStore((state) => state.user);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [movieDataMap, setMovieDataMap] = useState<{ [key: string]: any }>({});

  const reviewRef = collection(FirebaseDB, "reviews");

  const fetchMovieData = (review: Review) => {
    try {
      const apiResponse = useMovieData(review.movieId);
      const movieData = apiResponse.data;

      setMovieDataMap((prevMap) => ({
        ...prevMap,
        [review.movieId]: movieData,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const q = query(reviewRef, where("user", "==", user!.uid));

  const fetchData = async () => {
    try {
      const snapshot = await getDocs(q);
      const reviewList = snapshot.docs.map((doc) => {
        const reviewData = doc.data() as Review;
        return { ...reviewData, id: doc.id };
      });

      setReviews(reviewList);

      const movieIds = reviewList.map((review) => review.movieId);
      movieIds.forEach((movieId) => {
        fetchMovieData({
          movieId,
          date: "",
          puan: "",
          review: "",
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
            onPress={() =>
              navigation.navigate("ReviewScreen", { reviewId: review.movieId })
            }
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
              <Text style={{ color: "white" }}>{review.movieId}</Text>
              <Text style={{ color: "white" }}>{review.puan}</Text>
              <Text style={{ color: "white" }}>{review.review}</Text>
            </View>
            {movieDataMap[review.movieId] && (
              <Image
                style={{ width: 150, height: 200 }}
                source={{
                  uri: `https://image.tmdb.org/t/p/original${
                    movieDataMap[review.movieId].poster_path
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
