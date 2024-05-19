import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { FirebaseDB } from "firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { useAuthentication } from "utils/hooks/useAuthentication";
import { useMovieData } from "utils/hooks/useMovieData";
import LinearGradient from "react-native-linear-gradient";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
  const { reviewId } = route.params;
  const reviewRef = collection(FirebaseDB, "reviews");
  const [reviewData, setReviewData] = useState<ReviewData>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { user, loading } = useAuthentication();

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
    try {
      await deleteDoc(doc(reviewRef, reviewId));
      console.log("Review deleted successfully.");
      navigation.goBack();
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const formatTimestamp = (timestamp: Timestamp | undefined) => {
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

  const { date, mediaId, rating, text, userId } = reviewData || {};

  const { data: movie, isLoading, isError } = useMovieData(mediaId || "");

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

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error loading movie data</Text>;
  }

  const openBottomSheet = () => {
    bottomSheetRef.current?.expand();
  };

  return (
    <GestureHandlerRootView>
      <ScrollView className="bg-black">
        <ImageBackground
          style={styles.imageBackground}
          source={{
            uri: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
          }}
        >
          <View className=" justify-between flex-row z-10">
            <View>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className=" justify-center items-center pt-4 pl-3 "
              >
                <AntDesign name="left" size={26} color="white" />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={openBottomSheet}
                className=" justify-center items-center pt-4 pr-3 "
              >
                <Entypo name="dots-three-vertical" size={26} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          <LinearGradient
            className="justify-end"
            colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
            style={StyleSheet.absoluteFillObject}
          >
            <View className=" flex-row  items-center justify-between ">
              <View className="flex-row items-center m-3 pt-10">
                <Image
                  className="w-12 h-12 rounded-full"
                  source={require("../screens/avatar.jpg")}
                />
                <View>
                  <Text className="text-base color-white ml-1">
                    Alperen Ağırman
                  </Text>
                  <View className="flex-row items-center ml-1">
                    <Text className="text-base color-white">
                      Date: {formatTimestamp(date)}
                    </Text>
                    <Text className="text-base color-gray-500">
                      Puan: {rating}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <Image
                  className="h-48 w-36 rounded-2xl mr-3"
                  source={{
                    uri: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
                  }}
                />
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>

        <View className="m-3">
          <Text className=" color-white text-base">{text}</Text>
        </View>
        <View className="items-center">
          <View className="color-red-800 border-neutral-800 border w-11/12"></View>
        </View>
        <View>
          <View className="flex-row justify-between items-center">
            <Text className="m-3 color-white text-2xl">Comment</Text>
            <TouchableOpacity>
              <Text className="m-3 color-orange-500 text-base">See all</Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text className="color-white m-3">Yorumlar</Text>
          </View>
        </View>
        <View className="items-center">
          <View className="color-red-800 border-neutral-800 border w-11/12"></View>
        </View>
      </ScrollView>

      <BottomSheet
        enablePanDownToClose
        ref={bottomSheetRef}
        index={-1}
        snapPoints={[300, 400]}
        backgroundStyle={{ backgroundColor: "black" }}
        handleIndicatorStyle={{ backgroundColor: "white" }}
      >
        <View style={styles.bottomSheetContent}>
          <Text style={styles.bottomSheetText}>Options</Text>
          {user && user.uid === userId && (
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                navigation.navigate("AddReview", {
                  reviewId: route.params.reviewId,
                  movieId: movie.id,
                })
              }
            >
              <Text style={styles.textStyle}>Edit Review</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => bottomSheetRef.current?.close()}
          >
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  imageBackground: { width: "100%", height: 300 },
  bottomSheetContent: {
    padding: 20,
    flex: 1,
    backgroundColor: "black", // Arka plan rengini siyah yap
  },
  bottomSheetText: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#333", // Buton arka plan rengini değiştir
    marginBottom: 10,
  },
  buttonClose: {
    backgroundColor: "#555", // Kapat butonunun arka plan rengini değiştir
  },
  textStyle: {
    color: "white", // Buton metin rengini beyaz yap
    textAlign: "center",
  },
  whiteText: {
    color: "white", // Metin rengini beyaz yap
  },
  bottomSheet: { backgroundColor: "black" },
});

export default ReviewScreen;
