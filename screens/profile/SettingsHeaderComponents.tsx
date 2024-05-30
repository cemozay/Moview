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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import * as ImagePicker from "react-native-image-picker";
import useUserStore from "utils/hooks/useUserStore";

type updateProfileInfoType = () => void;

const SettingsHeaderComponents: React.FC<{
  updateProfileInfo: updateProfileInfoType;
}> = ({ updateProfileInfo }) => {
  const { user, updateUserProfile } = useUserStore((state) => ({
    user: state.user,
    updateUserProfile: state.updateUserProfile,
  }));

  const [username, setUsername] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || "");
      setEmail(user.email || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const handleImagePick = async () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (response.didCancel || response.errorMessage) {
        console.log("Image picker cancelled or failed");
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const uri = asset.uri;

        if (uri) {
          const storage = getStorage();
          const storageRef = ref(storage, `profile_pictures/${user?.uid}.jpg`);
          const img = await fetch(uri);
          const bytes = await img.blob();

          try {
            await uploadBytes(storageRef, bytes);
            const downloadURL = await getDownloadURL(storageRef);
            setPhotoURL(downloadURL);
            await updateUserProfile({ photoURL: downloadURL });
            console.log("Profile picture updated successfully");
          } catch (error) {
            console.error("Error uploading image:", error);
          }
        }
      }
    });
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
        <TouchableOpacity onPress={handleImagePick}>
          <View className="items-center">
            <Image
              className="h-24 w-24 rounded-full"
              source={
                user?.photoURL
                  ? { uri: user.photoURL }
                  : require("../avatar.jpg")
              }
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
          editable={false}
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
