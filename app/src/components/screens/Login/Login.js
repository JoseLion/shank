import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import Notifier from '../../../core/Notifier';
import NoAuthModel from '../../../core/NoAuthModel';
import * as Constants from '../../../core/Constans';
import Spinner from 'react-native-loading-spinner-overlay';

const FBSDK = require('react-native-fbsdk');
const {
    LoginButton,
} = FBSDK;

export default class LoginScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'LOG IN',
        headerTintColor: 'white',
        headerTitleStyle: {alignSelf: 'center', color: '#fff'},
        headerStyle: {
            backgroundColor: '#556E3E'
        },
    };

    constructor(props) {
        super(props);
        this._onLoginPressed = this._onLoginPressed.bind(this);
        this._loginWithFacebookAsync = this._loginWithFacebookAsync.bind(this);

        this.state = {
            userName: '',
            password: '',
            email: '',
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
                    underlineColorAndroid="transparent"
                    style={MainStyles.loginInput}
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email}
                    placeholder={'Email'}
                />
                <TextInput
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"
                    style={MainStyles.loginInput}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    placeholder={'Password'}
                />
                <TouchableHighlight
                    onPress={this._onLoginPressed}
                    style={MainStyles.goldenShankButton}>
                    <Text style={LocalStyles.buttonText}>Log in</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={this._loginWithFacebookAsync}
                    style={MainStyles.fbButton}>
                    <Text style={LocalStyles.buttonText}>Continue with Facebook</Text>
                </TouchableHighlight>

                <View>
                    <LoginButton
                        publishPermissions={["publish_actions"]}
                        onLoginFinished={
                            (error, result) => {
                                if (error) {
                                    alert("Login failed with error: " + result.error);
                                } else if (result.isCancelled) {
                                    alert("Login was cancelled");
                                } else {
                                    alert("Login was successful with permissions: " + result.grantedPermissions)
                                }
                            }
                        }
                        onLogoutFinished={() => alert("User logged out")}/>
                </View>


                <Text style={[MainStyles.smallShankFont, MainStyles.inputTopSeparation]}>
                    Forgot my password
                </Text>
            </View>
        );
    }

    _onLoginPressed() {
        //dismissKeyboard();/

        if (!this.state.email) {
            Notifier.message({title: 'LOGIN SESSION', message: 'Please enter your email.'});
            return;
        }
        if (!this.state.password) {
            Notifier.message({title: 'LOGIN SESSION', message: 'Please enter a password.'});
            return;
        }
        this.setLoading(true);
        let email = this.state.email.toLowerCase();
        let data = {
            email: email,
            password: this.state.password,
        };
        this._onLoginPressedAsync(data).then((response) => {
            this.setLoading(false);
            this.props.navigation.dispatch({type: 'Main'});
        })
    }

    async _onLoginPressedAsync(data) {
        await NoAuthModel.create('login', data).then((login) => {
            AsyncStorage.setItem(Constants.AUTH_TOKEN, login.token, () => {
                AsyncStorage.setItem(Constants.USER_PROFILE, JSON.stringify(login.user), () => {
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

    async _loginWithFacebookAsync() {

    }
}