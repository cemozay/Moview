import React, { useState, useEffect } from "react";
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
import { collection, addDoc } from "firebase/firestore";
import { FirebaseDB } from "firebaseConfig";
import useUserStore from "../utils/userStore";
import CalendarPicker from "react-native-calendar-picker";
import { AirbnbRating } from "react-native-ratings";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2UzY2MwNDE2ZjcwM2RmOTI1NmM1ZTgyYmEwZTVmYiIsInN1YiI6IjY1ODM2NTZhMDgzNTQ3NDRmMzNlODc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nv0234eCrGmSRXSURyFUGO7uIub5OAOeCA0t9kCPLr0",
  },
};

type AddReviewProp = NativeStackScreenProps<InsideStackParamList, "AddReview">;

const AddReview = ({ route, navigation }: AddReviewProp) => {
  const userıd = useUserStore((state) => state.user);
  const [response, setResponseData] = useState<any>(null);
  const [puan, setPuan] = useState<number>(0); // Puan tipini değiştirdik
  const [review, setReview] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const today = new Date();
  const reviewRef = collection(FirebaseDB, "reviews");
  const { movieId } = route.params;

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        setResponseData(response);
      })
      .catch((err) => console.error(err));
  }, [movieId]);

  const addData = async () => {
    try {
      let reviewData = {
        date: selectedDate ? selectedDate.toISOString().split("T")[0] : "",
        puan: puan,
        review: review,
        movieId: movieId,
        userıd: userıd!.uid,
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
      {response && (
        <View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ justifyContent: "flex-start" }}>
              <Text style={{ color: "white", fontSize: 20 }}>
                {response.title}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{
                  color: "white",
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
                uri: `https://image.tmdb.org/t/p/original${response.poster_path}`,
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
                    response.release_date
                      ? new Date(response.release_date)
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
