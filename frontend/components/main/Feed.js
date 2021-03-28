import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { StatusBar } from "expo-status-bar";
import { Avatar, Button } from "react-native-elements";

import firebase from "firebase";
require("firebase/firestore");
import { connect } from "react-redux";

function Feed(props, { navigation }) {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    onRefresh();
  }, [props, { navigation }]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (
      props.usersFollowingLoaded == props.following.length &&
      props.following.length !== 0
    ) {
      props.feed.sort(function (x, y) {
        return y.creation > x.creation;
      });
      setPosts(props.feed);
      setRefreshing(false);
    }
  }, [props.usersFollowingLoaded, props.feed]);

  const onLikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .set({});
  };

  const onDislikePress = (userId, postId) => {
    firebase
      .firestore()
      .collection("posts")
      .doc(userId)
      .collection("userPosts")
      .doc(postId)
      .collection("likes")
      .doc(firebase.auth().currentUser.uid)
      .delete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={posts}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.containerImage}>
              <TouchableOpacity
                style={{ margin: 10, flexDirection: "row" }}
                onPress={() => {
                  props.navigation.navigate("Profile", {
                    uid: item.user.id,
                  });
                }}
              >
                <Avatar
                  rounded
                  source={{
                    uri: item.user.photoURL,
                  }}
                />
                <Text style={styles.displayName}>{item.user.displayName}</Text>
              </TouchableOpacity>
              <Text style={styles.caption}>{item.caption}</Text>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  marginLeft: 10,
                  alignItems: "center",
                }}
              >
                <Text>{item.likesCount}</Text>
                {item.currentUserLike ? (
                  <Button
                    icon={<AntDesign name="heart" size={20} color="#ff5a52" />}
                    buttonStyle={{ backgroundColor: "transparent" }}
                    onPress={() => onDislikePress(item.user.uid, item.id)}
                  />
                ) : (
                  <Button
                    icon={<AntDesign name="hearto" size={20} color="#000" />}
                    buttonStyle={{ backgroundColor: "transparent" }}
                    onPress={() => onLikePress(item.user.uid, item.id)}
                  />
                )}
                <Text
                  onPress={() =>
                    props.navigation.navigate("PostBubble", {
                      postId: item.id,
                      uid: item.user.uid,
                      authorName: item.user.displayName,
                      caption: item.caption,
                    })
                  }
                >
                  <MaterialCommunityIcons
                    name="account-group-outline"
                    size={24}
                    color="#000"
                  />
                </Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  displayName: {
    margin: 5,
    justifyContent: "center",
  },
  caption: {
    marginLeft: 10,
    margin: 5,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1 / 3,
    backgroundColor: "white",
    borderRadius: 9,
    margin: 2,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
    margin: 3,
    marginLeft: 5,
    borderRadius: 10,
  },
});
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  feed: store.usersState.feed,
  usersFollowingLoaded: store.usersState.usersFollowingLoaded,
});
export default connect(mapStateToProps, null)(Feed);
