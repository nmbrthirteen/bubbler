import React, { Component, useEffect, useState } from "react";
import { Text, View, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomListItem from "../../components/CustomListItem.js";
import firebase from "firebase";
require("firebase/firestore");

const Chats = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("chats")
      .onSnapshot((snapshot) =>
        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, []);

  const nav = useNavigation();

  const enterChat = (id, chatName) => {
    nav.navigate("Chat", {
      id,
      chatName,
    });
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {chats.map(({ id, data: { chatName } }) => (
          <CustomListItem
            key={id}
            id={id}
            chatName={chatName}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chats;

const styles = StyleSheet.create({});
