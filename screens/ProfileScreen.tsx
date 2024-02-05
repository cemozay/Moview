import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import Icon from "@expo/vector-icons/FontAwesome";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { RootStackParamList } from "../navigation/AppNavigation";

type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, "Profile">;

const ProfileScreen = ({ navigation }: ProfileScreenProps) => {
  const [isFollowing, setFollowing] = useState(false);

  const handleFollowButton = () => {
    setFollowing((prevState) => !prevState);
    navigation.navigate("ProfileA");
  };

  return (
    <ScrollView
      className="flex bg-black"
      bounces={false}
      showsHorizontalScrollIndicator={false}
    >
      <StatusBar hidden />

      <ImageBackground
        className="h-72 w-screen"
        source={require("./profile.jpg")}
      >
        <View className="justify-end flex-reverse items-start flex-1">
          <View className=" flex-row">
            <TouchableOpacity>
              <Image
                className="h-24 w-24 rounded-full"
                source={require("./avatar.jpg")}
              />
            </TouchableOpacity>
            <View className=" w-screen h-28">
              <View className="flex-row">
                <View>
                  <Text className="color-white pt-4 text-xl font-bold">
                    Alperen Ağırman
                  </Text>
                  <View className="flex-row">
                    <Text className="color-white text-xs pr-4">
                      5001 Takipçi
                    </Text>
                    <Text className="color-white text-xs ">
                      5001 Takip Edilen
                    </Text>
                  </View>
                  <View className="py-2 px-4 gap-4 flex-row">
                    <Icon name="search" size={36} color="white" />
                    <Icon name="search" size={36} color="white" />
                  </View>
                </View>
                <View className="w-36 items-end px-3 py-4 ">
                  <TouchableOpacity
                    className=" bg-black w-28 h-12 justify-center items-center border-1 border-white rounded-xl"
                    style={[
                      { backgroundColor: isFollowing ? "gray" : "black" },
                    ]}
                    onPress={handleFollowButton}
                  >
                    <Text className="color-white">
                      {isFollowing ? "Takip Ediliyor" : "Takip Et"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

export default ProfileScreen;
