import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, View, TouchableOpacity, Image, TextInput, TouchableHighlight, Alert, TouchableWithoutFeedback} from 'react-native';
import MainStyles from 'MainStyles';
import LocalStyles from './styles/local';
import BaseModel from 'Core/BaseModel';
import Notifier from 'Core/Notifier';
import Spinner from 'react-native-loading-spinner-overlay';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as AppConst from 'Core/AppConst';
import * as BarMessages from 'Core/BarMessages';
import LoadingIndicator from '../../common/LoadingIndicator';
import { ApiHost } from '../../../config/variables';
import { BaseComponent } from '../BaseComponent';
import RadioButton from 'radio-button-react-native';
import dismissKeyboard from 'dismissKeyboard';

export default class ProfileScreen extends BaseComponent {
	static navigationOptions = {title: 'User Profile'};

	constructor(props) {
		super(props);
		this._handleNewUserRegistry = this._handleNewUserRegistry.bind(this);
		this.state = {
			loading: true,
			fullName: '',
			email: '',
			country: '',
			gender: '',
			photo: null
		}
	}

	setLoading(loading) {
		this.setState({loading: loading});
	}

	_renderImage = () => {

		let {userImage} = this.state;

		if (userImage) {
			return <Image source={{uri: userImage}} style={LocalStyles.groupImage} />;
		}

		let addPhoto = require('../../../../resources/add_edit_photo.png');

		if (!userImage && !this.state.photo) {
			return  <Image source={addPhoto} style={LocalStyles.groupImage} />;
		}
		
		let photo_path = ApiHost + 'archive/download/' + this.state.photo;
		console.log(photo_path, 'photo_path');
		
		return <Image source={{uri: photo_path }} style={LocalStyles.groupImage} />;
	}

	async _handleNewUserRegistry(userId) {
		if (!this.state.fullName) {
			Notifier.message({title: 'User Update', message: 'username cant be empty'});
			return;
		}

		if (!this.state.email) {
			Notifier.message({title: 'User Update', message: 'email cant be empty'});
			return;
		}

		if (!this.state.userImage && !this.state.photo) {
			Notifier.message({title: 'User Update', message: 'Please select a profile photo (tap on the empty image)'});
			return;
		}

		this.setLoading(true);

		if (this.state.userImage) {

			let localUri = this.state.userImage;
			let filename = localUri.split('/').pop();

			let match = /\.(\w+)$/.exec(filename);
			let type = match ? `image/${match[1]}` : `image`;

			let data = new FormData();
			data.append('file', {uri: localUri, name: filename, type: type});
			let user_data = JSON.stringify({fullName: this.state.fullName});
			data.append('user', user_data);

			BaseModel.createPhoto('updateUser', data).then((response) => {
				this.setLoading(false);
				this.props.navigation.dispatch({type: 'Main'})
			})
			.catch((error) => {
				this.setLoading(false);
				Notifier.message({title: 'ERROR', message: error});
			});
		}
		else {
			this.setLoading(false);

			BaseModel.update('users/' + this.state._id, {fullName: this.state.fullName}).then((response) => {
				this.setLoading(false);
				this.props.navigation.dispatch({type: 'Main'})
			})
			.catch((error) => {
				this.setLoading(false);
				Notifier.message({title: 'ERROR', message: error});
			});
		}
	}

	async _pickImage() {
		/*let result = await ImagePicker.launchImageLibraryAsync({
			allowsEditing: true,
			aspect: [4, 3],
		});

		if (!result.cancelled) {
			this.setState({userImage: result.uri});
		}*/
	};

	async _takePicture() {
		/*let result = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [4, 3],
		});

		if (!result.cancelled) {
			this.setState({userImage: result.uri});
		}*/
	}

	componentDidMount() {
		BaseModel.get('app_profile/').then((response) => {
			this.setState({
				loading: false,
				_id: response._id,
				fullName: response.fullName,
				email: response.email,
				photo: response.photo,
				country: response.country
			})
		})
		.catch((error) => {
			this.setLoading(false);
			Notifier.message({title: 'ERROR', message: error});
		});
	}
	
  handleGender = (value) => {
    this.setState({ gender : value });
  };
	
