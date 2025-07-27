import React, { useEffect, useState, useCallback, memo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { collection, query, where, getDocs } from "firebase/firestore";
import Icon from "@expo/vector-icons/FontAwesome";

import useUserStore from "../../utils/hooks/useUserStore";
import { FirebaseDB } from "../../firebaseConfig";
import { useMovieData } from "../../utils/hooks/useMovieData";
import { formatTimestamp } from "../../utils/functions";

// Constants
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w342";
const AVATAR_PLACEHOLDER = require("../avatar.jpg");

// Types
interface MovieItemProps {
  mediaId: string;
}

interface Item {
  type: string;
  key: string;
  text: string;
  isSelected: boolean;
  id: string;
}

interface List {
  id: string;
  name: string;
  movies: string[];
  timestamp: any;
  userId: string;
  description: string;
}

interface Review {
  timestamp: any;
  mediaId: string;
  rating: string;
  text: string;
  userId: string;
  id: string;
}

const MovieItem = memo(({ mediaId }: MovieItemProps) => {
  const { data: movie, isLoading, isError } = useMovieData(mediaId);

  if (isLoading) {
    return (
      <View className="h-20 w-14 bg-gray-800/70 rounded-lg border border-gray-700/30 justify-center items-center">
        <ActivityIndicator size="small" color="#FF5C00" />
      </View>
    );
  }

  if (isError || !movie) {
    return (
      <View className="h-20 w-14 bg-gray-800/70 rounded-lg border border-gray-700/30 justify-center items-center">
        <Icon name="image" size={16} color="#6B7280" />
      </View>
    );
  }

  return (
    <View>
      <Image
        className="h-20 w-14 rounded-lg border border-gray-700/50"
        source={{
          uri: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`,
        }}
        resizeMode="cover"
      />
      <View className="absolute inset-0 bg-black/20 rounded-lg" />
    </View>
  );
});

interface ReviewItemProps {
  review: Review;
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
          <Icon
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
            source={require("../avatar.jpg")}
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
            <Icon name="chevron-right" size={12} color="#6B7280" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ProfileMain = ({ navigation }: { navigation: any }) => {
  const baseUser = useUserStore((state) => state.user);
  const [showcaseData, setShowcaseData] = useState<Item[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchShowcaseData = useCallback(async () => {
    if (!baseUser) return;

    try {
      const usersRef = collection(FirebaseDB, "users");
      const userQuery = query(usersRef, where("userId", "==", baseUser.uid));
      const snapshot = await getDocs(userQuery);

      snapshot.docs.forEach((doc) => {
        const showCaseArray = doc.data().showCase;
        if (Array.isArray(showCaseArray)) {
          setShowcaseData(showCaseArray || []);
        }
      });
    } catch (error) {
      console.error("Error fetching showcase data:", error);
    }
  }, [baseUser]);

  const fetchLists = useCallback(async () => {
    if (!baseUser) return;

    try {
      const listsRef = collection(FirebaseDB, "lists");
      const listsQuery = query(listsRef, where("userId", "==", baseUser.uid));
      const snapshot = await getDocs(listsQuery);

      const listCollection = snapshot.docs.map((doc) => {
        const listData = doc.data() as List;
        return { ...listData, id: doc.id };
      });
      setLists(listCollection);
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  }, [baseUser]);

  const fetchReviews = useCallback(async () => {
    if (!baseUser) return;

    try {
      const reviewsRef = collection(FirebaseDB, "reviews");
      const reviewsQuery = query(
        reviewsRef,
        where("userId", "==", baseUser.uid)
      );
      const snapshot = await getDocs(reviewsQuery);

      const reviewCollection = snapshot.docs.map((doc) => {
        const reviewData = doc.data() as Review;
        return { ...reviewData, id: doc.id };
      });
      setReviews(reviewCollection);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [baseUser]);

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([fetchShowcaseData(), fetchLists(), fetchReviews()]);
    setIsLoading(false);
  }, [fetchShowcaseData, fetchLists, fetchReviews]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  }, [fetchAllData]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const renderListItem = useCallback(
    ({ item }: { item: Item }) => {
      const list = lists.find((listItem) => listItem.id === item.id);
      const review = reviews.find((reviewItem) => reviewItem.id === item.id);

      const handlePress = () => {
        if (item.type === "list") {
          navigation.navigate("ListDetailsScreen", { listId: item.id });
        } else if (item.type === "review") {
          navigation.navigate("ReviewScreen", { reviewId: item.id });
        }
      };

      return (
        <View>
          {item.type === "list" && list ? (
            <TouchableOpacity
              key={item.id}
              className="bg-gray-900/60 rounded-2xl p-5 mb-4 border border-gray-800/30"
              onPress={handlePress}
              activeOpacity={0.8}
            >
              {/* Top section with user info */}
              <View className="flex-row items-center mb-4">
                <Image
                  className="w-10 h-10 rounded-full mr-3 border-2 border-gray-700"
                  source={AVATAR_PLACEHOLDER}
                />
                <View className="flex-1">
                  <Text className="color-white text-sm font-semibold">
                    {list.userId}
                  </Text>
                  <Text className="color-gray-500 text-xs">
                    {formatTimestamp(list.timestamp)}
                  </Text>
                </View>
                <View className="bg-gray-800/50 px-3 py-1 rounded-full">
                  <Text className="color-gray-400 text-xs font-medium">
                    {list.movies ? list.movies.length : 0} films
                  </Text>
                </View>
              </View>

              {/* List Title and Description */}
              <View className="mb-4">
                <Text className="color-white text-xl font-bold mb-2 leading-6">
                  {list.name}
                </Text>
                {list.description && (
                  <Text
                    className="color-gray-400 text-sm leading-5"
                    numberOfLines={3}
                  >
                    {list.description}
                  </Text>
                )}
              </View>

              {/* Movie Posters Grid */}
              {list.movies && list.movies.length > 0 && (
                <View className="mb-4">
                  <View className="flex-row justify-between">
                    {/* Show first 4 movies when there are more than 5 */}
                    {list.movies.length > 5 ? (
                      <>
                        {list.movies.slice(0, 4).map((mediaId) => (
                          <MovieItem key={mediaId} mediaId={mediaId} />
                        ))}
                        <View className="h-20 w-14 bg-gray-800/70 rounded-lg justify-center items-center border border-gray-700/50">
                          <Text className="color-white text-xs font-bold">
                            +{list.movies.length - 4}
                          </Text>
                          <Text className="color-gray-400 text-xs">more</Text>
                        </View>
                      </>
                    ) : (
                      /* Show all movies when 5 or less */
                      list.movies.map((mediaId) => (
                        <MovieItem key={mediaId} mediaId={mediaId} />
                      ))
                    )}
                  </View>
                </View>
              )}

              {/* Action indicator */}
              <View className="flex-row items-center justify-end">
                <Text className="color-gray-500 text-xs mr-2">View list</Text>
                <Icon name="chevron-right" size={12} color="#6B7280" />
              </View>
            </TouchableOpacity>
          ) : item.type === "review" && review ? (
            <ReviewItem key={item.id} review={review} navigation={navigation} />
          ) : null}
        </View>
      );
    },
    [navigation, lists, reviews]
  );

  const EmptyState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <View className="bg-gray-900/30 rounded-xl p-8 border border-gray-700/30 items-center">
        <Text className="color-gray-400 text-lg mb-2 font-medium">
          No lists yet
        </Text>
        <Text className="color-gray-500 text-sm text-center">
          Create your first movie list to get started
        </Text>
      </View>
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#FF5C00" />
        <Text className="color-gray-400 text-base mt-4">Loading lists...</Text>
      </View>
    );
  }

  const hasData = showcaseData.length > 0;

  return (
    <View className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FF5C00"]}
            tintColor="#FF5C00"
          />
        }
      >
        <View className="flex-1 px-5 py-4">
          {hasData ? (
            showcaseData.map((item) => (
              <View key={item.key}>{renderListItem({ item })}</View>
            ))
          ) : (
            <EmptyState />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileMain;
