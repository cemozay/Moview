import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Onboarding from "react-native-onboarding-swiper";
import Lottie from "lottie-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { RootStackParamList } from "../navigation/AppNavigation";

type OnboardingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "Onboarding"
>;

const OnboardingScreen = ({ navigation }: OnboardingScreenProps) => {
  const handleDone = () => navigation.navigate("Login");

  const doneButton = ({ ...props }) => {
    return (
      <TouchableOpacity className="m-5" {...props}>
        <Text>Done</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <Onboarding
        skipToPage={2}
        onDone={handleDone}
        DoneButtonComponent={doneButton}
        bottomBarHighlight={false}
        pages={[
          {
            backgroundColor: "#a7f3d0",
            image: (
              <View className="w-80 h-80">
                {
                  <Lottie
                    source={require("../assets/Animation3.json")}
                    autoPlay
                    loop
                  />
                }
              </View>
            ),
            title: "Biz",
            subtitle: "Kötüyüz",
          },
          {
            backgroundColor: "#fef3c7",
            image: (
              <View className="w-80 h-80">
                {
                  <Lottie
                    source={require("../assets/Animation2.json")}
                    autoPlay
                    loop
                  />
                }
              </View>
            ),
            title: "Aynen",
            subtitle: "Öyle",
          },
          {
            backgroundColor: "#a78bfa",
            image: (
              <View className="w-80 h-80">
                {
                  <Lottie
                    source={require("../assets/Animation1.json")}
                    autoPlay
                    loop
                  />
                }
              </View>
            ),
            title: "mi",
            subtitle: "olmus?",
          },
        ]}
      />
    </View>
  );
};

export default OnboardingScreen;
