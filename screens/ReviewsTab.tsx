import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { collection, query, getDocs } from "firebase/firestore";
import { FirebaseDB } from "../firebaseConfig";
import { useMovieData } from "../utils/hooks/useMovieData";
import { formatTimestamp } from "../utils/functions";

type Review = {
  timestamp: any;
  mediaId: string;
  rating: string;
  text: string;
  userId: string;
  id: string;
};

type ReviewItemProps = {
  review: Review;
  navigation: any;
};

interface ReviewsTabProps {
  navigation: any;
}

const ReviewItem = ({ navigation, review }: ReviewItemProps) => {
  const { data: movie, isLoading, isError } = useMovieData(review.mediaId);

  if (isLoading) {
    return (
      <View className="bg-gray-900/60 rounded-2xl p-5 mb-4 border border-gray-800/30">
        <View className="flex-row items-center justify-center py-8">
          <Text className="color-gray-400 text-center">Loading review...</Text>
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="bg-gray-900/60 rounded-2xl p-5 mb-4 border border-red-700/30">
        <View className="flex-row items-center justify-center py-8">
          <FontAwesome6
            name="exclamation-triangle"
            size={16}
            color="#EF4444"
            className="mr-2"
          />
          <Text className="color-red-400 text-center ml-2">
            Error loading movie data
          </Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ReviewScreen", { reviewId: review.id })
      }
      className="mb-4"
      activeOpacity={0.8}
    >
      <View className="bg-gray-900/60 rounded-2xl p-5 border border-gray-800/30">
        {/* Top section with user info */}
        <View className="flex-row items-center mb-4">
          <Image
            className="w-10 h-10 rounded-full mr-3 border-2 border-gray-700"
            source={require("./avatar.jpg")}
          />
          <View className="flex-1">
            <Text className="color-white text-sm font-semibold">
              {review.userId}
            </Text>
            <Text className="color-gray-500 text-xs">
              {formatTimestamp(review.timestamp)}
            </Text>
          </View>
          <View className="bg-orange-500/20 px-3 py-1 rounded-full">
            <Text className="color-orange-400 text-sm font-medium">
              ★ {review.rating}
            </Text>
          </View>
        </View>

        {/* Movie title */}
        <View className="mb-4">
          <Text className="color-white text-xl font-bold mb-2 leading-6">
            {movie.title}
          </Text>
        </View>

        {/* Review content */}
        <View className="flex-row mb-4">
          {/* Movie Poster */}
          <View className="mr-4">
            <Image
              className="h-24 w-16 rounded-lg border border-gray-700/50"
              source={{
                uri: `https://image.tmdb.org/t/p/w342${movie.poster_path}`,
              }}
            />
            <View className="absolute inset-0 bg-black/20 rounded-lg" />
          </View>

          {/* Review Text */}
          <View className="flex-1">
            <Text
              numberOfLines={4}
              className="color-gray-300 text-sm leading-5"
            >
              {review.text}
            </Text>
          </View>
        </View>

        {/* Stats and Action */}
        <View className="flex-row justify-between items-center pt-3 border-t border-gray-700/30">
          <View className="flex-row gap-4">
            <View className="flex-row items-center">
              <Icon name="comment" size={12} color="#9CA3AF" />
              <Text className="color-gray-500 text-xs ml-1">0 Comments</Text>
            </View>
            <View className="flex-row items-center">
              <Icon name="heart" size={12} color="#9CA3AF" />
              <Text className="color-gray-500 text-xs ml-1">0 Likes</Text>
            </View>
          </View>

          <View className="flex-row items-center">
            <Text className="color-gray-500 text-xs mr-2">Read more</Text>
            <FontAwesome6 name="chevron-right" size={12} color="#6B7280" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ReviewsTab: React.FC<ReviewsTabProps> = ({ navigation }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  const reviewRef = collection(FirebaseDB, "reviews");
  const doc_query = query(reviewRef);

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

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {reviews.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text className="color-gray-400 text-lg mb-2">No reviews yet</Text>
            <Text className="color-gray-500 text-sm text-center">
              Be the first to share your thoughts!
            </Text>
          </View>
        ) : (
          reviews.map((review: Review) => (
            <ReviewItem
              key={review.id}
              review={review}
              navigation={navigation}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default ReviewsTab;
