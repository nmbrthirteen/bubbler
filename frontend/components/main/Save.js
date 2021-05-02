import React, { useState } from "react";
import { View, Text, TextInput, Image } from "react-native";
import { Button } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";

import firebase from "firebase";
require("firebase/firestore");
require("firebase/firebase-storage");

export default function Save(props) {
  const [caption, setCaption] = useState("");
  const [selectedDashboard, setSelectedDashboard] = useState("");

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
        selectedDashboard,
        caption,
        likesCount: 0,
        creation: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(function () {
        props.navigation.popToTop();
      });
  };

  return (
    <View style={{ flex: 1, margin: 10, marginTop: 20 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View>
          <TextInput
            style={{ margin: 20 }}
            placeholder="Write a Caption . . ."
            onChangeText={(caption) => setCaption(caption)}
          />
        </View>
        <Picker
          style={{
            flex: 1,
            position: "absolute",
            right: "5%",
          }}
          selectedValue={selectedDashboard}
          itemStyle={{
            width: 100,
            fontSize: 17,
          }}
          onValueChange={(itemValue) =>
            setSelectedDashboard(itemValue)
          }
        >
          <Picker.Item label="Programming" value="Programming" />
          <Picker.Item label="Travel" value="Travel" />
          <Picker.Item label="DIY" value="DIY" />
        </Picker>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Button
          title="Save"
          disabled={!caption}
          buttonStyle={{
            backgroundColor: "#39CC9E",
            borderRadius: 8,
            marginTop: 50,
            width: "100%",
          }}
          onPress={() => uploadImage()}
        />
      </View>
    </View>
  );
}
