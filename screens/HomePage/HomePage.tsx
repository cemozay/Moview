import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import AfisListesi from "../HomePage/Flatlist";

const { width, height } = Dimensions.get("window");

const profileImage = require("../ProfilePage/avatar.jpg"); // Profil fotoğrafı URL
const profileName = "Ranch"; // Profil adı

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.Header}>
          <View>
            <Text style={styles.hellotext}>Günaydın 👋</Text>
            <Text style={styles.profileName}>{profileName}</Text>
          </View>
          <View style={styles.profileContainer}>
            <TouchableOpacity>
              <Image source={profileImage} style={styles.profileImage} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.searchBar}>
          <View style={styles.searchContainer}>
            <FontAwesomeIcon icon={faSearch} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="gray"
            />
          </View>
        </View>
        <AfisListesi />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black", // Arka plan rengi siyah
  },
  scrollView: {
    flexGrow: 1,
  },
  Header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: height * 0.09,
    paddingHorizontal: 16,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  hellotext: {
    fontSize: 10,
    color: "white",
  },
  profileName: {
    fontSize: 20,
    color: "white",
  },
  searchBar: {
    alignItems: "center",
    justifyContent: "center", // Center vertically
    height: height * 0.07,
    backgroundColor: "black", // Dark gray background
  },
  searchContainer: {
    backgroundColor: "#333",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: width * 0.1,
    fontSize: 16,
    color: "white",
  },
  searchIcon: {
    fontSize: 20,
    color: "white",
    margin: 10,
  },
  box: {
    backgroundColor: "red", // Kutu rengi beyaz
  },
  itemHeader: {
    flexDirection: "row",
    position: "absolute",
    top: 0,
    left: 0,
    padding: 10,
  },
  itemHeadertexts: {
    flexDirection: "row",
    alignItems: "center",
  },

  itemHeadertext: {
    fontSize: 20,
    color: "white",
  },
  itemHeadertext2: {
    color: "red",
    fontSize: 12,
    marginRight: 10,
  },
});
