import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { InsideStackParamList } from "navigation/InsideNavigation";

type PersonScreenProps = NativeStackScreenProps<
  InsideStackParamList,
  "PersonScreen"
>;

const PersonScreen = ({ route, navigation }: PersonScreenProps) => {
  return (
    <ScrollView className="bg-black">
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View>
          <Text className="color-white">Geri Dön</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PersonScreen;
