import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import firebase from "firebase";
require("firebase/firestore");

const CreateChat = ({ navigation }) => {
  const [input, setInput] = useState("");
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new Chat",
      headerBackTitle: "Chats",
    });
  });

  const makeChat = async () => {
    await firebase
      .firestore()
      .collection("chats")
      .add({
        chatName: input,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => alert(error));
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter a chat name"
        value={input}
        onSubmitEditing={makeChat}
        onChangeText={(text) => setInput(text)}
        leftIcon={
          <MaterialCommunityIcons name="wechat" color="gray" size={26} />
        }
      />
      <Button disabled={!input} onPress={makeChat} title="Create new Chat" />
    </View>
  );
};

export default CreateChat;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 30,
    height: "100%",
  },
});
