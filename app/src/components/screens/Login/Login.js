// React components:
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, StyleSheet, Text, View, TextInput, TouchableHighlight, AsyncStorage, findNodeHandle, Keyboard } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';

// Third party components:
import { Facebook } from 'expo';

// Shank components:
import NoAuthModel from '../../../core/NoAuthModel';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import * as Constants from '../../../core/Constants';
import * as BarMessages from '../../../core/BarMessages';

const DismissKeyboardView = Constants.DismissKeyboardHOC(View);
export default class LoginScreen extends Component {

    static propTypes = { navigation: PropTypes.object.isRequired };
    static navigationOptions = {
        title: 'LOG IN',
        headerTintColor: Constants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: Constants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: Constants.PRIMARY_COLOR },
        headerRight: (<View></View>)
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

    setLoading(loading) { this.setState({loading: loading}); }

    _scrollToInput = function(reactNode) { this.refs.scroll.scrollToFocusedInput(reactNode); }
    _onLoginPressed = function(url) {

        if(!this.state.email) {
            BarMessages.showError('Please enter your Email.', this.validationMessage);
            return;
        }

        if(!this.state.password) {
            BarMessages.showError('Please enter your Password.', this.validationMessage);
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
                BarMessages.showError(error, this.validationMessage);
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
                <KeyboardAwareScrollView ref='scroll' enableOnAndroid={true} extraHeight={10} style={{backgroundColor: '#F5FCFF'}} keyboardDismissMode='interactive'>
                    <View style={[MainStyles.container]} behavior="padding">
                        <Spinner visible={this.state.loading} animation="slide"/>
                        <Text style={[MainStyles.centerText, LocalStyles.contentColor, LocalStyles.subtitlePage]}>
                            WELCOME TO SHANK
                        </Text>
                        <Text style={[MainStyles.centerText, LocalStyles.contentColor, LocalStyles.descriptionPage]}>
                            ENTER YOUR EMAIL & PASSWORD TO{"\n"}LOG IN TO YOUR ACCOUNT
                        </Text>
                        <View style={[LocalStyles.formContainer]}>
                            <TextInput
                                returnKeyType={"next"}
                                underlineColorAndroid="transparent"
                                style={MainStyles.formInput}
                                onChangeText={(email) => this.setState({email})}
                                value={this.state.email}
                                placeholder={'Email'}
                                onFocus={(event) => { this._scrollToInput(findNodeHandle(event.target)) }}
                                onSubmitEditing={(event) => { this.refs.password.focus(); }} />
                            <TextInput
                                returnKeyType={"next"}
                                underlineColorAndroid="transparent"
                                style={MainStyles.formInput}
                                onChangeText={(password) => this.setState({password})}
                                value={this.state.password}
                                placeholder={'Password'}
                                onFocus={(event) => { this._scrollToInput(findNodeHandle(event.target)) }}
                                onSubmitEditing={(event) => { this._onLoginPressed(outerUrl) }}
                                secureTextEntry={true}
                                ref='password' />

                            <TouchableHighlight style={[MainStyles.button, MainStyles.success]} onPress={() => this._onLoginPressed(outerUrl)}>
                                <Text style={MainStyles.buttonText}>Log in</Text>
                            </TouchableHighlight>

                            <View style={MainStyles.buttonLink}>
                                <Text style={[MainStyles.buttonLinkText, LocalStyles.buttonLinkText]}>
                                    Forgot my password
                                </Text>
                            </View>
                        </View>

                    </View>
                </KeyboardAwareScrollView>
                <DropdownAlert ref={ref => this.validationMessage = ref} />
            </View>
        );
    }

}
