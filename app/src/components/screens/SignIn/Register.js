import React from 'react';
import { Text, View, TextInput, TouchableHighlight, AsyncStorage, findNodeHandle, TouchableOpacity, Keyboard, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import handleError from 'Core/handleError';
import FBSDK, { LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { NavigationActions } from 'react-navigation';
import PushNotification from 'react-native-push-notification';

import { BaseComponent, NoAuthModel, MainStyles, AppConst } from '../BaseComponent';
import Style from 'ShankStyle';
import LocalStyles from './styles/local';

export default class Register extends BaseComponent {

	static navigationOptions = {title: 'SIGN UP'};

	constructor(props) {
		super(props);
		this.scrollToInput = this.scrollToInput.bind(this);
		this.onRegisterPressed = this.onRegisterPressed.bind(this);
		this.facebookService = this.facebookService.bind(this);
		this.state = {
			name: '',
			email: '',
			password: '',
			repeatedPassword: ''
		};
    }
    
	scrollToInput(reactNode) {
        this.refs.scroll.scrollToFocusedInput(reactNode);
    }

	async onRegisterPressed() {
		if (!this.state.fullName) {
			handleError('Please enter your name');
			return;
		}

		if (!this.state.email) {
			handleError('Please enter your email');
			return;
		}

		if (!this.state.password) {
			handleError('Please enter your password');
			return;
		}

		if (this.state.password != this.state.repeatedPassword) {
			handleError('Passwords must match');
			return;
		}

		global.setLoading(true);
		let data = {
			fullName: this.state.fullName,
			email: this.state.email.toLowerCase(),
            password: this.state.password,
            register_os: Platform.OS
		};
        
        const response = await NoAuthModel.post('app_user/register', data).catch(handleError);
        await AsyncStorage.setItem(AppConst.AUTH_TOKEN, response.token);
        await AsyncStorage.setItem(AppConst.USER_PROFILE, JSON.stringify(response.user));
        this.finishSignup();
	};

	async facebookCallBack(error, profile) {
        try {
            if (error) {
                handleError(error);
                return;
            }

            if (profile && profile.email) {
                let data = {
                    fullName: profile.name,
                    email: profile.email,
                    facebookId: profile.id,
                    photoUrl: profile.picture.data.url
                };

                const userInfo = await NoAuthModel.post('app_user/facebookSignin', data).catch(handleError);
                
                if (userInfo) {
                    await AsyncStorage.setItem(AppConst.AUTH_TOKEN, userInfo.token);
                    await AsyncStorage.setItem(AppConst.USER_PROFILE, JSON.stringify(userInfo.user));
                    this.finishSignup();
                }
            } else {
                handleError('Facebook account does not have an associated email!');
            }
        } catch (error) {
            handleError(error);
        }
	}

	async facebookService(error, profile) {
        try {
            const permissions = ['public_profile', 'email'];
            global.setLoading(true);
            let option = 'Signup';

            const response = await LoginManager.logInWithReadPermissions(permissions).catch(handleError);

            if (response == null) {
                handleError("No response from Facebook, please try again later");
                return;
            }

            if (response.isCancelled) {
                handleError('Signup with Facebook was cancelled!');
                return;
            }

            let hasSamePermissions = true;

            for (let i = 0; i < response.grantedPermissions.length; i++) {
                let found = false;

                for (let j = 0; j < permissions.length; j++) {
                    if (response.grantedPermissions[i] == permissions[j]) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    hasSamePermissions = false;
                    break;
                }
            }

            if (hasSamePermissions) {
                const infoRequest = new GraphRequest('/me?fields=id,name,email,picture', null, (error, profile) => this.facebookCallBack(error, profile));
                new GraphRequestManager().addRequest(infoRequest).start();
            } else {
                handleError('Not enought permissions grnated to signup with Facebook!');
            }
        } catch (error) {
            handleError(error);
        }
    }
    
    finishSignup() {
        global.setLoading(false);
        PushNotification.requestPermissions();
        
        this.props.navigation.dispatch(NavigationActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({routeName: 'Main'})],
		}));
    }

	render() {
		return (
			<View style={{flex: 1}}>
				<KeyboardAwareScrollView ref='scroll' enableOnAndroid={true} extraHeight={10} keyboardDismissMode='interactive' style={[MainStyles.background]}>
					<View style={[MainStyles.container]} behavior="padding">
						<Text style={[MainStyles.centerText, LocalStyles.contentColor, LocalStyles.subtitlePage]}>WELCOME TO SHANK</Text>
						<Text style={[MainStyles.centerText, LocalStyles.contentColor, LocalStyles.descriptionPage]}>LET{"\'"}S START BY CREATING AN ACCOUNT</Text>
						<View style={[LocalStyles.formContainer]}>
							<TextInput returnKeyType={"next"} underlineColorAndroid="transparent" style={[MainStyles.formInput]} onChangeText={(fullName) => this.setState({fullName})} value={this.state.fullName} placeholder={'Name'} 
							onFocus={(event) => { this.scrollToInput(findNodeHandle(event.target)) }} onSubmitEditing={(event) => { this.refs.email.focus(); }} ref='name' />
							
							<TextInput returnKeyType={"next"} underlineColorAndroid="transparent" style={[MainStyles.formInput]} onChangeText={(email) => this.setState({email})} value={this.state.email} placeholder={'Email'}
							onFocus={(event) => { this.scrollToInput(findNodeHandle(event.target)) }} onSubmitEditing={(event) => { this.refs.pass1.focus(); }} ref='email' />
							
							<TextInput returnKeyType={"next"} underlineColorAndroid="transparent" style={[MainStyles.formInput]} onChangeText={(password) => this.setState({password})} value={this.state.password} placeholder={'Password'}
							onFocus={(event) => { this.scrollToInput(findNodeHandle(event.target)) }} onSubmitEditing={(event) => { this.refs.pass2.focus(); }} secureTextEntry={true} ref='pass1' />
							
							<TextInput returnKeyType={"next"} underlineColorAndroid="transparent" style={[MainStyles.formInput]} onChangeText={(repeatedPassword) => this.setState({repeatedPassword})} value={this.state.repeatedPassword}
							onFocus={(event) => { this.scrollToInput(findNodeHandle(event.target)) }} onSubmitEditing={(event) => { Keyboard.dismiss() }} placeholder={'Repeat your password'} ref='pass2' secureTextEntry={true} />

							<TouchableOpacity style={[MainStyles.button, MainStyles.success, {marginTop: Style.EM(0.5)}]} onPress={this.onRegisterPressed}>
								<Text style={[MainStyles.buttonText]}>Register</Text>
							</TouchableOpacity>

							<TouchableHighlight style={[MainStyles.button, MainStyles.facebook, {marginTop: Style.EM(0.5)}]} onPress={this.facebookService}>
								<Text style={[MainStyles.buttonText]}>Continue with Facebook</Text>
							</TouchableHighlight>
						</View>
					</View>
				</KeyboardAwareScrollView>
			</View>
		);
	}
}