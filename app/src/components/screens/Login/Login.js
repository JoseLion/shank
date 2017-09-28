import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import Notifier from '../../../core/Notifier';
import BaseModel from '../../../core/BaseModel';
import * as Constants from '../../../core/Constans';
import Spinner from 'react-native-loading-spinner-overlay';

export default class LoginScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'LOG IN',
        headerLeft: null
    };

    constructor(props) {
        super(props);
        this._onLoginPressed = this._onLoginPressed.bind(this);
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

                <TouchableHighlight
                    onPress={this._handleFacebookLogin}
                    style={LocalStyles.fbButton}>
                    <Text style={LocalStyles.buttonText}>Continue with Facebook</Text>
                </TouchableHighlight>

                <Text style={[MainStyles.smallShankFont, MainStyles.inputTopSeparation]}>
                    Forgot my password
                </Text>
            </View>
        );
    }

    async _onLoginPressed() {

        /dismissKeyboard();/

        if (!this.state.email) {
            Notifier.message({title: 'LOGIN SESSION', message: 'Please enter your email.'});
            return;
        }

        if (!this.state.password) {
            Notifier.message({title: 'LOGIN SESSION', message: 'Please enter a password.'});
            return;
        }

        let email = this.state.email.toLowerCase();

        let data = {
            email: email,
            password: this.state.password,
        };

        this.setLoading(true);

        BaseModel.create('login', data).then((login) => {
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

    }
}