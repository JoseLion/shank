import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage, findNodeHandle, Keyboard } from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import Notifier from '../../../core/Notifier';
import NoAuthModel from '../../../core/NoAuthModel';
import * as Constants from '../../../core/Constans';
import Spinner from 'react-native-loading-spinner-overlay';
import { Facebook } from 'expo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

let MessageBarAlert = require('react-native-message-bar').MessageBar;
let MessageBarManager = require('react-native-message-bar').MessageBarManager;

export default class LoginScreen extends Component {

    static propTypes = { navigation: PropTypes.object.isRequired };
    static navigationOptions = {
        title: 'Login',
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {alignSelf: 'center', color: '#FFFFFF'},
        headerStyle: { backgroundColor: '#556E3E' }
    };

    constructor(props) {
        super(props);
        console.log(':::IT\'S ON LOGIN:::');

        this._onLoginPressed = this._onLoginPressed.bind(this);
        this._scrollToInput = this._scrollToInput.bind(this);

        this.state = {
            email: '',
            password: '',
            loading: false
        };
    }
    componentDidMount(){
        MessageBarManager.registerMessageBar(this.refs.validationInput);
    }
    componentWillUnmount() {
        MessageBarManager.unregisterMessageBar();
    }

    setLoading(loading) { this.setState({loading: loading}); }

    showMessage(type, message) {
        MessageBarManager.showAlert({
            message: message,
            alertType: type,
            position: 'bottom',
            animationType: 'SlideFromBottom'
        });
    }

    _scrollToInput = function(reactNode) { this.refs.scroll.scrollToFocusedInput(reactNode); }
    _onLoginPressed = function(url) {

        if(!this.state.email) {
            this.showMessage('error', 'Please enter your Email.')
            return;
        }

        if(!this.state.password) {
            this.showMessage('error', 'Please enter your Password.')
            return;
        }
        this.setLoading(true);

        let data = {
            email: this.state.email.toLowerCase(),
            password: this.state.password,
        };
        this._onLoginPressedAsync(data, url);
    }

    _onLoginPressedAsync = async(data, url) => {
        if(this.props.url) data.tag = this.props.url['tag'];
        if(url) data.tag = url['tag'];
        await NoAuthModel.create('login', data)
            .then((login) => {
                this.setLoading(false);
                AsyncStorage.setItem(Constants.AUTH_TOKEN, login.token, () => { });
                AsyncStorage.setItem(Constants.USER_PROFILE, JSON.stringify(login.user), () => { });
                this.props.navigation.dispatch({type: 'Main'});
            }).catch((error) => {
                this.setLoading(false);
                this.showMessage('error', error);
            });
    }

    render() {
        let navigation = this.props.navigation;
        let outerUrl = "";
        if(navigation.state.params){
            if(navigation.state.params.url){
                outerUrl = navigation.state.params.url;
            }
        }
        return (
            <View style={{flex: 1}}>
                <KeyboardAwareScrollView ref='scroll' enableOnAndroid={true} extraHeight={5} style={{backgroundColor: '#F5FCFF'}} keyboardDismissMode='interactive'>
                    <View style={[MainStyles.container,{marginVertical:'35%'}]} behavior="padding">
                        <Spinner visible={this.state.loading} animation="slide"/>
                        <Text style={MainStyles.greenMedShankFont}>
                            WELCOME BACK
                        </Text>
                        <TextInput
                            returnKeyType={"next"}
                            underlineColorAndroid="transparent"
                            style={MainStyles.loginInput}
                            onChangeText={(email) => this.setState({email})}
                            value={this.state.email}
                            placeholder={'Email'}
                            onFocus={(event) => { this._scrollToInput(findNodeHandle(event.target)) }}
                            onSubmitEditing={(event) => { this.refs.password.focus(); }}
                        />
                        <TextInput
                            returnKeyType={"next"}
                            underlineColorAndroid="transparent"
                            style={MainStyles.loginInput}
                            onChangeText={(password) => this.setState({password})}
                            value={this.state.password}
                            placeholder={'Password'}
                            onFocus={(event) => { this._scrollToInput(findNodeHandle(event.target)) }}
                            onSubmitEditing={(event) => { this._onLoginPressed(outerUrl) }}
                            secureTextEntry={true}
                            ref='password'
                        />
                        <TouchableHighlight onPress={() => this._onLoginPressed(outerUrl)} style={MainStyles.goldenShankButton}>
                            <Text style={LocalStyles.buttonText}>Log in</Text>
                        </TouchableHighlight>
                            <Text style={[MainStyles.centerText, MainStyles.medShankBlackFont, MainStyles.inputTopSeparation]}>
                                Forgot my password
                            </Text>

                    </View>
                </KeyboardAwareScrollView>
                <MessageBarAlert ref="validationInput" />
            </View>
        );
    }

}
