import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ComingSoon from "../components/ComingSoon";
import Icon from "@expo/vector-icons/FontAwesome";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-black">
      <ScrollView>
        <View className="flex-row justify-between items-center py-3 px-3">
          <View>
            <Text className="color-white text-3xl">Moview</Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => navigation.navigate("SearchScreen")}
            >
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
