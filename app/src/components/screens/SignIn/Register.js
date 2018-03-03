// React components:
import React from 'react';
import { Text, View, TextInput, TouchableHighlight, AsyncStorage, findNodeHandle, TouchableOpacity, Keyboard } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';

// Shank components:
import { BaseComponent, NoAuthModel, GolfApiModel, MainStyles, ShankConstants, BarMessages, FontAwesome, Entypo, Facebook } from '../BaseComponent';
import LocalStyles from './styles/local';

export default class Register extends BaseComponent {

    static navigationOptions = ({navigation}) => ({
        title: 'SIGN UP',
        headerTintColor: ShankConstants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: ShankConstants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: ShankConstants.PRIMARY_COLOR },
        headerLeft: (
            <TouchableHighlight onPress={() => navigation.dispatch({type: 'Login'})}>
                <Entypo name='chevron-small-left' style={[MainStyles.headerIconButton]} />
            </TouchableHighlight>
        ),
        headerRight: (<View></View>)
    });

    constructor(props) {
        super(props);
        this.scrollToInput = this.scrollToInput.bind(this);
        this.onRegisterPressed = this.onRegisterPressed.bind(this);
        this.facebookService = this.facebookService.bind(this);
        this.state = {
            name: '',
            email: '',
            password: '',
            repeatedPassword: '',
            loading: false
        };
    }

    setLoading(loading) { this.setState({loading: loading}); }
    scrollToInput(reactNode) { this.refs.scroll.scrollToFocusedInput(reactNode); }
    onRegisterPressed() {
        if (!this.state.fullName) {
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
            fullName: this.state.fullName,
            email: this.state.email.toLowerCase(),
            password: this.state.password,
        };
        this.onRegisterPressedAsync(data);
    };

    // Async methods:
    onRegisterPressedAsync = async (data) => {
        await NoAuthModel.create('/users/register', data)
            .then((response) => {
                this.setLoading(false);
                AsyncStorage.setItem(ShankConstants.AUTH_TOKEN, response.token);
                AsyncStorage.setItem(ShankConstants.USER_PROFILE, JSON.stringify(response.user));
                super.navigateDispatchToScreen('Main');
            }).catch((error) => {
                this.setLoading(false);
                BarMessages.showError(error, this.validationMessage);
            });
    };

    facebookService = async() => {
        this.setLoading(true);
        let option = 'Signup';
        try {
            const {type, token} = await Facebook.logInWithReadPermissionsAsync(ShankConstants.APP_FB_ID, { permissions: ['public_profile', 'email'] });
            
            switch (type) {
                case 'success': {
                    // Get the user's name using Facebook's Graph API
                    const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${token}`);
                    const profile = await response.json();

                    if (profile.email) {
                        let data = {
                            fullName: profile.name,
                            email: profile.email,
                            facebookId: profile.id,
                            photo: {
                                name: 'facebook',
                                path: profile.picture.data.url
                            }
                        };

                        await NoAuthModel.post('users/facebookSignin', data)
                            .then((userInfo) => {
                                this.setLoading(false);
                                AsyncStorage.setItem(ShankConstants.AUTH_TOKEN, userInfo.token);
                                AsyncStorage.setItem(ShankConstants.USER_PROFILE, JSON.stringify(userInfo.user));
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
                    BarMessages.showError(`${option} with Facebook was cancelled!`, this.validationMessage);
                }
                default: {
                    this.setLoading(false);
                    BarMessages.showError(`${option} with Facebook failed!`, this.validationMessage);
                }
            }
        } catch (e) {
            this.setLoading(false);
            BarMessages.showError(`${option} failed!`, this.validationMessage);
        }
    };

    render() {
        return (
            <View style={{flex: 1}}>
                <KeyboardAwareScrollView ref='scroll' enableOnAndroid={true} extraHeight={10} keyboardDismissMode='interactive' style={[MainStyles.background]}>
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
                                onChangeText={(fullName) => this.setState({fullName})}
                                value={this.state.fullName}
                                placeholder={'Name'}
                                onFocus={(event) => { this.scrollToInput(findNodeHandle(event.target)) }}
                                onSubmitEditing={(event) => { this.refs.email.focus(); }}
                                ref='name' />
                            <TextInput
                                returnKeyType={"next"}
                                underlineColorAndroid="transparent"
                                style={[MainStyles.formInput]}
                                onChangeText={(email) => this.setState({email})}
                                value={this.state.email}
                                placeholder={'Email'}
                                onFocus={(event) => { this.scrollToInput(findNodeHandle(event.target)) }}
                                onSubmitEditing={(event) => { this.refs.pass1.focus(); }}
                                ref='email' />
                            <TextInput
                                returnKeyType={"next"}
                                underlineColorAndroid="transparent"
                                style={[MainStyles.formInput]}
                                onChangeText={(password) => this.setState({password})}
                                value={this.state.password}
                                placeholder={'Password'}
                                onFocus={(event) => { this.scrollToInput(findNodeHandle(event.target)) }}
                                onSubmitEditing={(event) => { this.refs.pass2.focus(); }}
                                secureTextEntry={true}
                                ref='pass1' />
                            <TextInput
                                returnKeyType={"next"}
                                underlineColorAndroid="transparent"
                                style={[MainStyles.formInput]}
                                onChangeText={(repeatedPassword) => this.setState({repeatedPassword})}
                                value={this.state.repeatedPassword}
                                onFocus={(event) => { this.scrollToInput(findNodeHandle(event.target)) }}
                                onSubmitEditing={(event) => { Keyboard.dismiss() }}
                                placeholder={'Repeat your password'}
                                ref='pass2'
                                secureTextEntry={true} />

                            <TouchableOpacity style={[MainStyles.button, MainStyles.success]} onPress={() => this.onRegisterPressed()}>
                                <Text style={[MainStyles.buttonText]}>Register</Text>
                            </TouchableOpacity>

                            <TouchableHighlight style={[MainStyles.button, MainStyles.facebook]} onPress={this.facebookService}>
                                <Text style={[MainStyles.buttonText]}>Continue with Facebook</Text>
                            </TouchableHighlight>

                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <DropdownAlert ref={ref => this.validationMessage = ref} />
            </View>
        );
    }

}
