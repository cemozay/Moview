import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import ComingSoon from "./component/ComingSoon";

const { width, height } = Dimensions.get("window");

const profileImage = require("./avatar.jpg"); // Profil fotoğrafı URL
const profileName = "Ranch"; // Profil adı

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-grow-1">
        <View className="flex-row justify-between items-center h-0.09 px-4">
          <View>
            <Text className="color-white text-4xl">Moview</Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity>
              <Image source={profileImage} className="w-10 h-10 rounded-3xl" />
              {/* iconlar koyulacak */}
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={profileImage} className="w-10 h-10 rounded-3xl" />
            </TouchableOpacity>
          </View>
        </View>
        <ComingSoon />
      </ScrollView>
    </View>
  );
}
