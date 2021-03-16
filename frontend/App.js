import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import React, { Component } from "react";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import * as firebase from "firebase";

import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./redux/reducers";
import thunk from "redux-thunk";

const store = createStore(rootReducer, applyMiddleware(thunk));

import LandingScreen from "./components/auth/Landing";
import LoginScreen from "./components/auth/Login";
import MainScreen from "./components/Main";
import SaveScreen from "./components/main/Save";
import AddScreen from "./components/main/Add";
import CommentScreen from "./components/main/Comment";
import RegisterScreen from "./components/auth/Register";
import ProfileScreen from "./components/main/Profile";
import NotificationsScreen from "./components/main/Notifications";
import SearchScreen from "./components/main/Search";
import ChatsScreen from "./components/main/Chats";
import CreateChatScreen from "./components/main/CreateChat";
import ChatScreen from "./components/main/Chat";

const firebaseConfig = {
  apiKey: "AIzaSyD-dx1KB4kjK9C6UcnK7jeMsPauZL9wf0I",
  authDomain: "bubbler-c.firebaseapp.com",
  projectId: "bubbler-c",
  storageBucket: "bubbler-c.appspot.com",
  messagingSenderId: "1015010137943",
  appId: "1:1015010137943:web:27b91358963c278f3c1012",
  measurementId: "G-F84T55P2DD",
};
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
  useNavigation,
} from "@react-navigation/native";
import {
  createStackNavigator,
  TransitionPresets,
  CardStyleInterpolators,
} from "@react-navigation/stack";

import LottieView from "lottie-react-native";

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super();
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        });
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        });
      }
    });
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <LottieView
            source={require("./images/animation-612.json")}
            autoPlay
            loop
          />
        </View>
      );
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen
              name="Landing"
              component={LandingScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    function ProfileHeader() {
      const nav = useNavigation();
      return (
        <TouchableOpacity
          onPress={(event) => {
            event.preventDefault(),
              nav.navigate("Profile", {
                uid: firebase.auth().currentUser.uid,
              });
          }}
        >
          <Image
            style={{ marginLeft: 15, width: 30, height: 30 }}
            source={require("./images/avatar-placeholder.png")}
          />
        </TouchableOpacity>
      );
    }
    function NotificationsHeader() {
      const nav = useNavigation();
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          style={{ marginRight: 15 }}
          onPress={() => {
            nav.navigate("Notifications", {
              uid: firebase.auth().currentUser.uid,
            });
          }}
        >
          <MaterialCommunityIcons name="bell" color="#AEAEAE" size={26} />
        </TouchableOpacity>
      );
    }

    function SearchHeader() {
      const nav = useNavigation();
      return (
        <TouchableOpacity
          style={{
            flex: 1,
            height: 20,
            width: 200,
            paddingTop: 7,
          }}
          onPress={() =>
            nav.navigate("Search", {
              uid: firebase.auth().currentUser.uid,
            })
          }
          activeOpacity={0.5}
        >
          <Text
            style={{
              color: "#AEAEAE",
              overflow: "hidden",
              padding: 6,
              borderRadius: 15,
              backgroundColor: "#EEEEEE",
              paddingLeft: 12,
              alignItems: "center",
            }}
          >
            Search..
          </Text>
        </TouchableOpacity>
      );
    }

    function CreatePostHeader() {
      const nav = useNavigation();
      return (
        <TouchableOpacity
          style={{ marginRight: 15 }}
          activeOpacity={0.5}
          onPress={() => {
            nav.navigate("CreateChat", {
              uid: firebase.auth().currentUser.uid,
            });
          }}
        >
          <MaterialCommunityIcons name="pencil" color="gray" size={26} />
        </TouchableOpacity>
      );
    }

    function getLeftHeader(route) {
      const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";

      switch (routeName) {
        case "Feed":
          return (props) => <ProfileHeader {...props} />;
        case "Chats":
          return (props) => <ProfileHeader {...props} />;
      }
    }

    function getHeaderTitle(route) {
      const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";

      switch (routeName) {
        case "Feed":
          return (props) => <SearchHeader {...props} />;
        case "Search":
          return (props) => <SearchHeader {...props} />;
        case "Chats":
          return "Chats";
      }
    }

    function getRightHeader(route) {
      const routeName = getFocusedRouteNameFromRoute(route) ?? "Feed";

      switch (routeName) {
        case "Feed":
          return (props) => <NotificationsHeader {...props} />;
        case "Chats":
          return (props) => <CreatePostHeader {...props} />;
      }
    }

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen
              name="Chats"
              component={ChatsScreen}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              navigation={this.props.navigation}
            />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="CreateChat" component={CreateChatScreen} />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen
              name="Main"
              component={MainScreen}
              options={({ route }) => ({
                headerLeft: getLeftHeader(route),
                headerTitle: getHeaderTitle(route),
                headerRight: getRightHeader(route),
                headerStyle: { backgroundColor: "#fff" },
                headerTitleStyle: { color: "black" },
                headerTintColor: "black",
              })}
            />
            <Stack.Screen
              name="Add"
              component={AddScreen}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Save"
              component={SaveScreen}
              navigation={this.props.navigation}
            />
            <Stack.Screen
              name="Comment"
              component={CommentScreen}
              navigation={this.props.navigation}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
