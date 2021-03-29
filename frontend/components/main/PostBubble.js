import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import firebase from "firebase";
require("firebase/firestore");

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions/index";

function PostBubble(props) {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");
  const navigation = useNavigation();

  const authorName =
    props.route.params.authorName +
    "'s " +
    "Post Bubble" +
    " - " +
    props.route.params.caption;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: authorName,
    });
  });

  useEffect(() => {
    function matchUserToComment(comments) {
      for (let i = 0; i < comments.length; i++) {
        if (comments[i].hasOwnProperty("user")) {
          continue;
        }
        const user = props.users.find((x) => x.uid === comments[i].creator);
        if (user == undefined) {
          props.fetchUsersData(comments[i].creator, false);
        } else {
          comments[i].user = user;
        }
      }
      setComments(comments);
    }

    if (props.route.params.postId !== postId) {
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .doc(props.route.params.postId)
        .collection("comments")
        .orderBy("timestamp", "asc")
        .get()
        .then((snapshot) => {
          let comments = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          matchUserToComment(comments);
        });
      setPostId(props.route.params.postId);
    } else {
      matchUserToComment(comments);
    }
  }, [props.route.params.postId, props.users]);

  const onCommentSend = () => {
    Keyboard.dismiss();
    firebase
      .firestore()
      .collection("posts")
      .doc(props.route.params.uid)
      .collection("userPosts")
      .doc(props.route.params.postId)
      .collection("comments")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        creator: firebase.auth().currentUser.uid,
        displayName: firebase.auth().currentUser.displayName,
        text,
      });
    setText("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={90}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <FlatList
              numColumns={1}
              horizontal={false}
              data={comments}
              renderItem={({ item }) => (
                <ScrollView style={{ margin: 15 }}>
                  {item.user !== undefined ? (
                    <Text>{item.user.displayName}</Text>
                  ) : null}
                  <Text>{item.text}</Text>
                </ScrollView>
              )}
            />

            <View style={styles.footer}>
              <TextInput
                style={styles.textInput}
                placeholder="say something..."
                onChangeText={(text) => setText(text)}
                onSubmitEditing={onCommentSend}
              />
              {!text ? (
                <TouchableOpacity>
                  <MaterialCommunityIcons
                    name="send"
                    size={26}
                    color="#f5f5f5"
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => onCommentSend()}
                  activeOpacity={0.5}
                >
                  <MaterialCommunityIcons name="send" size={26} color="gray" />
                </TouchableOpacity>
              )}
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const mapStateToProps = (store) => ({
  users: store.usersState.users,
});
const mapDispatchProps = (dispatch) =>
  bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(PostBubble);

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
    backgroundColor: "#f7f7f7",
    padding: 10,
    color: "gray",
    borderRadius: 30,
  },
});
