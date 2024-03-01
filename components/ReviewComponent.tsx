import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Icon from "@expo/vector-icons/FontAwesome";

export default function ReviewComponent() {
  return (
    <TouchableOpacity className="border-b-2 border-white">
      <View className="bg-black w-screen">
        <Text className="color-white py-3 pl-3 z-10 text-2xl absolute">
          JOHN WİCK: CHAPTER 4
        </Text>
        <ImageBackground
          className="bg-gradient-to-r from-indigo-500 w-screen h-80 justify-end"
          source={require("../screens/list.png")}
        >
          <Text numberOfLines={4} className="pl-3 color-white">
            It deeply upsets me that the Oscars don't have a category for
            choreography.There's a sense of wide-eyed wonder that overcomes me
            in certain moviegoing experiences that makes me feel the way I
            imagine everybody on this website felt when they first saw a
            spectacle like Star Wars as a child. As soon as that feeling It
            deeply upsets me that the Oscars don't have a category for
            choreography.
          </Text>
          <View className="justify-start item-center flex-row">
            <View className="flex-row ">
              <Image
                className="w-12 h-12 rounded-full m-4 "
                source={require("../screens/avatar.jpg")}
              />
              <View className=" my-4 ">
                <Text className="text-white text-xs">Alperen Ağırman</Text>
                <Text className="text-gray-400 text-xs">5001 folower</Text>
                <Text className="text-gray-400 text-xs">20 Hours ago</Text>
              </View>
            </View>
            <View className="flex-col justify-center px-2">
              <View className="px-3">
                <Icon name="heart" size={30} color="white" />
              </View>
              <Text className=" color-white text-xs">5001 Beğeni</Text>
            </View>
            <View className="flex-col justify-center px-2">
              <View className="px-3">
                <Icon name="heart" size={30} color="white" />
              </View>
              <Text className=" color-white text-xs">5001 Beğeni</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableOpacity>
  );
}
