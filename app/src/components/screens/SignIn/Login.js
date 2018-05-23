// React components:
import React from 'react';
import { Text, View, TextInput, TouchableHighlight, AsyncStorage, findNodeHandle, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';
import FBSDK, { LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { EventRegister } from 'react-native-event-listeners';
import { NavigationActions } from 'react-navigation';
import dismissKeyboard from 'dismissKeyboard';

// Shank components:
import { BaseComponent, NoAuthModel, MainStyles, AppConst, Spinner } from '../BaseComponent';
import handleError from 'Core/handleError';
import LocalStyles from './styles/local';

export default class Login extends BaseComponent {

	static navigationOptions = ({navigation}) => ({title: 'LOG IN'});

	constructor(props) {
		super(props);
		this.scrollToInput = this.scrollToInput.bind(this);
		this.onLoginPressed = this.onLoginPressed.bind(this);
		this.facebookService = this.facebookService.bind(this);
		this.finishLogin = this.finishLogin.bind(this);
		this.state = {
			email: '',
			password: ''
		};
	}

	scrollToInput(reactNode) {
		this.refs.scroll.scrollToFocusedInput(reactNode);
	}

	onLoginPressed() {
		if (!this.state.email) {
			handleError("Please enter your Email.");
			return;
		}

		if (!this.state.password) {
			handleError("Please enter your Password.");
			return;
		}

		Keyboard.dismiss();

		let data = {
			email: this.state.email.toLowerCase(),
			password: this.state.password,
		};
		this.onLoginPressedAsync(data);
	}

	async onLoginPressedAsync(data) {
		global.setLoading(true);
		const login = await NoAuthModel.post('app_login', data).catch(handleError);

		if (login) {
			await AsyncStorage.setItem(AppConst.AUTH_TOKEN, login.token);
			await AsyncStorage.setItem(AppConst.USER_PROFILE, JSON.stringify(login.user));
			this.finishLogin();
			return;
		}

		global.setLoading(false);
		handleError("Incorrect user/password. Please try again!");
	}

	async facebookCallBack(error, profile) {
		try {
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

				const userInfo = await NoAuthModel.post('app_user/facebookSignin', data).catch(handleError);
				await AsyncStorage.setItem(AppConst.AUTH_TOKEN, userInfo.token);
				await AsyncStorage.setItem(AppConst.USER_PROFILE, JSON.stringify(userInfo.user));
				this.finishLogin();
			} else {
				handleError('Facebook account does not have an associated email!');
			}
		} catch (error) {
			handleError(error);
		}
	}

	async facebookService() {
		try {
			const permissions = ['public_profile', 'email'];
			global.setLoading(true);
			let option = 'Signin';

			const response = await LoginManager.logInWithReadPermissions(permissions).catch(error => {
				console.log("FACEBOOK ERROR: ", error);
				handleError(error);
			});


			if (response == null) {
				handleError("No response from Facebook, please try again later");
				return;
			}

			if (response.isCancelled) {
				handleError(`${option} with Facebook was cancelled!`);
				return;
			} else {
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
					const infoRequest = new GraphRequest('/me?fields=id,name,email,picture', null, (error, profile) => {
						this.facebookCallBack(error, profile);
					});
					const request = new GraphRequestManager().addRequest(infoRequest);
					request.start();
				} else {
					handleError(`Not enought permissions granted to ${option} with Facebook!`);
				}
			}
		} catch (error) {
			handleError(error);
		}
	}

	finishLogin() {
		global.setLoading(false);
		EventRegister.emit(AppConst.EVENTS.realodGroups);

		this.props.navigation.dispatch(NavigationActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({routeName: 'Main'})],
		}));
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<KeyboardAwareScrollView
				  ref='scroll'
					enableOnAndroid={true}
					extraHeight={10}
					style={[MainStyles.background]}
					keyboardShouldPersistTaps="always">

					<TouchableWithoutFeedback onPress={() => dismissKeyboard()} style={{ flex: 1 }}>
						<View style={[MainStyles.container]} behavior="padding">
							<Text style={[MainStyles.centerText, LocalStyles.contentColor, LocalStyles.subtitlePage]}>WELCOME TO SHANK</Text>
							<Text style={[MainStyles.centerText, LocalStyles.contentColor, LocalStyles.descriptionPage]}>ENTER YOUR EMAIL & PASSWORD TO{"\n"}LOG IN TO YOUR ACCOUNT</Text>

							<View style={[LocalStyles.formContainer]}>
								<TextInput
									keyboardType={'email-address'}
									returnKeyType={"next"}
									underlineColorAndroid="transparent"
									style={MainStyles.formInput}
									onChangeText={(email) => this.setState({email})}
									value={this.state.email}
									placeholder={'Email'}
									onSubmitEditing={(event) => { this.refs.password.focus(); }} />

								<TextInput
									ref='password'
									returnKeyType={"done"}
									underlineColorAndroid="transparent"
									style={MainStyles.formInput}
									secureTextEntry={true}
									onChangeText={(password) => this.setState({password})}
									value={this.state.password}
									placeholder={'Password'}
									onSubmitEditing={() => this.onLoginPressed()}/>

								<TouchableHighlight style={[MainStyles.button, MainStyles.success]} onPress={() => this.onLoginPressed()}>
									<Text style={MainStyles.buttonText}>Log in</Text>
								</TouchableHighlight>

								<TouchableHighlight style={[MainStyles.button, MainStyles.facebook]} onPress={this.facebookService}>
									<Text style={[MainStyles.buttonText]}>Continue with Facebook</Text>
								</TouchableHighlight>

								<TouchableOpacity style={[MainStyles.buttonLink]} onPress={() => super.navigateToScreen('Register')}>
									<Text style={[MainStyles.buttonLinkText, LocalStyles.buttonLinkText]}>Create new account</Text>
								</TouchableOpacity>

								<View style={MainStyles.buttonLink}>
									<Text style={[MainStyles.buttonLinkText, LocalStyles.buttonLinkText]}>Forgot my password</Text>
								</View>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAwareScrollView>
			</View>
		);
	}
}
