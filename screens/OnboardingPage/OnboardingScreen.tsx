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
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const navigation = useNavigation();

  const handleDone = () => {};

  const doneButton = ({ ...props }) => {
    return (
      <TouchableOpacity style={styles.doneButton} {...props}>
        <Text>Done</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        DoneButtonComponent={doneButton}
        containerStyles={{ paddingHorizontal: 15 }}
        pages={[
          {
            backgroundColor: "#a7f3d0",
            image: (
              <View style={styles.lottie}>
                {/* <Lottie
                  source={require("../assets/Animation1.json")}
                  autoPlay
                  loop
                /> */}
              </View>
            ),
            title: "Biz",
            subtitle: "Öle",
          },
          {
            backgroundColor: "#fef3c7",
            image: (
              <View style={styles.lottie}>
                {/* <Lottie
                  source={require("../assets/Animation2.json")}
                  autoPlay
                  loop
                /> */}
              </View>
            ),
            title: "Kötüyüz",
            subtitle: "mi",
          },
          {
            backgroundColor: "#a78bfa",
            image: (
              <View style={styles.lottie}>
                {/* <Lottie
                  source={require("../assets/Animation3.json")}
                  autoPlay
                  loop
                /> */}
              </View>
            ),
            title: "Aynen",
            subtitle: "olmus?",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  lottie: {
    width: width * 0.9,
    height: width,
  },
  doneButton: {
    padding: 20,
    // backgroundColor: 'white',
    // borderTopLeftRadius: '100%',
    // borderBottomLeftRadius: '100%'
  },
});
