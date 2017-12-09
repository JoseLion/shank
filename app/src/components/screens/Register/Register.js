import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage, Text, View, TextInput, TouchableHighlight, TouchableOpacity, findNodeHandle, Keyboard, Linking } from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'
import NoAuthModel from '../../../core/NoAuthModel';
import * as Constants from '../../../core/Constans';
import * as BarMessages from '../../../core/BarMessages';
import DropdownAlert from 'react-native-dropdownalert';

import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import qs from 'qs';
import { Facebook } from 'expo';

const DismissKeyboardView = Constants.DismissKeyboardHOC(View)

export default class Register extends Component {

    static propTypes = { navigation: PropTypes.object.isRequired };
    static navigationOptions = {
        title: 'Register',
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {alignSelf: 'center', color: '#FFFFFF'},
        headerStyle: { backgroundColor: '#556E3E' },
    };

    constructor(props) {
        super(props);
        console.log(':::IT\'S ON REGISTER:::');

        this._handleNewRegistry = this._handleNewRegistry.bind(this);
        this._registerByFacebook = this._registerByFacebook.bind(this);
        this._scrollToInput = this._scrollToInput.bind(this);
        this._registerUserAsync = this._registerUserAsync.bind(this);

        this.state = {
            name: '',
            email: '',
            password: '',
            repeatedPassword: '',
            loading: false,
            redirectData: null
        };
    }
    componentDidMount(){
        Linking.addEventListener('url', this._handleRedirects)
    }

    setLoading(loading) { this.setState({loading: loading}); }

    _handleRedirects = (event) => {
        let query = event.url.replace(Constants.LINKING_URI+'+', ''),
            data;
        if (query) data = qs.parse(query);
        else data = null;
        this.setState({ redirectData: data });
    }
    _scrollToInput(reactNode) { this.refs.scroll.scrollToFocusedInput(reactNode); }
    _handleNewRegistry = function(url) {

        if (!this.state.name) {
            BarMessages.showError('Please enter your Name.', this.validationMessage);
            return;
        }

        if (!this.state.email) {
            BarMessages.showError('Please enter your Email.', this.validationMessage);
            return;
        }

        if (!this.state.password) {
            BarMessages.showError('Please enter your password.', this.validationMessage);
            return;
        }

        if (this.state.password != this.state.repeatedPassword) {
            BarMessages.showError('Passwords must match.', this.validationMessage);
            return;
        }

        this.setLoading(true);
        let data = {
            name: this.state.name,
            email: this.state.email.toLowerCase(),
            password: this.state.password,
        };
        this._registerUserAsync(data, url);
    };

    _registerUserAsync = async (data, url) => {
        if (this.state.redirectData) data.tag = this.state.redirectData['tag'];
        if (url) { data.tag = url['tag'] }
        await NoAuthModel.create('register', data)
            .then((response) => {
                this.setLoading(false);
                AsyncStorage.setItem(Constants.AUTH_TOKEN, response.token, () => { });
                AsyncStorage.setItem(Constants.USER_PROFILE, JSON.stringify(response.user), () => { });
                this.props.navigation.dispatch({type: 'Main'});
            }).catch((error) => {
                this.setLoading(false);
                BarMessages.showError(error, this.validationMessage);
            });
    };

