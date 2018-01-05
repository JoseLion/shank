// React components:
import React from 'react';
import { Text, View, TextInput, TouchableHighlight, AsyncStorage, findNodeHandle, TouchableOpacity, Keyboard } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';

// Shank components:
import { BaseComponent, NoAuthModel, GolfApiModel, MainStyles, Constants, BarMessages, FontAwesome, Entypo, Facebook } from '../BaseComponent';
import LocalStyles from './styles/local';

export default class Login extends BaseComponent {

    static navigationOptions = ({navigation}) => ({
        title: 'LOG IN',
        headerTintColor: Constants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: Constants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: Constants.PRIMARY_COLOR },
        headerLeft: (
            <TouchableHighlight onPress={() => navigation.dispatch({type: 'Main'})}>
                <Entypo name='chevron-small-left' style={[MainStyles.headerIconButton]} />
            </TouchableHighlight>
        ),
        headerRight: (<View></View>)
    });

    constructor(props) {
        super(props);
        this.scrollToInput = this.scrollToInput.bind(this);
        this.onLoginPressed = this.onLoginPressed.bind(this);
        this.facebookService = this.facebookService.bind(this);
        this.state = {
            email: '',
            password: '',
            loading: false
        };
    }

    setLoading(loading) { this.setState({loading: loading}); }
    scrollToInput(reactNode) { this.refs.scroll.scrollToFocusedInput(reactNode); }
    onLoginPressed() {
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
        this.onLoginPressedAsync(data);
    }

    // Async methods:
    onLoginPressedAsync = async(data) => {
        await NoAuthModel.post('login', data)
            .then((login) => {
                this.setLoading(false);
                AsyncStorage.setItem(Constants.AUTH_TOKEN, login.token);
                AsyncStorage.setItem(Constants.USER_PROFILE, JSON.stringify(login.user));
                super.navigateDispatchToScreen('Main');
            }).catch((error) => {
                this.setLoading(false);
                BarMessages.showError(error, this.validationMessage);
            });
    };
    facebookService = async() => {
        this.setLoading(true);
        let option = 'Signin';
        try {
            const {type, token} = await Facebook.logInWithReadPermissionsAsync(Constants.APP_FB_ID, { permissions: ['public_profile', 'email', 'user_friends'] });
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
                                AsyncStorage.setItem(Constants.AUTH_TOKEN, userInfo.token);
                                AsyncStorage.setItem(Constants.USER_PROFILE, JSON.stringify(userInfo.user));
                                super.navigateDispatchToScreen('Main');
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
                                onFocus={(event) => { this.scrollToInput(findNodeHandle(event.target)) }}
                                onSubmitEditing={(event) => { this.refs.password.focus(); }} />
                            <TextInput
                                returnKeyType={"next"}
                                underlineColorAndroid="transparent"
                                style={MainStyles.formInput}
                                onChangeText={(password) => this.setState({password})}
                                value={this.state.password}
                                placeholder={'Password'}
                                onFocus={(event) => { this.scrollToInput(findNodeHandle(event.target)) }}
                                onSubmitEditing={(event) => { Keyboard.dismiss() }}
                                secureTextEntry={true}
                                ref='password' />

                            <TouchableHighlight style={[MainStyles.button, MainStyles.success]} onPress={() => this.onLoginPressed()}>
                                <Text style={MainStyles.buttonText}>Log in</Text>
                            </TouchableHighlight>

                            <TouchableHighlight style={[MainStyles.button, MainStyles.facebook]} onPress={this.facebookService}>
                                <Text style={[MainStyles.buttonText]}>Continue with Facebook</Text>
                            </TouchableHighlight>

                            <TouchableOpacity style={[MainStyles.buttonLink]} onPress={() => super.navigateToScreen('Register')}>
                                <Text style={[MainStyles.buttonLinkText, LocalStyles.buttonLinkText]}>
                                    Create new account
                                </Text>
                            </TouchableOpacity>

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
