import React from "react";
import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { ListItem, Avatar } from "react-native-elements";

export default function Notifications({ navigation }) {
  return (
    <SafeAreaView>
      <ListItem bottomDivider>
        <Avatar
          rounded
          source={{
            uri: "./images/avatar-placeholder.png",
          }}
        />
        <ListItem.Content>
          <ListItem.Title style={{ fontWeight: "800" }}>Name</ListItem.Title>
          <ListItem.Subtitle numberOfLines={1} elipsizeMode="tall">
            Subtitle
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
