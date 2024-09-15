import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
  StatusBar,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ProfileMain from "./profile/ProfileMain";
import ProfileActivity from "./profile/ProfileActivity";
import ProfileList from "./profile/ProfileList";
import ProfileReviews from "./profile/ProfileReviews";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import useUserStore from "utils/hooks/useUserStore";

export interface ProfileScreenProp {
  navigation: any;
  route: any;
}

export type UserData = {
  displayName: string;
  photoURL: string;
  followers: number;
  uid: string;
  following: number;
};

const ProfileScreen: React.FC<ProfileScreenProp> = ({ navigation, route }) => {
  const { userId } = route.params || {};
  const baseUser = useUserStore((state) => state.user) as UserData;
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUser(userDoc.data() as UserData);
        } else {
          console.log("No such document!");
        }
      } else if (baseUser) {
        setUser(baseUser);
      } else {
        setUser({
          displayName: "Varsayılan Kullanıcı",
          photoURL: "https://example.com/avatar.jpg",
          followers: 0,
          following: 0,
          uid: "",
        });
      }
    };

    fetchUserData();
  }, [userId, baseUser]);

  const FirstRoute = () =>
    user ? (
      <ProfileMain user={user} route={route} navigation={navigation} />
    ) : (
      <Text>Loading...</Text>
    );
  const SecondRoute = () =>
    user ? (
      <ProfileList user={user} route={route} navigation={navigation} />
    ) : (
      <Text>Loading...</Text>
    );

  const ThirdRoute = () =>
    user ? (
      <ProfileReviews user={user} route={route} navigation={navigation} />
    ) : (
      <Text>Loading...</Text>
    );

  const FifthRoute = () =>
    user ? (
      <ProfileActivity user={user} route={route} navigation={navigation} />
    ) : (
      <Text>Loading...</Text>
    );

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Profile" },
    { key: "second", title: "List" },
    { key: "third", title: "Reviews" },
    { key: "fifth", title: "Activity" },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fifth: FifthRoute,
  });

  return (
    <SafeAreaView className="flex-1">
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
          <View className="flex-row">
            <TouchableOpacity>
              <Image
                className="h-24 w-24 rounded-full"
                source={
                  user?.photoURL
                    ? { uri: user.photoURL }
                    : require("./avatar.jpg")
                }
              />
            </TouchableOpacity>
            <View className="w-screen h-28">
              <View className="flex-row">
                <View>
                  <Text className="color-white pt-4 text-xl font-bold">
                    {user?.displayName}
                  </Text>
                  <View className="flex-row">
                    <Text className="color-white text-xs pr-4">
                      {user?.followers} Takipçi
                    </Text>
                    <Text className="color-white text-xs">
                      {user?.following} Takip Edilen
                    </Text>
                  </View>
                </View>
                <View className="w-36 items-end px-3 py-4">
                  <TouchableOpacity
                    className="bg-black w-28 h-12 justify-center items-center border-1 border-white rounded-xl"
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
            indicatorStyle={{ backgroundColor: "white" }}
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

export default ProfileScreen;
