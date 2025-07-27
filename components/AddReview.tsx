import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { RootStackParamList } from "navigation/InsideNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { collection, addDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { FirebaseDB } from "../firebaseConfig";
import useUserStore from "../utils/hooks/useUserStore";
import CalendarPicker from "../utils/CalendarPlaceholder";
import { AirbnbRating } from "../utils/RatingPlaceholder";
import { useMovieData } from "../utils/hooks/useMovieData";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

type AddReviewProp = NativeStackScreenProps<RootStackParamList, "AddReview">;
type ReviewsIdProps = {
  route: {
    params: {
      reviewId: string | null;
    };
  };
};
const AddReview = ({ route, navigation }: AddReviewProp & ReviewsIdProps) => {
  const userId = useUserStore((state) => state.user);
  const reviewRef = collection(FirebaseDB, "reviews");

  const [review, setReview] = useState("");
  const [puan, setPuan] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const today = new Date();

  const [modalVisible, setModalVisible] = useState(false);

  const reviewId = route.params.reviewId;
  const { movieId } = route.params;
  const movieIdString = movieId.toString();

  const apiResponse = useMovieData(movieIdString);

  useEffect(() => {
    const fetchReviewData = async () => {
      if (reviewId) {
        const reviewDocRef = doc(reviewRef, reviewId);
        const reviewDoc = await getDoc(reviewDocRef);
        if (reviewDoc.exists()) {
          const data = reviewDoc.data();
          setPuan(data.rating);
          setReview(data.text);
          setSelectedDate(data.timestamp.toDate());
        }
      }
    };

    fetchReviewData();
  }, [reviewId]);

  if (apiResponse.isError) {
    console.log("Error!");
    return null;
  } else if (apiResponse.isLoading || !apiResponse.data) {
    console.log("Loading...");
    return null;
  }

  const movieData = apiResponse.data;

  const addData = async () => {
    try {
      let reviewData = {
        timestamp: selectedDate
          ? Timestamp.fromDate(selectedDate)
          : Timestamp.now(),
        rating: puan,
        text: review,
        mediaId: movieIdString,
        userId: userId!.uid,
      };
      await addDoc(reviewRef, reviewData);
      setModalVisible(false);
      navigation.goBack();
    } catch (e) {
      alert(e);
    }
  };

  const onDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 py-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <FontAwesome6 name="angle-left" size={24} color="white" />
        </TouchableOpacity>
        <Text className="color-white text-lg font-bold">Add Review</Text>
        <TouchableOpacity onPress={addData} className="p-2">
          <FontAwesome6 name="check" size={24} color="#FF5C00" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5">
        {movieData && (
          <View className="flex-1">
            {/* Movie Info Section */}
            <View className="flex-row mb-6">
              <Image
                className="h-32 w-24 rounded-lg"
                source={{
                  uri: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
                }}
                resizeMode="cover"
              />
              <View className="flex-1 ml-4 justify-center">
                <Text
                  className="color-white text-xl font-bold mb-2"
                  numberOfLines={2}
                >
                  {movieData.title}
                </Text>
                <Text className="color-gray-400 text-sm mb-1">
                  {movieData.release_date?.toString() || "Release date TBA"}
                </Text>
                <Text className="color-gray-400 text-sm mb-3">
                  ⭐ {movieData.vote_average?.toFixed(1)}/10
                </Text>
                <View className="flex-row flex-wrap gap-1">
                  {movieData.genres?.slice(0, 2).map((genre: any) => (
                    <View
                      key={genre.id}
                      className="bg-orange-500/20 rounded px-2 py-1"
                    >
                      <Text className="color-orange-400 text-xs">
                        {genre.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Rating Section */}
            <View className="mb-6">
              <Text className="color-white text-lg font-semibold mb-3">
                Rate this movie
              </Text>
              <View className="bg-gray-900/50 rounded-xl p-4">
                <AirbnbRating
                  showRating={false}
                  count={5}
                  reviews={["1", "2", "3", "4", "5"]}
                  defaultRating={puan}
                  size={24}
                  onFinishRating={(rating: number) => setPuan(rating)}
                />
                {puan > 0 && (
                  <Text className="color-orange-400 text-center mt-2 font-medium">
                    {puan}/5 stars
                  </Text>
                )}
              </View>
            </View>

            {/* Watch Date Section */}
            <View className="mb-6">
              <Text className="color-white text-lg font-semibold mb-3">
                When did you watch it?
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="bg-gray-900/50 rounded-xl p-4 flex-row items-center"
              >
                <FontAwesome6 name="calendar-days" size={20} color="#FF5C00" />
                <Text className="color-white text-base ml-3">
                  {selectedDate
                    ? formatDate(selectedDate)
                    : "Select Watch Date"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Review Text Section */}
            <View className="mb-6">
              <Text className="color-white text-lg font-semibold mb-3">
                Write Your Review
              </Text>
              <TextInput
                className="color-white bg-gray-900/50 rounded-xl p-4"
                style={{
                  minHeight: 150,
                  textAlignVertical: "top",
                  fontSize: 16,
                  lineHeight: 24,
                }}
                multiline
                placeholder="Share your thoughts about this movie..."
                placeholderTextColor="#9CA3AF"
                value={review}
                onChangeText={(text) => setReview(text)}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Date Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/80">
          <View className="bg-white rounded-xl p-6 mx-4 w-11/12">
            <Text className="text-black text-xl font-bold text-center mb-4">
              Select Date
            </Text>
            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={false}
              minDate={
                movieData?.release_date
                  ? new Date(movieData.release_date)
                  : today
              }
              maxDate={today}
              weekdays={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
              months={[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ]}
              todayBackgroundColor="#FF5C00"
              selectedDayColor="#FF5C00"
              selectedDayTextColor="#FFFFFF"
              scaleFactor={400}
              textStyle={{
                fontFamily: "System",
                color: "black",
              }}
              nextTitleStyle={{
                fontFamily: "System",
                paddingRight: 60,
              }}
              previousTitleStyle={{
                fontFamily: "System",
                paddingLeft: 60,
              }}
              onDateChange={onDateChange}
            />
            <View className="flex-row justify-between mt-6 space-x-3">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 bg-gray-200 rounded-xl py-3"
              >
                <Text className="text-black text-center font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 bg-orange-500 rounded-xl py-3"
              >
                <Text className="text-white text-center font-medium">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddReview;
