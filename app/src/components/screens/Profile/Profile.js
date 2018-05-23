import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, TouchableOpacity, Image, TextInput, TouchableHighlight, Alert, TouchableWithoutFeedback} from 'react-native';
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
import ModalDropdown from 'react-native-modal-dropdown';

export default class ProfileScreen extends BaseComponent {
	static navigationOptions = {title: 'User Profile'};

	constructor(props) {
		super(props);
		this._handleUpdatePress = this._handleUpdatePress.bind(this);
		this.state = {
			loading: true,
			fullName: '',
			email: '',
			country: '',
			gender: '',
			photo: null,
			genders: ['Male', 'Female', 'Other']
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

	_handleUpdatePress(userId) {
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

	selectGender = (idx, value) => {
    this.setState({
      gender: this.state.genders[idx]
    });
  }

	render() {

		if (this.state.loading) {
			return (
				<LoadingIndicator />
				);
		}

		let navigation = this.props.navigation;
		let user_photo = this._renderImage();

		return (
			<View style={MainStyles.newMainContainer}>
			<KeyboardAwareScrollView
				ref={ref => this._scrollview = ref}
				contentContainerStyle={{ alignItems: 'center'}}
				style={{flex: 1}}
				keyboardShouldPersistTaps="always">

					<TouchableWithoutFeedback onPress={() => dismissKeyboard()} style={{ flex: 1 }}>
						<View style={MainStyles.form}>
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

							<TextInput
								ref={ref => this.name = ref}
								returnKeyType={"next"}
								underlineColorAndroid="transparent"
								style={MainStyles.formInputText}
								onChangeText={(fullName) => this.setState({fullName})}
								value={this.state.fullName}
								placeholder={'Name'}
								onSubmitEditing={() => this.country.focus()}/>

							<TextInput
								ref={ref => this.email = ref}
								keyboardType={'email-address'}
								returnKeyType={"next"}
								underlineColorAndroid="transparent"
								editable={false}
								style={MainStyles.formInputText}
								onChangeText={(email) => this.setState({email})}
								value={this.state.email}
								placeholder={'Email'} />

							<TextInput
								ref={ref => this.country = ref}
								returnKeyType={"next"}
								underlineColorAndroid="transparent"
								style={MainStyles.formInputText}
								onChangeText={(country) => this.setState({country})}
								value={this.state.country}
								placeholder={'Country'} />

							<ModalDropdown style={MainStyles.dropdown}
								textStyle={MainStyles.dropdownButton}
								defaultValue='Gender ...'
								dropdownStyle={MainStyles.dropdownStyle}
                dropdownTextStyle={MainStyles.dropdownTextStyle}
								options={this.state.genders}
								onSelect={(idx, value) => this.selectGender(idx, value)}
							/>
							
							<View style={MainStyles.space10} />

							<View style={MainStyles.center}>
								<TouchableHighlight
								  onPress={() => this._handleUpdatePress(navigation.state.params.currentUser._id)}
									style={[MainStyles.button, MainStyles.success, {width: '90%'}]}>
									<Text style={MainStyles.buttonText}>Update Profile</Text>
								</TouchableHighlight>
							</View>

							<View style={MainStyles.space10} />
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAwareScrollView>
			</View>
		);
	}
}
