import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { collection, where, query, getDocs } from "firebase/firestore";
import { FirebaseDB } from "../../firebaseConfig";
import useUserStore from "../../utils/hooks/useUserStore";
import { useMovieData, MovieData } from "utils/hooks/useMovieData";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";

type ProfileReviewsProp = NativeStackScreenProps<
  InsideStackParamList,
  "ProfileReviews"
>;

type Review = {
  id: string;
  date: string;
  mediaId: string;
  puan: string;
  review: string;
};

const ProfileReviews = ({ navigation }: ProfileReviewsProp) => {
  const user = useUserStore((state) => state.user);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [movies, setMovies] = useState<MovieData[]>([]);

  const movieIds = reviews?.map((review) => review.mediaId);
  const {
    data: movieData,
    isLoading,
    isError,
    error,
    refetch,
  } = useMovieData(movieIds);

  const reviewRef = collection(FirebaseDB, "reviews");
  const doc_query = query(reviewRef, where("user", "==", user!.uid));

  const fetchReviews = async () => {
    try {
      const snapshot = await getDocs(doc_query);
      const reviewList = snapshot.docs.map((doc) => {
        const reviewData = doc.data() as Review;
        return { ...reviewData, id: doc.id };
      });

      setReviews(reviewList);
    } catch (err) {
      alert(err);
    }
  };

  const handleRefresh = () => {
    fetchReviews();
    refetch();
  };

  useEffect(() => {
    fetchReviews();
    refetch();
  }, []);

  useEffect(() => {
    if (!isLoading && !isError && movieData) {
      setMovies(movieData);
    } else {
      setMovies([]);
      if (isError) {
        console.log(error);
      }
    }
  }, [movieData, isLoading, isError]);

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
              navigation.navigate("ReviewScreen", { reviewId: review.mediaId })
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
              <Text style={{ color: "white" }}>{review.mediaId}</Text>
              <Text style={{ color: "white" }}>{review.puan}</Text>
              <Text style={{ color: "white" }}>{review.review}</Text>
            </View>
            {movies && (
              <Image
                style={{ width: 150, height: 200 }}
                source={{
                  uri: `https://image.tmdb.org/t/p/original${
                    movies.find(
                      (movie) => movie.id.toString() === review.mediaId
                    )?.poster_path
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
