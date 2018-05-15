// React components:
import React from 'react';
import { Text, View, TextInput, TouchableHighlight, AsyncStorage, findNodeHandle, TouchableOpacity, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';
import FBSDK, { LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

// Shank components:
import { BaseComponent, NoAuthModel, MainStyles, AppConst, BarMessages, Spinner } from '../BaseComponent';
import LocalStyles from './styles/local';

export default class Login extends BaseComponent {

	static navigationOptions = ({navigation}) => ({title: 'LOG IN'});

	constructor(props) {
		super(props);
		this.scrollToInput = this.scrollToInput.bind(this);
		this.onLoginPressed = this.onLoginPressed.bind(this);
		this.facebookService = this.facebookService.bind(this);
		this.handleError = this.handleError.bind(this);
		this.state = {
			email: '',
			password: '',
			loading: false
		};
	}

	setLoading(loading) {
		this.setState({loading: loading});
	}

	scrollToInput(reactNode) {
		this.refs.scroll.scrollToFocusedInput(reactNode);
	}

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

	async onLoginPressedAsync(data) {
		const login = await NoAuthModel.post('app_login', data).catch(this.handleError);
		
		if (login) {
			await AsyncStorage.setItem(AppConst.AUTH_TOKEN, login.token);
			await AsyncStorage.setItem(AppConst.USER_PROFILE, JSON.stringify(login.user));
			this.setLoading(false);
			this.props.navigation.navigate('Main');
		} else {
			this.setLoading(false);
			BarMessages.showError("Incorrect user/password. Please try again!", this.validationMessage);
		}
	}

	async facebookCallBack(error, profile) {
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

			const userInfo = await NoAuthModel.post('app_user/facebookSignin', data).catch(this.handleError);
			await AsyncStorage.setItem(AppConst.AUTH_TOKEN, userInfo.token);
			await AsyncStorage.setItem(AppConst.USER_PROFILE, JSON.stringify(userInfo.user));
			this.setLoading(false);
			this.props.navigation.navigate('Main');
		} else {
			this.handleError('Facebook account does not have an associated email!');
		}
	}

	async facebookService() {
		const permissions = ['public_profile', 'email'];
		this.setLoading(true);
		let option = 'Signin';

		const response = await LoginManager.logInWithReadPermissions(permissions).catch(this.handleError);

		if (response.isCancelled) {
			this.handleError(`${option} with Facebook was cancelled!`);
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
				const infoRequest = new GraphRequest('/me?fields=id,name,email,picture', null, (error, profile) => this.facebookCallBack(error, profile));
				new GraphRequestManager().addRequest(infoRequest).start();
			} else {
				this.handleError(`Not enought permissions grnated to ${option} with Facebook!`);
			}
		}
	}

	handleError(error) {
		this.setLoading(false);
		BarMessages.showError(error, this.validationMessage);
	}

	render() {
		return (
			<View style={{flex: 1}}>
				<KeyboardAwareScrollView ref='scroll' enableOnAndroid={true} extraHeight={10} keyboardDismissMode='interactive' style={[MainStyles.background]}>
					<View style={[MainStyles.container]} behavior="padding">
						<Spinner visible={this.state.loading} animation="slide"/>
						
						<Text style={[MainStyles.centerText, LocalStyles.contentColor, LocalStyles.subtitlePage]}>WELCOME TO SHANK</Text>
						<Text style={[MainStyles.centerText, LocalStyles.contentColor, LocalStyles.descriptionPage]}>ENTER YOUR EMAIL & PASSWORD TO{"\n"}LOG IN TO YOUR ACCOUNT</Text>
						
						<View style={[LocalStyles.formContainer]}>
							<TextInput keyboardType={'email-address'} returnKeyType={"next"} underlineColorAndroid="transparent" style={MainStyles.formInput} onChangeText={(email) => this.setState({email})} value={this.state.email} placeholder={'Email'} onFocus={(event) => { this.scrollToInput(findNodeHandle(event.target)) }} onSubmitEditing={(event) => { this.refs.password.focus(); }} />
							
							<TextInput returnKeyType={"next"} underlineColorAndroid="transparent" style={MainStyles.formInput} onChangeText={(password) => this.setState({password})} value={this.state.password} placeholder={'Password'} onFocus={(event) => { this.scrollToInput(findNodeHandle(event.target)) }} onSubmitEditing={(event) => { Keyboard.dismiss() }} secureTextEntry={true} ref='password' />

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
				</KeyboardAwareScrollView>

				<DropdownAlert ref={ref => this.validationMessage = ref} />
			</View>
		);
	}
}