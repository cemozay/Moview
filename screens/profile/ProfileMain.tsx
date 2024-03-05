import { Text, View } from "react-native";
import React, { Component } from "react";
import LikedMovies from "./LikedMovies";

export default class ProfileMain extends Component {
  render() {
    return (
      <View>
        <Text>ProfileMain</Text>
        <LikedMovies />
      </View>
    );
  }
}
