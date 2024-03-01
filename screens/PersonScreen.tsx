import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const PersonScreen = ({ route }) => {
  const navigation = useNavigation();
  const [personDetails, setPersonDetails] = useState(null);

  useEffect(() => {
    const { personId } = route.params;

    const fetchPersonDetails = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyM2UzY2MwNDE2ZjcwM2RmOTI1NmM1ZTgyYmEwZTVmYiIsInN1YiI6IjY1ODM2NTZhMDgzNTQ3NDRmMzNlODc5NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Nv0234eCrGmSRXSURyFUGO7uIub5OAOeCA0t9kCPLr0",
        },
      };

      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/person/${personId}?language=en-US`,
          options
        );
        const data = await response.json();
        setPersonDetails(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPersonDetails();
  }, [route.params]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={handleGoBack}>
        <View style={{ padding: 16, marginBottom: 16 }}>
          <Text style={{ color: "black" }}>Geri Dön</Text>
        </View>
      </TouchableOpacity>

      {personDetails ? (
        <>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/original${personDetails.profile_path}`,
            }}
            style={{ width: 150, height: 225, borderRadius: 8 }}
          />
          <Text style={{ color: "white", marginTop: 16, fontSize: 18 }}>
            {personDetails.name}
          </Text>
          <Text style={{ color: "gray", marginTop: 8, fontSize: 16 }}>
            {personDetails.biography}
          </Text>
        </>
      ) : (
        <Text style={{ color: "white" }}>Kişi bilgileri yükleniyor...</Text>
      )}
    </View>
  );
};

export default PersonScreen;
