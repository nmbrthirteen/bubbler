import React, { useState } from "react";
import { View, TextInput, Image } from "react-native";
import { Button } from "react-native-elements";

import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function Save(props, { route }) {
  const [caption, setCaption] = useState("");

  const uploadImage = async () => {
    const uri = props.route.params.image;
    const childPath = `post/${
      firebase.auth().currentUser.uid
    }/${Math.random().toString(36)}`;
    console.log(childPath);

    const response = await fetch(uri);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob);

    const taskProgress = (snapshot) => {
      console.log(`transferred: ${snapshot.bytesTransferred}`);
    };

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        console.log(snapshot);
      });
    };

    const taskError = (snapshot) => {
      console.log(snapshot);
    };

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const savePostData = (downloadURL) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(firebase.auth().currentUser.uid)
      .collection("userPosts")
      .add({
        downloadURL,
        caption,
        likesCount: 0,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        props.navigation.popToTop();
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={{ margin: 20 }}
        placeholder="Write a Caption . . ."
        onChangeText={(caption) => setCaption(caption)}
      />
      <View style={{ justifyContent: "space-around", alignItems: "center" }}>
        <Button
          title="Save"
          disabled={!caption}
          buttonStyle={{
            backgroundColor: "#39CC9E",
            borderRadius: 8,
            width: "80%",
          }}
          onPress={() => uploadImage()}
        />
      </View>
    </View>
  );
}
