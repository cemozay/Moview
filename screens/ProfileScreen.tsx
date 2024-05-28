import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
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
import ProfileDiary from "./profile/ProfileDiary";
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
  const baseUser = useUserStore((state) => state.user) as UserData; // Type assertion
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
        // Default user data if both userId and baseUser are null
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
        style={styles.backgroundImage}
        source={require("./profile.jpg")}
      >
        <View style={styles.settingsIconContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileAyarlar")}
          >
            <Feather name="settings" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.profileInfoContainer}>
          <View style={styles.profileHeader}>
            <TouchableOpacity>
              <Image
                style={styles.profileImage}
                source={
                  user?.photoURL
                    ? { uri: user.photoURL }
                    : require("./avatar.jpg")
                }
              />
            </TouchableOpacity>
            <View style={styles.profileDetails}>
              <View>
                <Text style={styles.userName}>{user?.displayName}</Text>
                <View style={styles.followInfo}>
                  <Text style={styles.followText}>
                    {user?.followers} Takipçi
                  </Text>
                  <Text style={styles.followText}>
                    {user?.following} Takip Edilen
                  </Text>
                </View>
              </View>
              <View style={styles.followButtonContainer}>
                <TouchableOpacity style={styles.followButton}>
                  <Text style={styles.followButtonText}>{"Takip Et"}</Text>
                </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    height: 288, // 72 * 4 (h-72 in tailwind)
    width: "100%", // w-screen in tailwind
  },
  settingsIconContainer: {
    position: "absolute",
    zIndex: 10,
    width: "100%", // w-screen in tailwind
    alignItems: "flex-end", // items-end in tailwind
    paddingRight: 8, // pr-2 in tailwind
    paddingTop: 16, // pt-4 in tailwind
  },
  profileInfoContainer: {
    flex: 1,
    justifyContent: "flex-end", // justify-end in tailwind
    alignItems: "flex-start", // items-start in tailwind
  },
  profileHeader: {
    flexDirection: "row", // flex-row in tailwind
  },
  profileImage: {
    height: 96, // h-24 in tailwind
    width: 96, // w-24 in tailwind
    borderRadius: 48, // rounded-full in tailwind
  },
  profileDetails: {
    height: 112, // h-28 in tailwind
    width: "100%", // w-screen in tailwind
    flexDirection: "row", // flex-row in tailwind
  },
  userName: {
    color: "white", // text-white in tailwind
    paddingTop: 16, // pt-4 in tailwind
    fontSize: 20, // text-xl in tailwind
    fontWeight: "bold", // font-bold in tailwind
  },
  followInfo: {
    flexDirection: "row", // flex-row in tailwind
  },
  followText: {
    color: "white", // text-white in tailwind
    fontSize: 12, // text-xs in tailwind
    paddingRight: 16, // pr-4 in tailwind
  },
  followButtonContainer: {
    width: 144, // w-36 in tailwind
    alignItems: "flex-end", // items-end in tailwind
    paddingHorizontal: 12, // px-3 in tailwind
    paddingTop: 16, // py-4 in tailwind
  },
  followButton: {
    backgroundColor: "black",
    width: 112, // w-28 in tailwind
    height: 48, // h-12 in tailwind
    justifyContent: "center", // justify-center in tailwind
    alignItems: "center", // items-center in tailwind
    borderWidth: 1, // border-1 in tailwind
    borderColor: "white", // border-white in tailwind
    borderRadius: 24, // rounded-xl in tailwind
  },
  followButtonText: {
    color: "white", // text-white in tailwind
  },
});

export default ProfileScreen;
