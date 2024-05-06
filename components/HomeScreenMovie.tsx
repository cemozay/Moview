import { Text, ScrollView } from "react-native";
import React, { Component } from "react";

export default class Movie extends Component {
  render() {
    return (
      <ScrollView>
        <Text className="color-red-500">Movie</Text>
      </ScrollView>
    );
  }
}