	render() {

		if (this.state.loading) {
			return (
				<LoadingIndicator />
				);
		}

		let navigation = this.props.navigation;
		let user_photo = this._renderImage();

		return (
			<View style={{flex: 1}}>
				<KeyboardAwareScrollView
				  ref='scroll'
					enableOnAndroid={true}
					extraHeight={5}
					style={[MainStyles.background]}
					keyboardShouldPersistTaps="always">
					
					<TouchableWithoutFeedback onPress={() => dismissKeyboard()} style={{ flex: 1 }}>
						<View style={[MainStyles.container]} behavior="padding">
							<Spinner visible={this.state.loading} animation="slide"/>
							<TouchableOpacity style={[LocalStyles.addPhotoLogo, MainStyles.inputTopSeparation]} onPress={() => {
								Alert.alert('RESPONSE', 'Choose how to get your picture', [
									{text: 'Open your gallery', onPress: () => this._pickImage()},
									{text: 'Take a picture', onPress: () => this._takePicture()}
								], {cancelable: true});
							}}>
								
								{user_photo}
								
								<Text style={[MainStyles.centerText, MainStyles.greenMedShankFont]}>Add or Update your photo</Text>
							</TouchableOpacity>
							
							<View style={[LocalStyles.formContainer]}>
								<TextInput
									returnKeyType={"next"}
									underlineColorAndroid="transparent"
									style={MainStyles.formInput}
									onChangeText={(fullName) => this.setState({fullName})}
									value={this.state.fullName}
									placeholder={'Name'}
									onSubmitEditing={() => this.country.focus()}/>
																
								<TextInput
									keyboardType={'email-address'}
									returnKeyType={"next"}
									underlineColorAndroid="transparent"
									editable={false}
									style={MainStyles.formInput}
									onChangeText={(email) => this.setState({email})}
									value={this.state.email}
									placeholder={'Email'} />
								
								<TextInput
									ref={ref => this.country = ref}
									returnKeyType={"next"}
									underlineColorAndroid="transparent"
									style={MainStyles.formInput}
									onChangeText={(country) => this.setState({country})}
									value={this.state.country}
									placeholder={'Country'} />
								
								<View style={[MainStyles.inRow, {paddingTop: 10, paddingBottom: 10}]}>
									<View style={[MainStyles.center]}>
										<Text style={[MainStyles.formLabel, {marginTop: -5}]}> GÉNERO </Text>
									</View>
									
									<View style={{width: 40}} />
									
									<RadioButton currentValue={this.state.gender}
										value='M'
										onPress={this.handleGender.bind(this)}
										outerCircleColor='#027090'
										outerCircleSize={28}
										outerCircleWidth={1}
										innerCircleColor='rgba(112, 163, 77, 1)'
										innerCircleSize={23} />
									
									<View style={[MainStyles.center]}>
										<Text style={[MainStyles.greenColor, {fontSize: 20, marginTop: -5}]}>  M  </Text>
									</View>
															
									<View style={{width: 20}} />
									
									<RadioButton currentValue={this.state.gender}
										value='F'
										onPress={this.handleGender.bind(this)}
										outerCircleColor='#027090'
										outerCircleSize={28}
										outerCircleWidth={1}
										innerCircleColor='rgba(112, 163, 77, 1)'
										innerCircleSize={23} />
										
									<View style={[MainStyles.center]}>
										<Text style={[MainStyles.greenColor, {fontSize: 20, marginTop: -5}]}>  F  </Text>
									</View>
									
									<View style={{width: 20}} />
									
									<RadioButton currentValue={this.state.gender}
										value='O'
										onPress={this.handleGender.bind(this)}
										outerCircleColor='#027090'
										outerCircleSize={28}
										outerCircleWidth={1}
										innerCircleColor='rgba(112, 163, 77, 1)'
										innerCircleSize={23} />
										
									<View style={[MainStyles.center]}>
										<Text style={[MainStyles.greenColor, {fontSize: 20, marginTop: -5}]}>  Other  </Text>
									</View>
								</View>
								
								<TouchableHighlight onPress={() => this._handleNewUserRegistry(navigation.state.params.currentUser._id).then(() => console.log("some"))} style={[MainStyles.button, MainStyles.success, {marginBottom: '10%', width: '80%'}]}>
									<Text style={MainStyles.buttonText}>Update Profile</Text>
								</TouchableHighlight>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAwareScrollView>
			</View>
		);
	}
}