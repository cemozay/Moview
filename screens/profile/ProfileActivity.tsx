import { ScrollView } from "react-native";
import React from "react";
import ActivityComponent from "../../components/ActivityComponent";

const ProfileActivity = () => {
  return (
    <ScrollView className="bg-black">
      <ActivityComponent />
      <ActivityComponent />
      <ActivityComponent />
    </ScrollView>
  );
};

export default ProfileActivity;
