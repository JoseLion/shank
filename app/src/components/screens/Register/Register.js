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
    TouchableOpacity
} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'
import Notifier from '../../../core/Notifier';
import NoAuthModel from '../../../core/NoAuthModel';
import * as Constants from '../../../core/Constans';
import Spinner from 'react-native-loading-spinner-overlay';


export default class Register extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'Register',
        headerTitleStyle: {alignSelf: 'center'}
    };

    constructor(props) {
        super(props);

        this._register = this._register.bind(this);
        this._handleNewRegistry = this._handleNewRegistry.bind(this);

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
        this.setLoading(true);
        NoAuthModel.create('register', data).then((response) => {
            AsyncStorage.setItem(Constants.AUTH_TOKEN, response.token, () => {
                AsyncStorage.setItem(Constants.USER_PROFILE, JSON.stringify(response.user), () => {
                    this.setLoading(false);
                    this.props.navigation.dispatch({type: 'Login'});
                    console.log("error--->", response)
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

        let data = {
            name: this.state.name,
            email: this.state.email.toLowerCase(),
            password: this.state.password,
        };

        this._registerUserAsync(data);
    }

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
                <TouchableHighlight
                    onPress={this._handleNewRegistry}
                    style={MainStyles.goldenShankButton}>
                    <Text style={LocalStyles.buttonText}>Register</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={this._register()}
                    style={MainStyles.goldenShankButton}>
                    <Text style={LocalStyles.buttonText}>Register with Facebook</Text>
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