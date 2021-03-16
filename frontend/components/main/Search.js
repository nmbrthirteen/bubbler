import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import firebase from "firebase";
require("firebase/firestore");

export default function Search({ navigation }, props) {
  const [users, setUsers] = useState([]);

  function SearchHeader() {
    return (
      <TouchableOpacity
        style={{ flex: 1, height: 20, width: 200, paddingTop: 7 }}
        activeOpacity={0.5}
      >
        <TextInput
          placeholder="Search..."
          onChangeText={(search) => fetchUsers(search)}
          autoFocus
          style={{
            backgroundColor: "#EEEEEE",
            borderRadius: 20,
            padding: 6,
            paddingLeft: 12,
            alignItems: "center",
          }}
        />
      </TouchableOpacity>
    );
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <SearchHeader />,
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  const fetchUsers = (search) => {
    firebase
      .firestore()
      .collection("users")
      .where("displayName", ">=", search)
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setUsers(users);
      });
  };
  const nav = useNavigation();
  return (
    <View>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={users}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              padding: 20,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              overflow: "hidden",
            }}
            onPress={() => nav.navigate("Profile", { uid: item.id })}
          >
            <Avatar
              rounded
              source={{
                uri: "https://thispersondoesnotexist.com/image",
              }}
            />
            <Text>{item.displayName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
