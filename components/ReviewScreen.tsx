import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { RootStackParamList } from "navigation/InsideNavigation";
import { FirebaseDB } from "../firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { useMovieData } from "../utils/hooks/useMovieData";
import { LinearGradient } from "expo-linear-gradient";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Icon from "@expo/vector-icons/FontAwesome";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { formatTimestamp } from "../utils/functions";
import useUserStore from "../utils/hooks/useUserStore";

type ReviewScreenProp = NativeStackScreenProps<
  RootStackParamList,
  "ReviewScreen"
>;

type ReviewsIdProps = {
  route: {
    params: {
      reviewId: string;
    };
  };
};

type ReviewData = {
  date: Timestamp;
  mediaId: string;
  rating: string;
  text: string;
  userId: string;
};

const ReviewScreen = ({
  route,
  navigation,
}: ReviewScreenProp & ReviewsIdProps) => {
  const user = useUserStore((state) => state.user);
  const { reviewId } = route.params;
  const [reviewData, setReviewData] = useState<ReviewData>();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const reviewRef = collection(FirebaseDB, "reviews");

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const reviewDocument = doc(reviewRef, reviewId);
        const reviewSnapshot = await getDoc(reviewDocument);

        if (reviewSnapshot.exists()) {
          const data = reviewSnapshot.data() as ReviewData;
          setReviewData(data);
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
    Alert.alert(
      "Delete Review",
      "Are you sure you want to delete this review?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(reviewRef, reviewId));
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting review:", error);
            }
          },
        },
      ]
    );
  };

  const { date, mediaId, rating, text, userId } = reviewData || {};

  const { data: movie, isLoading, isError } = useMovieData(mediaId || "");

  if (isLoading) {
    return (
      <SafeAreaView className="bg-black flex-1 justify-center items-center">
        <Text className="color-white text-lg">Loading...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !movie) {
    return (
      <SafeAreaView className="bg-black flex-1 justify-center items-center">
        <Text className="color-white text-lg">Error loading movie data</Text>
      </SafeAreaView>
    );
  }

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <GestureHandlerRootView className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header with backdrop */}
          <View className="relative">
            <ImageBackground
              style={{ width: "100%", height: 350 }}
              resizeMode="cover"
              source={{
                uri: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
              }}
            >
              <LinearGradient
                colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.9)"]}
                style={StyleSheet.absoluteFillObject}
              />

              {/* Navigation */}
              <View className="flex-row justify-between px-4 pt-12">
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className="bg-black/50 rounded-full p-2"
                >
                  <AntDesign name="left" size={24} color="white" />
                </TouchableOpacity>
                {user && user.uid === userId && (
                  <TouchableOpacity
                    onPress={openBottomSheet}
                    className="bg-black/50 rounded-full p-2"
                  >
                    <Icon name="ellipsis-h" size={20} color="white" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Movie & Review Info */}
              <View className="absolute bottom-6 left-4 right-4">
                <View className="flex-row">
                  <Image
                    className="h-32 w-24 rounded-lg mr-4"
                    source={{
                      uri: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
                    }}
                  />
                  <View className="flex-1 justify-end">
                    <Text className="color-white text-xl font-bold mb-2">
                      {movie.title}
                    </Text>
                    <View className="flex-row items-center mb-3">
                      <Image
                        className="w-8 h-8 rounded-full mr-3"
                        source={require("../screens/avatar.jpg")}
                      />
                      <View>
                        <Text className="color-white text-base font-medium">
                          {user?.displayName || "Anonymous User"}
                        </Text>
                        <Text className="color-gray-400 text-sm">
                          {formatTimestamp(date)}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center">
                      <View className="bg-orange-500/20 rounded px-2 py-1">
                        <Text className="color-orange-400 text-sm font-medium">
                          ⭐ {rating}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* Review Content */}
          <View className="px-4 py-6">
            <View className="bg-gray-900/40 rounded-lg p-4 mb-6">
              <Text className="color-gray-200 text-base leading-6">{text}</Text>
            </View>

            {/* Comments Section */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="color-white text-xl font-bold">Comments</Text>
                <TouchableOpacity>
                  <Text className="color-orange-400 text-sm">See all</Text>
                </TouchableOpacity>
              </View>

              <View className="bg-gray-900/40 rounded-lg p-4">
                <Text className="color-gray-400 text-center text-base">
                  No comments yet
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Sheet */}
        <BottomSheet
          enablePanDownToClose
          ref={bottomSheetRef}
          index={-1}
          snapPoints={[250]}
          backgroundStyle={{ backgroundColor: "#1a1a1a" }}
          handleIndicatorStyle={{ backgroundColor: "white" }}
        >
          <View className="p-6">
            <Text className="color-white text-lg font-bold mb-6 text-center">
              Review Options
            </Text>

            <TouchableOpacity
              className="bg-orange-500/20 rounded-lg p-4 mb-3"
              onPress={() => {
                bottomSheetRef.current?.close();
                navigation.navigate("AddReview", {
                  reviewId: route.params.reviewId,
                  movieId: movie.id.toString(),
                });
              }}
            >
              <View className="flex-row items-center justify-center">
                <FontAwesome6 name="pen" size={16} color="#FF5C00" />
                <Text className="color-orange-400 text-base font-medium ml-2">
                  Edit Review
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-red-500/20 rounded-lg p-4"
              onPress={() => {
                bottomSheetRef.current?.close();
                handleDeleteReview();
              }}
            >
              <View className="flex-row items-center justify-center">
                <FontAwesome6 name="trash" size={16} color="#ef4444" />
                <Text className="color-red-400 text-base font-medium ml-2">
                  Delete Review
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default ReviewScreen;
