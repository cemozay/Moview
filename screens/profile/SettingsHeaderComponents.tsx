import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Modal,
} from "react-native";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FirebaseStorage } from "../../firebaseConfig";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageType, setCurrentImageType] = useState<
    "profile" | "banner"
  >("profile");

  useEffect(() => {
    if (user) {
      setUsername(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleImagePick = async (type: "profile" | "banner") => {
    setCurrentImageType(type);
    setModalVisible(true);
  };

  const handleImageSelection = async (
    response: ImagePicker.ImagePickerResponse
  ) => {
    setModalVisible(false);

    if (response.didCancel || response.errorMessage) {
      console.log("Image picker cancelled or failed");
      return;
    }

    if (response.assets && response.assets.length > 0) {
      const asset = response.assets[0];
      const uri = asset.uri;
      if (uri) {
        await uploadImage(uri, currentImageType);
      }
    }
  };

  const uploadImage = async (uri: string, type: "profile" | "banner") => {
    setIsUploading(true);
    const folder = type === "profile" ? "profile_pictures" : "profile_banners";
    const storage = FirebaseStorage;
    const storageRef = ref(storage, `${folder}/${user?.uid}.jpg`);
    const img = await fetch(uri);
    const bytes = await img.blob();

    try {
      await uploadBytes(storageRef, bytes);
      const downloadURL = await getDownloadURL(storageRef);
      await updateUserProfile(
        type === "profile" ? { photoURL: downloadURL } : {}
      );
      Alert.alert(
        "Success",
        `${
          type === "profile" ? "Profile picture" : "Background image"
        } uploaded successfully`
      );
    } catch (error: any) {
      Alert.alert("Error", "Error uploading image: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const renderModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="w-72 bg-white rounded-lg p-5 items-center">
          <Text className="text-lg mb-5">Choose Image</Text>

          <TouchableOpacity
            className="my-2 p-2 bg-black rounded w-full items-center"
            onPress={() =>
              ImagePicker.launchCamera(
                { mediaType: "photo" },
                handleImageSelection
              )
            }
          >
            <Text className="text-white text-base">Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="my-2 p-2 bg-black rounded w-full items-center"
            onPress={() => {
              ImagePicker.launchImageLibrary(
                { mediaType: "photo" },
                handleImageSelection
              );
            }}
          >
            <Text className="text-white text-base">Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="my-2 p-2 bg-black rounded w-full items-center"
            onPress={() => setModalVisible(false)}
          >
            <Text className="text-white text-base">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
        <TouchableOpacity
          className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded-full"
          onPress={() => handleImagePick("banner")}
        >
          <MaterialIcons name="edit" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="absolute bottom-[-48px] justify-center items-center"
          onPress={() => handleImagePick("profile")}
        >
          <Image
            className="h-24 w-24 rounded-full border-2 border-white"
            source={
              user?.photoURL ? { uri: user.photoURL } : require("../avatar.jpg")
            }
          />
          <View className="absolute top-0 right-0 bottom-0 left-0 justify-center items-center bg-black bg-opacity-50 rounded-full">
            <MaterialIcons
              className="absolute top-0 right-0 bg-black bg-opacity-50 p-2 rounded-full"
              name="edit"
              size={26}
              color="white"
            />
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
      {renderModal()}
    </ScrollView>
  );
};

export default SettingsHeaderComponents;
