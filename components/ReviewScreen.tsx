import { View, Text, ActivityIndicator, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { FirebaseDB } from "firebaseConfig";
import { collection, doc, getDoc, deleteDoc } from "firebase/firestore";
import { useAuthentication } from "utils/hooks/useAuthentication";

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
  navigation: any; // navigation prop ekleyin
};

const ReviewScreen = ({
  route,
  navigation,
}: ReviewScreenProp & ReviewsIdProps) => {
  const { reviewId } = route.params;
  const reviewRef = collection(FirebaseDB, "reviews");
  const [reviewData, setReviewData] = useState<any>(null);
  const { user, loading } = useAuthentication();

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
      }
    };

    fetchReview();
  }, [reviewId]);

  const handleDeleteReview = async () => {
    try {
      await deleteDoc(doc(reviewRef, reviewId));
      console.log("Review deleted successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

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

  const { date, mediaId, rating, text, userId } = reviewData;

  return (
    <View>
      <Text>Date: {date}</Text>
      <Text>Movie ID: {mediaId}</Text>
      <Text>Puan: {rating}</Text>
      <Text>Review: {text}</Text>
      <Text>User: {userId}</Text>

      {user && user.uid === userId && (
        <Button title="Delete Review" onPress={handleDeleteReview} />
      )}
    </View>
  );
};

export default ReviewScreen;
