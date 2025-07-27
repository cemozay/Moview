import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, StatusBar } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ProfileMain from "./profile/ProfileMain";
import ProfileList from "./profile/ProfileList";
import ProfileReviews from "./profile/ProfileReviews";
import ProfileDiary from "./profile/ProfileDiary";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import useUserStore from "../utils/hooks/useUserStore";

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

  const FourthRoute = () =>
    user ? (
      <ProfileDiary user={user} route={route} navigation={navigation} />
    ) : (
      <Text>Loading...</Text>
    );

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Profile" },
    { key: "second", title: "List" },
    { key: "third", title: "Reviews" },
    { key: "fourth", title: "Diary" },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    fourth: FourthRoute,
  });

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Simple Header */}
      <View className="flex-row justify-between items-center px-6 py-4">
        <Text className="color-white text-2xl font-bold">Profile</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("ProfileAyarlar")}
          className="p-2"
          activeOpacity={0.7}
        >
          <Feather name="settings" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Profile Card */}
      <View className="px-6 mb-6">
        <View className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/50">
          <View className="flex-row items-center">
            <TouchableOpacity>
              <Image
                className="h-16 w-16 rounded-full"
                source={
                  user?.photoURL
                    ? { uri: user.photoURL }
                    : require("./avatar.jpg")
                }
              />
            </TouchableOpacity>
            <View className="ml-4 flex-1">
              <Text className="color-white text-lg font-semibold mb-2">
                {user?.displayName || "Kullanıcı"}
              </Text>
              <View className="flex-row gap-4 mb-3">
                <Text className="color-gray-400 text-sm">
                  {user?.followers || 0} Takipçi
                </Text>
                <Text className="color-gray-400 text-sm">
                  {user?.following || 0} Takip
                </Text>
              </View>
              <TouchableOpacity
                className="bg-orange-500 px-4 py-2 rounded-lg self-start"
                activeOpacity={0.8}
              >
                <Text className="text-white text-sm font-medium">Takip Et</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Navigation */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#FF5C00" }}
            style={{ backgroundColor: "transparent" }}
            activeColor={"#FF5C00"}
            inactiveColor={"#6B7280"}
            labelStyle={{ fontSize: 12, fontWeight: "500" }}
            tabStyle={{ paddingVertical: 8 }}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
