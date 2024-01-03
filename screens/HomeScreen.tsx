import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import ComingSoon from "../components/ComingSoon";
import Icon from "react-native-vector-icons/FontAwesome";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-black ">
      <ScrollView>
        <View className="flex-row justify-between items-center py-3 px-3 ">
          <View>
            <Text className="color-white text-3xl ">Moview</Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity>
              <Icon name="search" size={30} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="heart" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <ComingSoon />
      </ScrollView>
    </View>
  );
}
