import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import firebase from "firebase";

const CustomListItem = ({ id, chatName, enterChat }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const db = firebase.firestore();

  useEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setChatMessages(snapshot.docs.map((doc) => doc.data()))
      );
    return unsubscribe;
  });

  return (
    <ListItem key={id} onPress={() => enterChat(id, chatName)} bottomDivider>
      <Avatar
        rounded
        source={{
          uri:
            chatMessages?.[0]?.photoURL ||
            "https://faculty.wharton.upenn.edu/wp-content/uploads/2016/11/F_David_Guy_IMG_0201a.jpg",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "800" }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} elipsizeMode="tall">
          {chatMessages?.[chatMessages.length-1]?.displayName}: {chatMessages?.[chatMessages.length-1]?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;

const styles = StyleSheet.create({});
