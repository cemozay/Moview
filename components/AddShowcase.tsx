import React from "react";
import { SafeAreaView } from "react-native";
import SettingsHeaderComponents from "screens/profile/SettingsHeaderComponents";
import { useNavigation } from "@react-navigation/native";

const AddShowcase = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-black">
      <SettingsHeaderComponents navigation={navigation} />
    </SafeAreaView>
  );
};

export default AddShowcase;