    _registerByFacebook = async () => {
        this.setLoading(true);
        try {
            const {type, token} = await Facebook.logInWithReadPermissionsAsync(Constants.APP_FB_ID, { permissions: ['public_profile', 'email', 'user_friends'] });

            switch (type) {
                case 'success': {
                    // Get the user's name using Facebook's Graph API
                    const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`);
                    const profile = await response.json();
                    console.log('FACEBOOK DATA PROFILE: ', profile);

                    if (profile.email) {
                        let data = {
                            name: profile.name,
                            email: profile.email,
                            password: profile.id,
                            fbId: profile.id,
                        };

                        console.log("parse data ", data);
                        this._registerUserAsync(data).then((response) => {
                            this.setLoading(false);
                            this.props.navigation.dispatch({type: 'Main'});
                        }).catch((error) => {
                            this.setLoading(false);
                            BarMessages.showError(error, this.validationMessage);
                        });
                    } else {
                        this.setLoading(false);
                        BarMessages.showError('Facebook account does not have an associated email!', this.validationMessage);
                    }
                    break;
                }
                case 'cancel': {
                    this.setLoading(false);
                    BarMessages.showError('Facebook register was cancelled!', this.validationMessage);
                    break;
                }
                default: {
                    this.setLoading(false);
                    BarMessages.showError('Register failed!', this.validationMessage);
                }
            }
        } catch (e) {
            this.setLoading(false);
            BarMessages.showError('Register failed!', this.validationMessage);
        }
    };

    render() {
        let navigation = this.props.navigation;
        let outerUrl = ""
        if(navigation.state.params){
            if(navigation.state.params.url){
                outerUrl = navigation.state.params.url;
            }
        }
        return (
            <View style={{flex: 1}}>
                <KeyboardAwareScrollView ref='scroll' enableOnAndroid={true} extraHeight={5} style={{backgroundColor: '#F5FCFF'}} keyboardDismissMode='interactive'>
                    <View style={[MainStyles.container]} behavior="padding">
                        <Spinner visible={this.state.loading} animation="slide"/>
                        <Text style={[MainStyles.centerText, MainStyles.greenMedShankFont, MainStyles.inputTopSeparation]}>
                            WELCOME
                        </Text>
                        <Text style={[MainStyles.centerText, MainStyles.greenMedShankFont, MainStyles.inputTopSeparation]}>
                            LETS START BY CREATING {"\n"}
                            AN ACCOUNT
                        </Text>
                        <TextInput
                            returnKeyType={"next"}
                            underlineColorAndroid="transparent"
                            style={MainStyles.loginInput}
                            onChangeText={(name) => this.setState({name})}
                            value={this.state.name}
                            placeholder={'Name'}
                            onFocus={(event) => { this._scrollToInput(findNodeHandle(event.target)) }}
                            onSubmitEditing={(event) => { this.refs.email.focus(); }}
                            ref='name' />
                        <TextInput
                            returnKeyType={"next"}
                            underlineColorAndroid="transparent"
                            style={MainStyles.loginInput}
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                            placeholder={'Email'}
                            onFocus={(event) => { this._scrollToInput(findNodeHandle(event.target)) }}
                            onSubmitEditing={(event) => { this.refs.pass1.focus(); }}
                            ref='email' />
                        <TextInput
                            returnKeyType={"next"}
                            underlineColorAndroid="transparent"
                            style={MainStyles.loginInput}
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                            placeholder={'Password'}
                            onFocus={(event) => { this._scrollToInput(findNodeHandle(event.target)) }}
                            onSubmitEditing={(event) => { this.refs.pass2.focus(); }}
                            secureTextEntry={true}
                            ref='pass1' />
                        <TextInput
                            returnKeyType={"next"}
                            underlineColorAndroid="transparent"
                            style={MainStyles.loginInput}
                            onChangeText={(repeatedPassword) => this.setState({repeatedPassword})}
                            value={this.state.repeatedPassword}
                            onFocus={(event) => { this._scrollToInput(findNodeHandle(event.target)) }}
                            onSubmitEditing={(event) => { Keyboard.dismiss() }}
                            placeholder={'Repeat your password'}
                            ref='pass2'
                            secureTextEntry={true} />

                        <TouchableOpacity onPress={() => this._handleNewRegistry(outerUrl)} style={MainStyles.goldenShankButton}>
                            <Text style={LocalStyles.buttonText}>Register</Text>
                        </TouchableOpacity>
                        <TouchableHighlight onPress={this._registerByFacebook} style={MainStyles.fbButton}>
                            <Text style={LocalStyles.buttonText}>Continue with Facebook</Text>
                        </TouchableHighlight>
                        <TouchableOpacity onPress={() => navigation.navigate('Login', {url:outerUrl})}>
                            <Text style={[MainStyles.centerText, MainStyles.medShankBlackFont, MainStyles.inputTopSeparation]}>
                                I already have an account
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
                <DropdownAlert ref={ref => this.validationMessage = ref} />
            </View>
        );
    }

}
