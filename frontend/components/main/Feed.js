import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  RefreshControl,
  Button,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import firebase from "firebase";
require("firebase/firestore");
import { connect } from "react-redux";

function Feed(props) {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (
      props.usersFollowingLoaded == props.following.length &&
      props.following.length !== 0
    ) {
      props.feed.sort(function (x, y) {
        return x.creation - y.creation;
      });
      setPosts(props.feed);
    }
  }, [props.usersFollowingLoaded, props.feed]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (
      props.usersFollowingLoaded == props.following.length &&
      props.following.length !== 0
    ) {
      props.feed.sort(function (x, y) {
        return x.creation - y.creation;
      });
      setPosts(props.feed);
      setRefreshing(false);
    }
  }, [refreshing, props.usersFollowingLoaded, props.feed]);

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
              <Text style={styles.displayName}>{item.user.displayName}</Text>
              <Text style={styles.caption}>{item.caption}</Text>
              <Image style={styles.image} source={{ uri: item.downloadURL }} />
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text>{item.likesCount}</Text>
                {item.currentUserLike ? (
                  <Button
                    title="Dislike"
                    onPress={() => onDislikePress(item.user.uid, item.id)}
                  />
                ) : (
                  <Button
                    title="Like"
                    onPress={() => onLikePress(item.user.uid, item.id)}
                  />
                )}
                <Text
                  onPress={() =>
                    props.navigation.navigate("Comment", {
                      postId: item.id,
                      uid: item.user.uid,
                    })
                  }
                >
                  View Comments...
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
  },
  caption: {
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
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
    margin: 5,
    marginLeft: 2,
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
