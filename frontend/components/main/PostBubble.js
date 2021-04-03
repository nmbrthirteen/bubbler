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

import firebase from "firebase/app";
require("firebase/firestore");

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUsersData } from "../../redux/actions/index";

function PostBubble(props) {
  const [comments, setComments] = useState([]);
  const [postId, setPostId] = useState("");
  const [text, setText] = useState("");
  const [userDetails, setUserDetails] = useState("");

  const navigation = useNavigation();
  const auth = firebase.auth();
  const fireRef = firebase
    .firestore()
    .collection("posts")
    .doc(props.route.params.uid)
    .collection("userPosts")
    .doc(props.route.params.postId)
    .collection("comments");

  const authorName =
    props.route.params.authorName +
    "'s " +
    "Post Bubble" +
    " - " +
    props.route.params.caption;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: authorName,
      headerBackTitleVisible: false,
    });
  });

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => setUserDetails(snapshot.data()));
    function matchUserToComment(comments) {
      for (let i = 0; i < comments; i++) {
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
      fireRef.orderBy("timestamp", "asc").onSnapshot((snapshot) => {
        let comment = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        matchUserToComment(comment);
      });
      setPostId(props.route.params.postId);
    } else {
      matchUserToComment(comments);
    }
    return matchUserToComment;
  }, [props.route.params.postId, props.users]);

  const onCommentSend = () => {
    Keyboard.dismiss();
    fireRef.add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      creator: firebase.auth().currentUser.uid,
      photoURL: userDetails.photoURL,
      displayName: userDetails.displayName,
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
                  {item.creator === auth.currentUser.uid ? (
                    <View style={styles.reciever}>
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
                          uri: item.photoURL,
                        }}
                      />
                      <Text style={styles.recieverText}>{item.text}</Text>
                    </View>
                  ) : (
                    <View style={styles.sender}>
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
                          uri: item.photoURL,
                        }}
                      />
                      <Text style={styles.senderName}>{item.displayName}</Text>
                      <Text style={styles.senderText}>{item.text}</Text>
                    </View>
                  )}
                </ScrollView>
              )}
            />

            <View style={styles.footer}>
              <TextInput
                style={styles.textInput}
                placeholder="say something..."
                value={text}
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
  recieverText: {
    color: "black",
    fontWeight: "500",
    marginRight: 10,
    marginTop: 5,
    marginLeft: 5,
  },
  recieverName: {
    right: 10,
    paddingLeft: 10,
    fontSize: 12,
    color: "black",
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
