import React, { useState, useLayoutEffect, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "react-native-elements";
import firebase from "firebase/app";

export default function Search({ navigation }) {
  const [users, setUsers] = useState([]);
  const [dashboards, setDashboards] = useState([]);
  const [count, setCount] = useState(0);

  function SearchHeader() {
    return (
      <TouchableOpacity style={styles.searchStyle} activeOpacity={0.5}>
        <TextInput
          placeholder="Search..."
          onChangeText={(search) => fetchUsers(search)}
          autoFocus
          style={styles.searchInput}
        />
      </TouchableOpacity>
    );
  }

  useEffect(() => {
    setCount(1);
    setCount(0);
  });

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
    fetchDashboards(search);
  };

  const fetchDashboards = (search) => {
    firebase
      .firestore()
      .collection("dashboards")
      .where("displayName", ">=", search)
      .get()
      .then((snapshot) => {
        let dashboards = snapshot.docs.map((doc) => {
          const data = doc.data();
          const id = doc.id;
          return { id, ...data };
        });
        setDashboards(dashboards);
      });
  };

  const nav = useNavigation();

  return (
    <View style={styles.page}>
      <ScrollView>
        <FlatList
          numColumns={1}
          horizontal={false}
          ListHeaderComponent={() => (
            <View style={styles.text}>
              <Text>Users</Text>
            </View>
          )}
          data={users}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                style={styles.searchItem}
                onPress={() => nav.navigate("Profile", { uid: item.id })}
              >
                <Avatar
                  rounded
                  source={{
                    uri: item.photoURL,
                  }}
                />
                <Text>{item.displayName}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <FlatList
          numColumns={3}
          horizontal={false}
          ListHeaderComponent={() => (
            <View style={styles.text}>
              <Text>Dashboards</Text>
            </View>
          )}
          scrollEnabled={false}
          data={dashboards}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                style={styles.dashboardItem}
                onPress={() =>
                  nav.navigate("Profile", { uid: item.displayName })
                }
              >
                <Avatar
                  rounded
                  style={styles.dashboardImage}
                  source={{
                    uri: item.photoURL,
                  }}
                />
                <Text>{item.displayName}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
    borderBottomColor: "white",
    borderBottomWidth: 2,
  },
  dashboardImage: {
    width: 40,
    height: 40,
  },
  text: {
    marginLeft: 15,
    marginVertical: 10,
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderBottomColor: "#f5f5f5",
    borderBottomWidth: 2,
    padding: 20,
    overflow: "hidden",
  },
  dashboardItem: {
    flexDirection: "column",
    flexWrap: "wrap",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    marginVertical: 5,
    borderRadius: 10,
    borderBottomColor: "#f5f5f5",
    borderBottomWidth: 2,
    overflow: "hidden",
  },
  searchInput: {
    backgroundColor: "#EEEEEE",
    borderRadius: 20,
    padding: 6,
    paddingLeft: 12,
    alignItems: "center",
  },
  searchStyle: {
    ...Platform.select({
      ios: {
        height: 30,
        width: 200,
        justifyContent: "center",
      },
      android: {
        height: 32,
        width: "75%",
        marginLeft: 10,
        justifyContent: "center",
      },
      web: {
        height: 40,
        width: "100%",
        paddingTop: 5,
      },
    }),
  },
});
