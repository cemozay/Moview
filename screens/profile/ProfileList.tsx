import { ScrollView } from "react-native";
import React, { Component } from "react";
import ListComp from "../../components/ListComponent";

export default class ProfileList extends Component {
  render() {
    return (
      <ScrollView className="bg-black">
        <ListComp />
        <ListComp />
        <ListComp />
      </ScrollView>
    );
  }
}
