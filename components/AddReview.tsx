import React, { useState, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { collection, addDoc } from "firebase/firestore";
import { FirebaseAuth, FirebaseDB } from "firebaseConfig";

const database = FirebaseDB;
const user = FirebaseAuth.currentUser;

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
  const [response, setResponseData] = useState(); // Buna değer atanacak
  const [date, setDate] = useState(""); // Buna değer atanacak
  const [puan, setPuan] = useState(""); // Buna değer atanacak
  const [review, setReview] = useState(""); // Buna değer atanacak

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

  const reviewRef = collection(database, "reviews");

  const addData = () => {
    try {
      let reviewData = {
        date: date,
        puan: puan,
        review: review,
        movieId: movieId,
        user: user!.uid,
      };
      addDoc(reviewRef, reviewData);
      navigation.goBack();
    } catch (e) {
      alert(e);
    }
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
              <TextInput
                style={{ color: "white", marginBottom: 10 }}
                placeholder="Tarih ekleyin..."
                placeholderTextColor="white"
                value={date}
                onChangeText={(text) => setDate(text)}
              />
              <TextInput
                style={{ color: "white", marginBottom: 10 }}
                placeholder="Puan ekleyin..."
                placeholderTextColor="white"
                value={puan}
                onChangeText={(text) => setPuan(text)}
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
            style={{ borderWidth: 2, borderColor: "white", marginBottom: 10 }}
          >
            <TextInput
              style={{ color: "white" }}
              placeholder="İnceleme ekleyin..."
              placeholderTextColor="white"
              value={review}
              onChangeText={(text) => setReview(text)}
            />
          </View>
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
