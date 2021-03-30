import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Button } from "react-native-elements";

import { useNavigation } from "@react-navigation/native";
import firebase from "firebase";
require("firebase/firestore");
import { connect } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

function Profile(props) {
  const [userPosts, setUserPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
    });
  });

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshing(false);
  });

  useEffect(() => {
    const { currentUser, posts } = props;
    if (props.route.params.uid === firebase.auth().currentUser.uid) {
      setUser(currentUser);
      setUserPosts(posts);
      navigation.setOptions({
        headerRight: () => (
          <MaterialCommunityIcons
            name="arrow-collapse-right"
            size={25}
            onPress={() => onLogout()}
            style={{ marginRight: 20 }}
            color="gray"
          />
        ),
      });
    } else {
      firebase
        .firestore()
        .collection("users")
        .doc(props.route.params.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setUser(snapshot.data());
          } else {
            console.log("does not exist");
          }
        });
      firebase
        .firestore()
        .collection("posts")
        .doc(props.route.params.uid)
        .collection("userPosts")
        .orderBy("creation", "desc")
        .get()
        .then((snapshot) => {
          let posts = snapshot.docs.map((doc) => {
            const data = doc.data();
            const id = doc.id;
            return { id, ...data };
          });
          setUserPosts(posts);
        });
    }

    if (props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
    onRefresh();
  }, [props.route.params.uid, props.following]);

  const onFollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({});
  };
  const onUnfollow = () => {
    firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete();
  };

  const onLogout = () => {
    firebase.auth().signOut();
  };

  if (user === null) {
    return <View />;
  }

  return (
    <SafeAreaView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.containerInfo}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Image style={styles.userImage} source={{ uri: user.photoURL }} />
          <View>
            <Text style={{ fontSize: 18, marginTop: 30, marginRight: 30 }}>
              {user.displayName}
            </Text>
            {props.route.params.uid === firebase.auth().currentUser.uid ? (
              <Text style={{ fontSize: 18, left: 0 }}>
                {firebase.auth().currentUser.email}
              </Text>
            ) : null}
          </View>
        </View>

        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            {following ? (
              <Button title="Following" onPress={() => onUnfollow()} />
            ) : (
              <Button title="Follow" onPress={() => onFollow()} />
            )}
          </View>
        ) : (
          <View>
            <Button
              title="Edit Profile"
              onPress={() => navigation.navigate("ProfileEdit")}
            />
          </View>
        )}
      </View>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={userPosts}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: item.downloadURL, cache: "force-cache" }}
              />
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
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  imageContainer: {
    flex: 1 / 3,
  },
  userImage: {
    height: 80,
    width: 80,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following: store.userState.following,
});

export default connect(mapStateToProps, null)(Profile);
