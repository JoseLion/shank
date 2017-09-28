import React, {Component} from 'react';
import PropTypes from 'prop-types';
<<<<<<< HEAD
import {Button, StyleSheet, Text, View, TextInput, TouchableHighlight, TouchableWithoutFeedback} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'
import dismissKeyboard from 'dismissKeyboard';
import Notifier from '../../../core/Notifier';

=======
import {Button, StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import Notifier from '../../../core/Notifier';
import * as Constants from '../../../core/Constans';
>>>>>>> fec0137c9fe190a32df733d48a2b42746e02f2b1

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
<<<<<<< HEAD
        this.state = {email: '', password: ''};
    }

    async _onLoginPressed() {
        dismissKeyboard();
=======
        this._loginWithFacebookAsync = this._loginWithFacebookAsync.bind(this);

        this.state = {
            userName: 'Email',
            password: 'Password',
            email: 'Email',
            loading: false,
        };
    }

    setLoading(loading) {
        this.setState({loading: loading});
    }

    render() {
        let navigation = this.props.navigation;
        return (
            <View style={MainStyles.container}>
                <Spinner visible={this.state.loading}/>
                <Text style={MainStyles.greenMedShankFont}>
                    WELCOME BACK
                </Text>
                <TextInput
                    style={MainStyles.loginInput}
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                />
                <TextInput
                    style={MainStyles.loginInput}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                />
                <TouchableHighlight
                    onPress={this._onLoginPressed}
                    style={MainStyles.goldenShankButton}>
                    <Text style={LocalStyles.buttonText}>Log in</Text>
                </TouchableHighlight>
>>>>>>> fec0137c9fe190a32df733d48a2b42746e02f2b1

        if (!this.state.email) {
            Notifier.message({title: 'Warning', message: 'Please enter your email.'});
            return;
        }

        if (!this.state.password) {
            Notifier.message({title: 'Warning', message: 'Please enter your password.'});
            return;
        }

        let email = this.state.email.toLowerCase();

<<<<<<< HEAD
=======
    async _onLoginPressed() {

        /*dismissKeyboard();*/

        if (!this.state.email) {
            Notifier.message({title: 'LOGIN SESSION', message: 'Please enter your email.'});
            return;
        }

        if (!this.state.password) {
            Notifier.message({title: 'LOGIN SESSION', message: 'Please enter a password.'});
            return;
        }

        let email = this.state.email.toLowerCase();

>>>>>>> fec0137c9fe190a32df733d48a2b42746e02f2b1
        let data = {
            email: email,
            password: this.state.password,
        };
<<<<<<< HEAD

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
=======

        this.setLoading(true);

        FreeModel.create('login', data).then((login) => {
            AsyncStorage.setItem(Constants.AUTH_TOKEN, login.token, () => {
                AsyncStorage.setItem(Constants.USER_PROFILE, JSON.stringify(login.user), () => {
                    this.setLoading(false);
                    this.openHomePage();
                });
            });
        })
            .catch((error) => {
                this.setLoading(false);
                setTimeout(() => {
                    Notifier.message({title: 'ERROR', message: error});
                }, Constants.TIME_OUT_NOTIFIER);
            });
    }

    _loginWithFacebookAsync() {
>>>>>>> fec0137c9fe190a32df733d48a2b42746e02f2b1

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
