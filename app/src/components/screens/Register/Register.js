/**
 * Created by MnMistake on 9/24/2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    AsyncStorage,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
    findNodeHandle,
    Keyboard,
    Linking
} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'
import Notifier from '../../../core/Notifier';
import NoAuthModel from '../../../core/NoAuthModel';
import * as Constants from '../../../core/Constans';
import Spinner from 'react-native-loading-spinner-overlay';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import qs from 'qs';
import {Facebook} from 'expo';


const DismissKeyboardView = Constants.DismissKeyboardHOC(View)

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
        this._scrollToInput = this._scrollToInput.bind(this);
        this._registerUserAsync = this._registerUserAsync.bind(this);

        this.state = {
            name: '',
            email: '',
            password: '',
            repeatedPassword: '',
            loading: false,
            redirectData:null
        };
    }

    _handleRedirects = (event) => {
        let query = event.url.replace(Constants.LINKING_URI+'+', '');
        let data;
        if (query) {
            data = qs.parse(query);
        } else {
            data = null;
        }
        console.log("_handleRedirects from addEventListener")
        console.log(data)
        this.setState({ redirectData: data });
    }

    componentDidMount(){
        Linking.addEventListener('url', this._handleRedirects)
    }

    setLoading(loading) {
        this.setState({loading: loading});
    }

    async _registerUserAsync(data,url) {
        if (this.state.redirectData) {
            data.tag = this.state.redirectData['tag']
        }
        console.log("this p[rops")
        console.log(this.props)
        console.log("register this.props.navigation")
        console.log(this.props.navigation)

        if (url) {
            data.tag = url['tag']
        }

        await NoAuthModel.create('register', data).then((response) => {
            console.log('response from uxsssssdsds')
            console.log(response)
            AsyncStorage.setItem(Constants.AUTH_TOKEN, response.token, () => {
                AsyncStorage.setItem(Constants.USER_PROFILE, JSON.stringify(response.user), () => {

                });
            });
        }).catch((error) => {
            this.setLoading(false);
            console.log("error--->", error);
            Notifier.message({title: 'ERROR', message: error});
        });
    }

    _scrollToInput(reactNode) {
        this.refs.scroll.scrollToFocusedInput(reactNode)
    }

    _handleNewRegistry(url) {

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

        this._registerUserAsync(data,url).then((response) => {
            this.setLoading(false);
            this.props.navigation.dispatch({type: 'Main'});
        })
    }

    _registerByFacebook = async () => {
        this.setLoading(true);
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
                        })
                    } else {
                        this.setLoading(false);
                        Alert.alert(
                            'Cancelled!',
                            'Facebook account does not have an associated email!',
                        );
                    }
                    break;
                }
                case 'cancel': {
                    this.setLoading(false);
                    Alert.alert(
                        'Cancelled!',
                        'FB Register was cancelled!',
                    );
                    break;
                }
                default: {
                    this.setLoading(false);
                    Alert.alert(
                        'Oops!',
                        'Register failed!',
                    );
                }
            }
        } catch (e) {
            this.setLoading(false);
            Alert.alert(
                'Oops!',
                'Register failed!',
            );
        }
    };

    render() {
        let navigation = this.props.navigation;
        let outerUrl = ""
        if(navigation.state.params){
            if(navigation.state.params.url){
                outerUrl = navigation.state.params.url
            }
        }
        return (
            <KeyboardAwareScrollView ref='scroll' enableOnAndroid={true} extraHeight={5} style={{backgroundColor: '#F5FCFF'}}>
                <View style={[MainStyles.container]} behavior="padding">
                    <Spinner visible={this.state.loading} animation="slide"/>
                    <Text style={[MainStyles.centerText, MainStyles.greenMedShankFont, MainStyles.inputTopSeparation]}>
                        WELCOME
                    </Text>
                    <Text
                        style={[MainStyles.centerText, MainStyles.greenMedShankFont, MainStyles.inputTopSeparation]}>
                        LETS START BY CREATING {"\n"} AN ACCOUNT
                    </Text>
                    <TextInput
                        returnKeyType={"next"}
                        underlineColorAndroid="transparent"
                        style={MainStyles.loginInput}
                        onChangeText={(name) => this.setState({name})}
                        value={this.state.name}
                        placeholder={'Name'}
                        onFocus={(event) => {
                            this._scrollToInput(findNodeHandle(event.target))
                        }}
                        onSubmitEditing={(event) => {
                            this.refs.email.focus();
                        }}
                    />
                    <TextInput
                        ref='email'
                        underlineColorAndroid="transparent"
                        returnKeyType={"next"}
                        style={MainStyles.loginInput}
                        onChangeText={(email) => this.setState({email})}
                        value={this.state.email}
                        placeholder={'Email'}
                        onFocus={(event) => {
                            this._scrollToInput(findNodeHandle(event.target))
                        }}
                        onSubmitEditing={(event) => {
                            this.refs.pass1.focus();
                        }}
                    />
                    <TextInput
                        ref='pass1'
                        secureTextEntry={true}
                        returnKeyType={"next"}
                        underlineColorAndroid="transparent"
                        style={MainStyles.loginInput}
                        onChangeText={(password) => this.setState({password})}
                        value={this.state.password}
                        placeholder={'Password'}
                        onFocus={(event) => {
                            this._scrollToInput(findNodeHandle(event.target))
                        }}
                        onSubmitEditing={(event) => {
                            this.refs.pass2.focus();
                        }}
                    />
                    <TextInput
                        ref='pass2'
                        secureTextEntry={true}
                        returnKeyType={"next"}
                        underlineColorAndroid="transparent"
                        style={MainStyles.loginInput}
                        onChangeText={(repeatedPassword) => this.setState({repeatedPassword})}
                        value={this.state.repeatedPassword}
                        onFocus={(event) => {
                            this._scrollToInput(findNodeHandle(event.target))
                        }}
                        onSubmitEditing={(event) => {
                            Keyboard.dismiss()
                        }}
                        placeholder={'Repeat your password'}
                    />
                    <TouchableOpacity
                        onPress={() => this._handleNewRegistry(outerUrl)}
                        style={MainStyles.goldenShankButton}>
                        <Text style={LocalStyles.buttonText}>Register</Text>
                    </TouchableOpacity>
                    <TouchableHighlight
                        onPress={this._registerByFacebook}
                        style={MainStyles.fbButton}>
                        <Text style={LocalStyles.buttonText}>Continue with Facebook</Text>
                    </TouchableHighlight>
                    <TouchableOpacity onPress={() => navigation.navigate('Login', {url:outerUrl})}>
                        <Text
                            style={[MainStyles.centerText, MainStyles.medShankBlackFont, MainStyles.inputTopSeparation]}>
                            I already have an account
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        );
    }
}