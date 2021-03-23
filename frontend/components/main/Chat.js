import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { Avatar } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import firebase from "firebase";
require("firebase/firestore");

const Chat = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  
  const auth = firebase.auth();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            margin: 40,
          }}
        >
          <Avatar
            rounded
            source={{ uri: "https://thispersondoesnotexist.com/image" }}
          />
          <Text style={{ marginLeft: 10 }}>{route.params.chatName}</Text>
        </View>
      ),
      headerRight: () => (
        <View>
          <TouchableOpacity style={{ marginRight: 15 }}>
            <MaterialCommunityIcons name="microphone" size={26} color="gray" />
          </TouchableOpacity>
        </View>
      ),
    });
  });

  const sendMessage = () => {
    Keyboard.dismiss();

    firebase
      .firestore()
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
      });
    setInput("");
  };

  useLayoutEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <View key={id} style={styles.reciever}>
                    <Avatar
                      position="absolute"
                      rounded
                      // WEB
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        right: -5,
                      }}
                      bottom={-15}
                      right={-5}
                      size={30}
                      source={{
                        uri: "https://thispersondoesnotexist.com/image",
                      }}
                    />
                    <Text style={styles.recieverText}>{data.message}</Text>
                  </View>
                ) : (
                  <View key={id} style={styles.sender}>
                    <Avatar
                      position="absolute"
                      rounded
                      // WEB
                      containerStyle={{
                        position: "absolute",
                        bottom: -15,
                        left: -5,
                      }}
                      bottom={-15}
                      left={-5}
                      size={30}
                      source={{
                        uri: "https://thispersondoesnotexist.com/image",
                      }}
                    />
                    <Text style={styles.senderText}>{data.message}</Text>
                    <Text style={styles.senderName}>{data.displayName}</Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                value={input}
                placeholder="Message"
                onSubmitEditing={sendMessage}
                onChangeText={(text) => setInput(text)}
                style={styles.textInput}
              />
              {!input ? (
                <TouchableOpacity>
                  <MaterialCommunityIcons
                    name="send"
                    size={26}
                    color="#ebebeb"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                  <MaterialCommunityIcons name="send" size={26} color="gray" />
                </TouchableOpacity>
              )}
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reciever: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  senderName: {
    left: 10,
    paddingRight: 10,
    fontSize: 12,
    color: "white",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "gray",
    borderRadius: 30,
  },
});
