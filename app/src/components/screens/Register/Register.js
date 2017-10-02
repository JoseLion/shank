/**
 * Created by MnMistake on 9/24/2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    AsyncStorage,
    Button,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    Alert
} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'
import Notifier from '../../../core/Notifier';
import NoAuthModel from '../../../core/NoAuthModel';
import * as Constants from '../../../core/Constans';
import Spinner from 'react-native-loading-spinner-overlay';
import {Facebook} from 'expo';


export default class Register extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'Register',
        headerTintColor: 'white',
        headerTitleStyle: {alignSelf: 'center', color: '#fff'},
        headerStyle: {
            backgroundColor: '#556E3E'
        },
    };

    constructor(props) {
        super(props);

        this._handleNewRegistry = this._handleNewRegistry.bind(this);
        this._registerByFacebook = this._registerByFacebook.bind(this);

        this.state = {
            name: '',
            email: '',
            password: '',
            repeatedPassword: '',
            loading: false,
        };
    }

    setLoading(loading) {
        this.setState({loading: loading});
    }

    async _registerUserAsync(data) {
        await NoAuthModel.create('register', data).then((response) => {
            AsyncStorage.setItem(Constants.AUTH_TOKEN, response.token, () => {
                AsyncStorage.setItem(Constants.USER_PROFILE, JSON.stringify(response.user), () => {

                });
            });
        }).catch((error) => {
            this.setLoading(false);
            setTimeout(() => {
                console.log("error--->", error);
                Notifier.message({title: 'ERROR', message: error});
            }, Constants.TIME_OUT_NOTIFIER);
        });
    }

    _handleNewRegistry() {

        if (!this.state.name) {
            Notifier.message({title: 'Register', message: 'Please enter your Name.'});
            return;
        }

        if (!this.state.email) {
            Notifier.message({title: 'Register', message: 'Please enter your Email.'});
            return;
        }

        if (!this.state.password) {
            Notifier.message({title: 'Register', message: 'Please enter your Password.'});
            return;
        }

        if (this.state.password != this.state.repeatedPassword) {
            Notifier.message({title: 'Register', message: 'Passwords must match.'});
            return;
        }
        this.setLoading(true);

        let data = {
            name: this.state.name,
            email: this.state.email.toLowerCase(),
            password: this.state.password,
        };

        this._registerUserAsync(data).then((response) => {
            this.setLoading(false);
            this.props.navigation.dispatch({type: 'Login'});
        })
    }

    _registerByFacebook = async () => {
        try {
            const {type, token} = await Facebook.logInWithReadPermissionsAsync(
                Constants.APP_FB_ID,
                {permissions: ['public_profile', 'email', 'user_friends']}
            );

            switch (type) {
                case 'success': {
                    // Get the user's name using Facebook's Graph API
                    const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
                    const profile = await response.json();

                    console.log("all data of profile --> ", profile);
                    console.log("facebook id --> ", profile.id);

                    if (profile.email){
                        let data = {
                            name: profile.name,
                            email: profile.email,
                            password:  profile.id,
                        };

                        console.log("parse data ", data);
                        this._registerUserAsync(data).then((response) => {
                            this.props.navigation.dispatch({type: 'Login'});
                        });
                    } else {
                        Alert.alert(
                            'Cancelled!',
                            'Facebook account does not have an associated email!',
                        );
                    }
                    break;
                }
                case 'cancel': {
                    Alert.alert(
                        'Cancelled!',
                        'FB Register was cancelled!',
                    );
                    break;
                }
                default: {
                    Alert.alert(
                        'Oops!',
                        'Register failed!',
                    );
                }
            }
        } catch (e) {
            Alert.alert(
                'Oops!',
                'Register failed!',
            );
        }
    };

    render() {
        let navigation = this.props.navigation;
        return (
            <View style={MainStyles.container}>
                <Spinner visible={this.state.loading}/>
                <Text style={[MainStyles.centerText, MainStyles.greenMedShankFont]}>
                    WELCOME
                </Text>
                <Text style={[MainStyles.centerText, MainStyles.greenMedShankFont, MainStyles.inputTopSeparation]}>
                    LETS START BY CREATING {"\n"} AN ACCOUNT
                </Text>
                <TextInput
                    underlineColorAndroid="transparent"
                    style={MainStyles.loginInput}
                    onChangeText={(name) => this.setState({name})}
                    value={this.state.name}
                    placeholder={'Name'}
                />
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
                <TextInput
                    secureTextEntry={true}
                    underlineColorAndroid="transparent"
                    style={MainStyles.loginInput}
                    onChangeText={(repeatedPassword) => this.setState({repeatedPassword})}
                    value={this.state.repeatedPassword}
                    placeholder={'Repeat your password'}
                />
                <TouchableOpacity
                    onPress={() => this._handleNewRegistry()}
                    style={MainStyles.goldenShankButton}>
                    <Text style={LocalStyles.buttonText}>Register</Text>
                </TouchableOpacity>
                <TouchableHighlight
                    onPress={this._registerByFacebook}
                    style={MainStyles.fbButton}>
                    <Text style={LocalStyles.buttonText}>Register by Facebook</Text>
                </TouchableHighlight>
                <TouchableOpacity onPress={() => navigation.dispatch({type: 'Login'})}>
                    <Text
                        style={[MainStyles.centerText, MainStyles.smallShankBlackFont, MainStyles.inputTopSeparation]}>
                        I already have an account
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}