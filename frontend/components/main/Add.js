import React, { useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function Add({ navigation }) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [saveImageOpacity, setSaveImageOpacity] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Add Photo",
      headerBackTitleVisible: false,
    });
  });
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");

      const galleryStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync({
        quality: 0.1,
      });
      setImage(data.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    } else {
      setImage(result.uri);
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={(ref) => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={"1:1"}
        />
        <MaterialIcons
          name="flip-camera-ios"
          size={26}
          color="white"
          style={{
            position: "absolute",
            bottom: "25%",
            left: "5%",
          }}
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        />
        <MaterialIcons
          name="insert-photo"
          size={26}
          color="white"
          style={{
            position: "absolute",
            bottom: "25%",
            right: "5%",
          }}
          onPress={() => pickImage()}
        />
      </View>
      <TouchableOpacity
        onPress={() => takePicture()}
        onPressIn={() => setSaveImageOpacity(1)}
        style={styles.takePicture}
      ></TouchableOpacity>
      <View
        style={{
          position: "absolute",
          bottom: "13%",
          right: "3%",
          alignItems: "center",
          opacity: saveImageOpacity,
        }}
      >
        <Image source={{ uri: image }} style={styles.image} />
        <MaterialIcons
          name="send"
          color="#39CC9E"
          size={26}
          style={{ margin: 5 }}
          onPress={() => navigation.navigate("Save", { image })}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 8,
  },
  takePicture: {
    marginLeft: "40%",
    marginBottom: "15%",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#bbb",
    borderWidth: 2,
    borderRadius: 100,
    backgroundColor: "#ccc",
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});
