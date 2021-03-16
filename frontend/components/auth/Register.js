import React, { Component } from 'react'
import { StyleSheet, View, TextInput, Button } from 'react-native'

import firebase from 'firebase'

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            displayName: '',
        }

        this.onSignUp = this.onSignUp.bind(this)
    }
    onSignUp() {
        const { email, password, displayName } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {
            firebase.firestore().collection("users")
                .doc(firebase.auth().currentUser.uid)
                .set({
                    displayName,
                    email
                })
            console.log(result)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    render() {
        return (
            <View style={{flex:1, justifyContent:"center", alignItems:"center", margin:"auto"}}>
                <TextInput 
                    placeholder="name"
                    onChangeText={(displayName) => this.setState({ displayName })}
                />
                <TextInput 
                    placeholder="email"
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput 
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />
                <Button 
                    onPress={() => this.onSignUp()}
                    title="Sign Up"
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({})
