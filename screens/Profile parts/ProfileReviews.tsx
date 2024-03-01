import { ScrollView } from "react-native";
import React, { Component } from "react";
import ReviewComponent from "components/ReviewComponent";

export default class ProfileReviews extends Component {
  render() {
    return (
      <ScrollView className="bg-black">
        <ReviewComponent />
        <ReviewComponent />
        <ReviewComponent />
      </ScrollView>
    );
  }
}
