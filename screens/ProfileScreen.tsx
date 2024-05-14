import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  StatusBar,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack/lib/typescript/src/types";
import { InsideStackParamList } from "navigation/InsideNavigation";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ProfileMain from "./profile/ProfileMain";
import ProfileActivity from "./profile/ProfileActivity";
import ProfileList from "./profile/ProfileList";
import ProfileReviews from "./profile/ProfileReviews";
import ProfileDiary from "./profile/ProfileDiary";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";

type ProfileScreenProp = NativeStackScreenProps<
  InsideStackParamList,
  "ProfileScreen"
>;
const ProfileScreen = ({ navigation }: ProfileScreenProp) => {
  const FirstRoute = () => <ProfileMain />;

  const SecondRoute = () => <ProfileList />;

  const ThirdRoute = () => <ProfileReviews />;
  const FourthRoute = () => <ProfileDiary />;

  const FifthRoute = () => <ProfileActivity />;

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Profile" },
    { key: "second", title: "List" },
    { key: "third", title: "Reviews" },
    { key: "fourth", title: "Diary" },
    { key: "fifth", title: "Activity" },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute,
    fifth: FifthRoute,
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <ImageBackground
        className="h-72 w-screen"
        source={require("./profile.jpg")}
      >
        <View className="absolute z-10 w-screen items-end pr-2 pt-4">
          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileAyarlar")}
          >
            <Feather name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>
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
                </View>
                <View className="w-36 items-end px-3 py-4 ">
                  <TouchableOpacity
                    className=" bg-black w-28 h-12 justify-center items-center border-1 border-white rounded-xl"
                    style={[{ backgroundColor: "black" }]}
                  >
                    <Text className="color-white">{"Takip Et"}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{
              backgroundColor: "white",
            }}
            style={{ backgroundColor: "black" }}
            activeColor={"white"}
            inactiveColor={"white"}
            labelStyle={{ fontSize: 12 }}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  additionalView: {
    backgroundColor: "lightgrey",
    padding: 10,
    alignItems: "center",
  },
});

export default ProfileScreen;
