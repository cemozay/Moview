import { View } from "react-native";
import React from "react";
import { UserData } from "screens/ProfileScreen";

type ProfileMainProp = {
  user: UserData;
  route: any;
  navigation: any;
};

const ProfileMain = ({ user }: ProfileMainProp) => {
  return <View className="bg-black flex-1"></View>;
};

export default ProfileMain;
