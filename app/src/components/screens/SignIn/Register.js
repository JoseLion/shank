// React components:
import React from 'react';
import { Text, View, TextInput, TouchableHighlight, AsyncStorage, findNodeHandle, TouchableOpacity, Keyboard } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';
import FBSDK, { LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

// Shank components:
import { BaseComponent, NoAuthModel, MainStyles, AppConst, BarMessages } from '../BaseComponent';
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


	onRegisterPressedAsync = async (data) => {
		await NoAuthModel.create('/users/register', data)
		.then((response) => {
			this.setLoading(false);
			AsyncStorage.setItem(AppConst.AUTH_TOKEN, response.token);
			AsyncStorage.setItem(AppConst.USER_PROFILE, JSON.stringify(response.user));
			this.props.navigation.navigate('Main');
		}).catch((error) => {
			this.setLoading(false);
			BarMessages.showError(error, this.validationMessage);
		});
	};

	async facebookCallBack(error, profile) {
		if (error) {
			return this.handleError(`Facebook error: ${error}`);
		}

		if (profile && profile.email) {
			let data = {
				fullName: profile.name,
				email: profile.email,
				facebookId: profile.id,
				photo: {
					name: 'facebook',
					path: profile.picture.data.url
				}
			};

			const userInfo = await NoAuthModel.post('users/facebookSignin', data).catch(this.handleError);
			await AsyncStorage.setItem(AppConst.AUTH_TOKEN, userInfo.token);
			await AsyncStorage.setItem(AppConst.USER_PROFILE, JSON.stringify(userInfo.user));
			this.setLoading(false);
			this.props.navigation.navigate('Main');
		} else {
			this.handleError('Facebook account does not have an associated email!');
		}
	}

	async facebookService(error, profile) {
		const permissions = ['public_profile', 'email'];
		this.setLoading(true);
		let option = 'Signup';

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
						<Spinner visible={this.state.loading} animation="slide" />
						
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