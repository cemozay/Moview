import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
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

  const handleSkip = () => navigation.navigate("Login");

  const doneButton = ({ ...props }) => {
    return (
      <TouchableOpacity {...props}>
        <Text>Done</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <Onboarding
        onDone={handleDone}
        skipToPage={2}
        DoneButtonComponent={doneButton}
        containerStyles={{ paddingHorizontal: 15 }}
        pages={[
          {
            backgroundColor: "#a7f3d0",
            image: (
              <View className="">
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
              <View className="">
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
              <View className="bg-red">
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
