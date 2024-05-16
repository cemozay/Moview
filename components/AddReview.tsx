import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Modal,
  Button,
} from "react-native";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { FirebaseDB } from "firebaseConfig";
import useUserStore from "../utils/hooks/useUserStore";
import CalendarPicker from "react-native-calendar-picker";
import { AirbnbRating } from "react-native-ratings";
import { useMovieData } from "utils/hooks/useMovieData";

type AddReviewProp = NativeStackScreenProps<InsideStackParamList, "AddReview">;

const AddReview = ({ route, navigation }: AddReviewProp) => {
  const userId = useUserStore((state) => state.user);
  const [puan, setPuan] = useState(0);
  const [review, setReview] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const today = new Date();
  const reviewRef = collection(FirebaseDB, "reviews");
  const { movieId } = route.params;

  const apiResponse = useMovieData(movieId);

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
        mediaId: movieId,
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

  return (
    <View style={{ flex: 1, backgroundColor: "black", padding: 20 }}>
      {movieData && (
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ justifyContent: "flex-start" }}>
              <Text style={{ color: "white", fontSize: 20 }}>
                {movieData.title}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                  marginBottom: 10,
                  padding: 10,
                  backgroundColor: "blue",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white" }}>
                  {selectedDate
                    ? "Seçilen Tarih:" +
                      selectedDate.toISOString().split("T")[0]
                    : "Henüz Tarih Seçilmedi"}
                </Text>
              </TouchableOpacity>
              <AirbnbRating
                showRating
                count={10}
                reviews={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
                defaultRating={0}
                size={20}
                onFinishRating={(rating) => setPuan(rating)}
              />
            </View>
            <Image
              style={{ width: 150, height: 200 }}
              source={{
                uri: `https://image.tmdb.org/t/p/original${movieData.poster_path}`,
              }}
            />
          </View>
          <View
            style={{
              borderWidth: 2,
              borderColor: "white",
              marginBottom: 10,
            }}
          >
            <TextInput
              style={{ color: "white" }}
              placeholder="İnceleme ekleyin..."
              placeholderTextColor="white"
              value={review}
              onChangeText={(text) => setReview(text)}
            />
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
          <TouchableOpacity
            style={{
              backgroundColor: "blue",
              padding: 10,
              alignItems: "center",
            }}
            onPress={addData}
          >
            <Text style={{ color: "white" }}>İnceleme Ekle</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AddReview;
