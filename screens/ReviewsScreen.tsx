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
import { FirebaseDB } from "firebaseConfig";
import { useMovieData } from "utils/hooks/useMovieData";
import LinearGradient from "react-native-linear-gradient";
import { formatTimestamp } from "utils/functions";
export interface ReviewsScreenProp {
  navigation: any;
  route: any;
}

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

const ReviewScreen: React.FC<ReviewsScreenProp> = ({ navigation }) => {
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
          <TouchableOpacity onPress={() => handleRefresh}>
            <Icon name="refresh" size={30} color="white" />
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
      <View style={styles.reviewContainer}>
        <ImageBackground
          style={styles.imageBackground}
          imageStyle={styles.imageBackgroundImage}
          source={{
            uri: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
          }}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.5)"]}
            style={StyleSheet.absoluteFillObject}
          />
          <View className="flex-row justify-between">
            <View>
              <Text className="color-white text-2xl">{movie.title}</Text>
              <Text className="color-white">{review.rating}</Text>
            </View>
          </View>
          <View className="flex-row m-2">
            <Image
              className="h-36 w-24 rounded-xl"
              source={{
                uri: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
              }}
            />
            <View className="flex-1 ml-3">
              <Text numberOfLines={4} className="color-white">
                {review.text}
              </Text>
              <View>
                <View className="flex-row items-center m-2">
                  <Image
                    className="w-10 h-10 rounded-full"
                    source={require("./avatar.jpg")}
                  />
                  <View>
                    <Text className="text-xs color-white">Alperen Ağırman</Text>
                  </View>
                  <View className="justify-center items-center">
                    <Icon name="search" size={24} color="white" />

                    <Text className="color-white ml-2 text-xs">X Yorum</Text>
                  </View>
                  <View className="justify-center items-center">
                    <Icon name="search" size={24} color="white" />
                    <Text className="color-white ml-2 text-xs">X Beğeni</Text>
                  </View>
                </View>
              </View>
              <View className="items-end">
                <Text className="color-white text-xs">
                  {formatTimestamp(review.timestamp)}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  reviewContainer: {
    borderColor: "#585858",
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 40, // Add border radius to the container
    overflow: "hidden", // Ensure child components are clipped to the rounded corners
  },
  imageBackground: {
    padding: 16,
  },
  imageBackgroundImage: {
    borderRadius: 16, // Add border radius to the ImageBackground
  },
});

export default ReviewScreen;
ReviewItem;
