import { ScrollView } from "react-native";
import React from "react";
import ActivityComponent from "../../components/ActivityComponent";
import { UserData } from "screens/ProfileScreen";

type ProfileActivityProps = {
  user: UserData;
  route: any;
  navigation: any;
};

const ProfileActivity = ({ user }: ProfileActivityProps) => {
  return (
    <ScrollView className="bg-black">
      <ActivityComponent />
      <ActivityComponent />
      <ActivityComponent />
    </ScrollView>
  );
};

export default ProfileActivity;
