import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage, Alert} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import Notifier from '../../../core/Notifier';
import NoAuthModel from '../../../core/NoAuthModel';
import * as Constants from '../../../core/Constans';
import Spinner from 'react-native-loading-spinner-overlay';
import {Facebook} from 'expo';


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

    _loginWithFacebookAsync = async () => {
        try {
            this.setLoading(true);
            const { type, token } = await Facebook.logInWithReadPermissionsAsync(
                Constants.APP_FB_ID, // Replace with your own app id in standalone app
                { permissions: ['public_profile', 'email', 'user_friends'] }
            );

            switch (type) {
                case 'success': {
                    // Get the user's name using Facebook's Graph API
                    const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
                    const profile = await response.json();
                    let data = {
                        email: profile.email,
                        password: profile.id,
                        cell_phone: '',
                        surname: profile.name,
                        name: profile.name
                    };
                    console.log("_loginWithFacebookAsync datadatadata***********")
                    console.log(data)
                    this._onLoginPressedAsync(data).then(() => {
                        this.setLoading(false);
                        this.props.navigation.dispatch({type: 'Main'});
                    });
                    break;
                }
                case 'cancel': {
                    Alert.alert(
                        'Cancelled!',
                        'FB Login was cancelled!',
                    );
                    break;
                }
                default: {
                    Alert.alert(
                        'Oops!',
                        'Login failed!',
                    );
                }
            }
            this.setLoading(false);
        } catch (e) {
            Alert.alert(
                'Oops!',
                'Login failed!',
            );
            this.setLoading(false);
        }
    };
}