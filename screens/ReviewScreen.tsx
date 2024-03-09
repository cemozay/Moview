import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { FirebaseDB } from "firebaseConfig";
import { collection, doc, getDoc } from "firebase/firestore";

type ReviewScreenProp = NativeStackScreenProps<
  InsideStackParamList,
  "ReviewScreen"
>;

type ReviewsIdProps = {
  route: {
    params: {
      reviewId: string;
    };
  };
};

const ReviewScreen = ({ route }: ReviewScreenProp & ReviewsIdProps) => {
  const { reviewId } = route.params;
  const reviewRef = collection(FirebaseDB, "reviews");
  const [reviewData, setReviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const reviewDocument = doc(reviewRef, reviewId);
        const reviewSnapshot = await getDoc(reviewDocument);

        if (reviewSnapshot.exists()) {
          const reviewData = reviewSnapshot.data();
          setReviewData(reviewData);
        } else {
          console.warn("Review not found.");
        }
      } catch (error) {
        console.error("Error fetching review:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [reviewId]);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  if (!reviewData) {
    return (
      <View>
        <Text>Review not found.</Text>
      </View>
    );
  }

  const { date, movieId, puan, review, user } = reviewData;

  return (
    <View>
      <Text>Date: {date}</Text>
      <Text>Movie ID: {movieId}</Text>
      <Text>Puan: {puan}</Text>
      <Text>Review: {review}</Text>
      <Text>User: {user}</Text>
    </View>
  );
};

export default ReviewScreen;
