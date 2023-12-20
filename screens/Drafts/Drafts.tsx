import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Drafts = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.text}>Merhaba, React Native!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red", // Arka plan rengi siyah
  },
  box: {
    backgroundColor: "white", // Kutu rengi beyaz
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black", // Metin rengi siyah
  },
});

export default Drafts;
