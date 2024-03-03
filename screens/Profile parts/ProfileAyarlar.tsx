/*
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ImageBackground,
  Image,
  Button,
} from "react-native";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref, putFile, getDownloadURL } from "firebase/storage";
import ImagePicker from "react-native-image-picker";

const ProfileSettings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

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
      await updateProfile(auth.currentUser, {
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

  const selectImage = () => {
    const options = {
      title: "Resim Seç",
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.uri) {
        setSelectedImage(response);
      }
    });
  };

  const uploadImage = async () => {
    if (selectedImage) {
      const storageRef = ref(getStorage(), `profileImages/${user.uid}`);
      await putFile(storageRef, selectedImage.uri);
      const downloadURL = await getDownloadURL(storageRef);
      setPhotoURL(downloadURL);
    }
  };

  return (
    <View>
      <Text>Ayarlar</Text>

      <View>
        <Image
          source={{
            uri:
              selectedImage && selectedImage.uri ? selectedImage.uri : photoURL,
          }}
          style={{ width: 100, height: 100 }}
        />

        <Text className="color-red-500" onPress={selectImage}>
          Resmi seç
        </Text>
      </View>

      <TextInput
        placeholder="Kullanıcı Adı"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        placeholder="E-posta"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />

      <Button title="Bilgileri Güncelle" onPress={updateProfileInfo} />
      <Button title="Resmi Yükle" onPress={uploadImage} />
    </View>
  );
};

export default ProfileSettings;
*/
