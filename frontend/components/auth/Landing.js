import React from "react";
import { Text, View, Image } from "react-native";
import { Button } from "react-native-elements";

export default function Landing({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <View style={{ margin: 35, bottom: "10%" }}>
        <Text
          style={{
            marginTop: 50,
            color: "#39CC9E",
            fontSize: 28,
            fontWeight: "bold",
          }}
        >
          Bubbler
        </Text>
      </View>
      <View style={{ alignItems: "center" }}>
        <Image
          style={{
            justifyContent: "center",
            width: 250,
            height: 220,
          }}
          source={require("../../images/party.png")}
        />
      </View>
      <View style={{ alignItems: "flex-start", margin: 35 }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Community Network
        </Text>
        <Text style={{ fontSize: 18 }}>
          place where people easily socialize around their interests
        </Text>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          title="Login"
          titleStyle={{ color: "#39CC9E", fontWeight: "bold" }}
          containerStyle={{
            width: "82%",
          }}
          buttonStyle={{
            marginVertical: 10,
            backgroundColor: "#EEEEEE",
            borderRadius: 5,
          }}
          onPress={() => navigation.navigate("Login")}
        />
        <Button
          title="Register"
          titleStyle={{ fontWeight: "bold" }}
          containerStyle={{
            width: "82%",
          }}
          buttonStyle={{
            backgroundColor: "#34CC9E",
            borderRadius: 5,
          }}
          onPress={() => navigation.navigate("Register")}
        />
      </View>
    </View>
  );
}
