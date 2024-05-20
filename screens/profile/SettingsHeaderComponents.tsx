import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { getAuth, updateProfile } from "firebase/auth";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const SettingsHeaderComponents = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || "");
      setEmail(user.email || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const updateProfileInfo = async () => {
    try {
      await updateProfile(user, {
        displayName: username,
        photoURL: photoURL,
      });

      console.log("Kullanıcı bilgileri güncellendi");
    } catch (error) {
      console.error(
        "Kullanıcı bilgileri güncellenirken bir hata oluştu:",
        error
      );
    }
  };

  return (
    <ScrollView className="bg-black py-4">
      <View className="w-screen flex-row justify-between h-12">
        <View className="flex-row items-center">
          <TouchableOpacity className=" justify-center items-center">
            <AntDesign name="left" size={26} color="white" />
          </TouchableOpacity>
          <Text className="color-white pl-3 text-2xl">Profile Settings</Text>
        </View>
        <TouchableOpacity
          className="justify-center items-center"
          onPress={updateProfileInfo}
        >
          <FontAwesome6 name="check" size={26} color="white" />
        </TouchableOpacity>
      </View>
      <ImageBackground
        className="h-64 w-screen justify-center items-center flex-1"
        source={require("../profile.jpg")}
      >
        <TouchableOpacity>
          <View className="items-center">
            <Image
              className="h-24 w-24 rounded-full"
              source={require("../avatar.jpg")}
            />
            <Text className="text-white">Resmi veya arkaplanı düzenle</Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
      <View className="py-3">
        <TextInput
          placeholder="Kullanıcı Adı"
          value={username}
          onChangeText={(text) => setUsername(text)}
          keyboardType="default"
          className="text-white py-2 border-gray-600 border-b-2"
        />
        <TextInput
          placeholder="E-posta"
          value={email}
          onChangeText={(text) => setEmail(text)}
          keyboardType="email-address"
          className="text-white py-2 border-gray-600 border-b-2"
        />
      </View>
      <View className="items-center">
        <Text className="color-white text-2xl">Featured Showcase</Text>
        <Text className="color-white text-xl">Customize your profile</Text>
      </View>
    </ScrollView>
  );
};
export default SettingsHeaderComponents;
