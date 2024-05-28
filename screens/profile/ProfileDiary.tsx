import { Text, View } from "react-native";
import React from "react";
import { UserData } from "screens/ProfileScreen";

type ProfileDiaryProp = {
  user: UserData;
  route: any;
  navigation: any;
};
const ProfileDiary = ({ user }: ProfileDiaryProp) => {
  return (
    <View>
      <Text>ProfileDiary</Text>
    </View>
  );
};
export default ProfileDiary;
