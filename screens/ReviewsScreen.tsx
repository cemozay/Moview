import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StyleSheet,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { collection, query, getDocs } from "firebase/firestore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { FirebaseDB } from "firebaseConfig";
import { useMovieData } from "utils/hooks/useMovieData";
import LinearGradient from "react-native-linear-gradient";

type ReviewsScreenProp = NativeStackScreenProps<
  InsideStackParamList,
  "ReviewsScreen"
>;

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
  navigation: ReviewsScreenProp["navigation"];
};
const ReviewScreen = ({ navigation }: ReviewsScreenProp) => {
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

  const handleRefresh = () => {
    fetchReviews();
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <View className="flex-1 bg-black">
      <View className="flex-row justify-between items-center py-3 px-3">
        <View>
          <Text className="color-white text-3xl">Review</Text>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity onPress={() => navigation.navigate("SearchScreen")}>
            <Icon name="search" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="heart" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        {reviews.map((review: Review) => (
          <ReviewItem key={review.id} review={review} navigation={navigation} />
        ))}
      </ScrollView>
      <View className="items-end pb-4 pr-4">
        <TouchableOpacity
          onPress={() => navigation.navigate("Selectlist")}
          className="ml-4 h-16 w-16 bg-white justify-center items-center rounded-full"
        >
          <Icon name="heart" size={30} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const ReviewItem = ({ navigation, review }: ReviewItemProps) => {
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "";
    const now = new Date();
    const date = timestamp.toDate();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInHours = diffInSeconds / 3600;
    const diffInDays = diffInSeconds / 86400;
    const diffInWeeks = diffInSeconds / (86400 * 7);
    const diffInMonths = diffInSeconds / (86400 * 30);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} days ago`;
    } else if (diffInWeeks < 4) {
      return `${Math.floor(diffInWeeks)} weeks ago`;
    } else {
      return `${Math.floor(diffInMonths)} months ago`;
    }
  };
  const { data: movie, isLoading, isError } = useMovieData(review.mediaId);

  if (isLoading) {
    return <Text className="color-white">Loading...</Text>;
  }

  if (isError) {
    return <Text className="color-white">Error loading movie data</Text>;
  }

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ReviewScreen", { reviewId: review.id })
      }
    >
      <ImageBackground
        className="p-3 border-white border-t"
        source={{
          uri: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
        }}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.7)"]}
          style={{ ...StyleSheet.absoluteFillObject }}
        />
        <View className="flex-row justify-between">
          <View>
            <Text className="color-white">{movie.title}</Text>
            <Text className="color-white">{review.rating}</Text>
          </View>
          <View className="flex-row items-center">
            <Text className="color-white">{review.userId}</Text>
            <Image
              className="w-10 h-10 rounded-full"
              source={require("./avatar.jpg")}
            />
          </View>
        </View>
        <View className="flex-row m-2">
          <Image
            className="h-36 w-24"
            source={{
              uri: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
            }}
          />
          <View className="flex-1 ml-3">
            <Text numberOfLines={4} className="color-white">
              {review.text}
            </Text>
            <View className="flex-row mt-2">
              <Text className="color-white">
                {formatTimestamp(review.timestamp)}
              </Text>
              <Text className="color-white ml-2">X Yorum</Text>
              <Text className="color-white ml-2">X Beğeni</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default ReviewScreen;
