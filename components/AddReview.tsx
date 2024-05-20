import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { collection, addDoc, doc, getDoc, Timestamp } from "firebase/firestore";
import { FirebaseDB } from "firebaseConfig";
import useUserStore from "../utils/hooks/useUserStore";
import CalendarPicker from "react-native-calendar-picker";
import { AirbnbRating } from "react-native-ratings";
import { useMovieData } from "utils/hooks/useMovieData";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Icon from "@expo/vector-icons/FontAwesome";
import LinearGradient from "react-native-linear-gradient";

type AddReviewProp = NativeStackScreenProps<InsideStackParamList, "AddReview">;
type ReviewsIdProps = {
  reviewId: string | null;
};
const AddReview = ({ route, navigation }: AddReviewProp & ReviewsIdProps) => {
  const userId = useUserStore((state) => state.user);
  const [puan, setPuan] = useState(0);
  const [review, setReview] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const reviewId = route.params.reviewId;
  const today = new Date();
  const reviewRef = collection(FirebaseDB, "reviews");
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
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {movieData && (
        <View className="flex-1">
          <View>
            <ImageBackground
              style={styles.imageBackground}
              source={{
                uri: `https://image.tmdb.org/t/p/original${movieData.backdrop_path}`,
              }}
            >
              <View className=" justify-between flex-row z-10">
                <View>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className=" justify-center items-center pt-4 pl-3 "
                  >
                    <FontAwesome6 name="angle-left" size={26} color="white" />
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={addData}
                    className=" justify-center items-center pt-4 pr-3 "
                  >
                    <FontAwesome6 name="check" size={26} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
              <LinearGradient
                className="justify-end"
                colors={["rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
                style={StyleSheet.absoluteFillObject}
              >
                <View className=" flex-row  items-center justify-between ">
                  <View className="items-center m-3 pt-10">
                    <View className="m-3">
                      <Text style={{ color: "white", fontSize: 20 }}>
                        {movieData.title}
                      </Text>
                    </View>
                    <View className="m-3">
                      <AirbnbRating
                        showRating={false}
                        count={5}
                        reviews={["1", "2", "3", "4", "5"]}
                        defaultRating={puan}
                        size={16}
                        onFinishRating={(rating) => setPuan(rating)}
                      />
                    </View>
                    <View style={{ justifyContent: "flex-start" }}>
                      <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{
                          marginBottom: 10,
                          padding: 10,
                          backgroundColor: "#1E1E1E",
                          borderRadius: 30,
                          alignItems: "center",
                        }}
                      >
                        <Text style={{ color: "#FF5C00" }}>
                          {selectedDate
                            ? "Seçilen Tarih: " + formatDate(selectedDate)
                            : "Henüz Tarih Seçilmedi"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View>
                    <Image
                      className="h-48 w-36 rounded-2xl mr-3"
                      source={{
                        uri: `https://image.tmdb.org/t/p/original${movieData.poster_path}`,
                      }}
                    />
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>
          <View className="items-center">
            <View className="color-red-800 mb-2 border-neutral-800 border w-full"></View>
          </View>
          <View className="flex-row mt-2 justify-between items-center mx-3">
            <View>
              <TouchableOpacity>
                <Icon name="heart" size={30} color="white" />
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={{
                  padding: 14,
                  backgroundColor: "#1E1E1E",
                  borderRadius: 30,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#FF5C00" }}>Afişi Değiştir</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="items-center">
            <View className="color-red-800 m-2 border-neutral-800 border w-full"></View>
          </View>
          <View className="flex-1 ">
            <TextInput
              className=" mx-3"
              style={{
                color: "white",
                flex: 1,
                textAlignVertical: "top",
                fontSize: 18,
              }}
              multiline
              placeholder="İnceleme ekleyin..."
              placeholderTextColor="white"
              value={review}
              onChangeText={(text) => setReview(text)}
            />
          </View>
          <View className="items-center">
            <View className="color-red-800 m-2 border-neutral-800 border w-full"></View>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.8)",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 10,
                  width: "90%",
                }}
              >
                <CalendarPicker
                  startFromMonday={true}
                  allowRangeSelection={false}
                  minDate={
                    movieData.release_date
                      ? new Date(movieData.release_date)
                      : today
                  }
                  maxDate={today}
                  weekdays={["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"]}
                  months={[
                    "Ocak",
                    "Şubat",
                    "Mart",
                    "Nisan",
                    "Mayıs",
                    "Haziran",
                    "Temmuz",
                    "Ağustos",
                    "Eylül",
                    "Ekim",
                    "Kasım",
                    "Aralık",
                  ]}
                  todayBackgroundColor="#e6ffe6"
                  selectedDayColor="#66ff33"
                  selectedDayTextColor="#000000"
                  scaleFactor={400}
                  textStyle={{
                    fontFamily: "Cochin",
                    color: "black",
                  }}
                  nextTitleStyle={{
                    fontFamily: "Cochin",
                    paddingRight: 60,
                  }}
                  previousTitleStyle={{
                    fontFamily: "Cochin",
                    paddingLeft: 60,
                  }}
                  onDateChange={onDateChange}
                />

                <View>
                  <Button
                    title="Kapat"
                    onPress={() => setModalVisible(false)}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: { width: "100%", height: 300 },
});
export default AddReview;
