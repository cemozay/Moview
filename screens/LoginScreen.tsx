import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { RootStackParamList } from "../navigation/AppNavigation";

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "kullanici" && password === "sifre") {
      navigation.navigate("Home");
    } else {
      alert("Hatalı kullanıcı adı veya şifre.");
    }
  };

  const backgroundImage = require("./profile.jpg");

  return (
    <View className="flex-1">
      <View className="w-scren h-1/3">
        <ImageBackground className="w-full h-full" source={backgroundImage} />
      </View>
      <View className="flex-1 bg-white rounded p-10">
        <Text className="mb-2">Kullanıcı Adı:</Text>
        <TextInput
          className="h-10 border-gray-500 border mb-4 pl-2"
          onChangeText={(text) => setUsername(text)}
          value={username}
        />
        <Text className="mb-2">Şifre:</Text>
        <TextInput
          className="h-10 border-gray-500 border mb-4 pl-2"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
        />
        <Button title="Giriş Yap" onPress={handleLogin} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 16,
  },
});

export default LoginScreen;
