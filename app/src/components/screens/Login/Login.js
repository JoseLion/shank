import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View, TextInput, TouchableHighlight, TouchableWithoutFeedback} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'
import dismissKeyboard from 'dismissKeyboard';
import Notifier from '../../../core/Notifier';


export default class LoginScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'Log In',
        headerLeft: null
    };

    constructor(props) {
        super(props);
        this._onLoginPressed = this._onLoginPressed.bind(this);
        this.state = {email: '', password: ''};
    }

    async _onLoginPressed() {
        dismissKeyboard();

        if (!this.state.email) {
            Notifier.message({title: 'Warning', message: 'Please enter your email.'});
            return;
        }

        if (!this.state.password) {
            Notifier.message({title: 'Warning', message: 'Please enter your password.'});
            return;
        }

        let email = this.state.email.toLowerCase();

        let data = {
            email: email,
            password: this.state.password,
        };

        console.log(data)
    }

    render() {
        let navigation = this.props.navigation;
        return (
            <TouchableWithoutFeedback onPress={() => dismissKeyboard()} style={{flex: 1}}>
                <View style={MainStyles.container}>
                    <Text style={MainStyles.greenMedShankFont}>
                        WELCOME BACK
                    </Text>
                    <TextInput
                        style={MainStyles.loginInput}
                        onChangeText={(email) => this.setState({email})}
                        value={this.state.email}
                        placeholder={"Email"}
                    />
                    <TextInput
                        style={MainStyles.loginInput}
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                        placeholder={"Password"}
                    />
                    <TouchableHighlight
                        onPress={this._onLoginPressed}
                        style={MainStyles.goldenShankButton}>
                        <Text style={LocalStyles.buttonText}>Log in</Text>
                    </TouchableHighlight>

                    <TouchableHighlight
                        onPress={this._handleFacebookLogin}
                        style={LocalStyles.fbButton}>
                        <Text style={LocalStyles.buttonText}>Continue with Facebook</Text>
                    </TouchableHighlight>

                    <Text style={[MainStyles.smallShankFont, MainStyles.inputTopSeparation]}>
                        Forgot my password
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
