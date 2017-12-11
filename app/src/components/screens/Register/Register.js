// React components:
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AsyncStorage, Text, View, TextInput, TouchableHighlight, TouchableOpacity, findNodeHandle, Keyboard, Linking } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';

// Third party components:
import qs from 'qs';
import { Facebook } from 'expo';

// Shank components:
import NoAuthModel from '../../../core/NoAuthModel';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import * as Constants from '../../../core/Constants';
import * as BarMessages from '../../../core/BarMessages';

const DismissKeyboardView = Constants.DismissKeyboardHOC(View);
export default class Register extends Component {

    static propTypes = { navigation: PropTypes.object.isRequired };
    static navigationOptions = {
        title: 'SIGN UP',
        headerTintColor: Constants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: Constants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: Constants.PRIMARY_COLOR },
        headerRight: (<View></View>)
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
                <KeyboardAwareScrollView ref='scroll' enableOnAndroid={true} extraHeight={10} keyboardDismissMode='interactive' style={MainStyles.background}>
                    <View style={[MainStyles.container]} behavior="padding">
                        <Spinner visible={this.state.loading} animation="slide"/>
                        <Text style={[MainStyles.centerText, LocalStyles.contentColor, LocalStyles.subtitlePage]}>
                            WELCOME TO SHANK
                        </Text>
                        <Text style={[MainStyles.centerText, LocalStyles.contentColor, LocalStyles.descriptionPage]}>
                            LET{"\'"}S START BY CREATING AN ACCOUNT
                        </Text>
                        <View style={[LocalStyles.formContainer]}>
                            <TextInput
                                returnKeyType={"next"}
                                underlineColorAndroid="transparent"
                                style={[MainStyles.formInput]}
                                onChangeText={(name) => this.setState({name})}
                                value={this.state.name}
                                placeholder={'Name'}
                                onFocus={(event) => { this._scrollToInput(findNodeHandle(event.target)) }}
                                onSubmitEditing={(event) => { this.refs.email.focus(); }}
                                ref='name' />
                            <TextInput
                                returnKeyType={"next"}
                                underlineColorAndroid="transparent"
                                style={MainStyles.formInput}
                                onChangeText={(email) => this.setState({email})}
                                value={this.state.email}
                                placeholder={'Email'}
                                onFocus={(event) => { this._scrollToInput(findNodeHandle(event.target)) }}
                                onSubmitEditing={(event) => { this.refs.pass1.focus(); }}
                                ref='email' />
                            <TextInput
                                returnKeyType={"next"}
                                underlineColorAndroid="transparent"
                                style={MainStyles.formInput}
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
                                style={MainStyles.formInput}
                                onChangeText={(repeatedPassword) => this.setState({repeatedPassword})}
                                value={this.state.repeatedPassword}
                                onFocus={(event) => { this._scrollToInput(findNodeHandle(event.target)) }}
                                onSubmitEditing={(event) => { Keyboard.dismiss() }}
                                placeholder={'Repeat your password'}
                                ref='pass2'
                                secureTextEntry={true} />

                            <TouchableOpacity style={[MainStyles.button, MainStyles.success]} onPress={() => this._handleNewRegistry(outerUrl)}>
                                <Text style={MainStyles.buttonText}>Register</Text>
                            </TouchableOpacity>

                            <TouchableHighlight style={[MainStyles.button, MainStyles.facebook]} onPress={this._registerByFacebook}>
                                <Text style={MainStyles.buttonText}>Continue with Facebook</Text>
                            </TouchableHighlight>

                            <TouchableOpacity style={MainStyles.buttonLink} onPress={() => navigation.navigate('Login', {url:outerUrl})}>
                                <Text style={[MainStyles.buttonLinkText, LocalStyles.buttonLinkText]}>
                                    I already have an account
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <DropdownAlert ref={ref => this.validationMessage = ref} />
            </View>
        );
    }

}
