import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
	TextInput,
	TouchableHighlight,
	Alert,
	TouchableWithoutFeedback,
	ActionSheetIOS,
	Dimensions,
	Picker
} from 'react-native';
import LocalStyles from './styles/local';
import Style from '../../../styles/ShankStyle';
import Notifier from 'Core/Notifier';
import Spinner from 'react-native-loading-spinner-overlay';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import DropdownAlert from 'react-native-dropdownalert';

import LoadingIndicator from '../../common/LoadingIndicator';
import { ApiHost } from '../../../config/variables';
import { BaseComponent, BaseModel, MainStyles, AppConst, BarMessages, IsAndroid } from '../BaseComponent';
import RadioButton from 'radio-button-react-native';
import dismissKeyboard from 'dismissKeyboard';
import ActionSheet from 'react-native-actionsheet';

const width = Dimensions.get('window').width;

export default class ProfileScreen extends BaseComponent {
	static navigationOptions = {title: 'User Profile'};

	constructor(props) {
		super(props);
		this._handleUpdatePress = this._handleUpdatePress.bind(this);
		this.openImageSheet = this.openImageSheet.bind(this);
		this.selectPicture = this.selectPicture.bind(this);

		this.state = {
			loading: true,
			displayLoading: false,
			fullName: '',
			email: '',
			country: '',
			gender: 'Gender',
			photo: null,
			genders: [{name: 'Male'}, {name: 'Female'}, {name: 'Other'}],
			photoUri: null,
			countries: []
		};
		this.photoOptions = ['Open your gallery', 'Take a picture', 'Cancel'];
	}

	setLoading(loading) {
		this.setState({loading: loading});
	}

	async _handleUpdatePress() {
		if (!this.state.fullName) {
			this.handleError("Username cant be empty");
			return;
		}

		if (!this.state.email) {
			this.handleError("Email cant be empty");
			return;
		}

		this.setLoading(true);

		let json_profile_data = {_id: this.state._id, fullName: this.state.fullName, country: this.state.country, gender: this.state.gender};

		if (this.state.photoUri) {

			let filename = this.state.photoUri.split('/').pop();
			let match = /\.(\w+)$/.exec(filename);
			let type = match ? `image/${match[1]}` : 'image';

			let formData = new FormData();
			let user_data = JSON.stringify(json_profile_data);
			formData.append('user', user_data);
			formData.append('file', {uri: this.state.photoUri, type: type, name: filename});
			await BaseModel.multipart('update_profile_with_image', formData).catch(this.handleError);
			this.setLoading(false);
			this.dropdown.alertWithType('success', 'Success', 'Profile updated');
		}
		else {
			await BaseModel.post('update_profile', json_profile_data).catch(this.handleError);
			this.setLoading(false);
			this.dropdown.alertWithType('success', 'Success', 'Profile updated');
			//this.props.navigation.dispatch({type: 'Main'});
		}
	}

	handleError(error) {
		this.dropdown.alertWithType('error', "Error", error);
	}

	componentDidMount() {
		BaseModel.get('app_profile').then((response) => {
			this.setState({
				loading: false,
				_id: response.user._id,
				fullName: response.user.fullName,
				email: response.user.email,
				photo: response.user.photo,
				country: response.user.country,
				gender: response.user.gender,
				countries: response.countries
			})
		})
		.catch((error) => {
			this.setLoading(false);
		});
	}

	openImageSheet() {
		if (IsAndroid) {
			this.actionSheet.show();
		} else {
			ActionSheetIOS.showActionSheetWithOptions({options: this.photoOptions, cancelButtonIndex: 2}, index => this.selectPicture(index));
		}
	}

	async selectPicture(index) {
		let response;
		const options = {
			width: 200,
			height: 200,
			cropping: true,
			mediaType: 'photo'
		}

		switch (index) {
			case 0:
				response = await ImagePicker.openPicker(options);
				break;

			case 1:
				response = await ImagePicker.openCamera(options);
				break;

			default:
				break;
		}

		if (response) {
			this.setState({photoUri: response.path});
		}
	}

	onSelectCountry = (value, label) => {
    this.setState({
			country: value.name
    });
	}

	onSelectGender = (value, label) => {
    this.setState({
			gender: value.name
    });
	}

	getPhotoSource() {
		if (this.state.photoUri) {
			return {uri: this.state.photoUri};
		}

		if (this.state.photo) {
			return {uri: ApiHost + 'archive/download/' + this.state.photo};
		}

		return require('../../../../resources/add_edit_photo.png');
	}

	_renderImage = () => {
		return <Image source={this.getPhotoSource()} style={MainStyles.image} />;
	}

	render() {

		if (this.state.displayLoading) {
			return (
				<LoadingIndicator />
				);
		}

		let navigation = this.props.navigation;
		let user_photo = this._renderImage();

		let countryList = this.state.countries.map((country) => {
			return (<Picker.Item style={[MainStyles.pickerText]} key={country.name} value={country.name} label={country.name} />);
		});

		let genderList = this.state.genders.map((gender) => {
			return (<Picker.Item style={[MainStyles.pickerText]} key={gender.name} value={gender.name} label={gender.name} />);
		});

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
							<ActionSheet ref={sheet => this.actionSheet = sheet} options={this.photoOptions} cancelButtonIndex={2} onPress={this.selectPicture} />

							<TouchableOpacity style={[MainStyles.imageButton]} onPress={this.openImageSheet}>
								{user_photo}
								<Text style={MainStyles.imageText}>{this.state.photo || this.state.photoUri ? 'Change photo' : 'Add photo'}</Text>
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

							<Text
								style={MainStyles.formInputText}>
								{this.state.email}
							</Text>

							<View style={[MainStyles.pickerView]}>
								<Picker 
									itemStyle={[MainStyles.pickerText]}
									selectedValue={this.state.country}
									onValueChange={(itemValue, itemIndex) => this.setState({country: itemValue})}>
									<Picker.Item color={AppConst.COLOR_GRAY} value='' label='Country' />
									{countryList}
								</Picker>
							</View>

							<View style={[MainStyles.pickerView]}>
								<Picker
									itemStyle={[MainStyles.pickerText]}
									selectedValue={this.state.gender}
									onValueChange={(itemValue, itemIndex) => this.setState({gender: itemValue})}>
									<Picker.Item fontFamily={Style.CENTURY_GOTHIC} color={AppConst.COLOR_GRAY} value='' label='Gender' />
									{genderList}
								</Picker>
							</View>

							<View style={MainStyles.center}>
								<TouchableHighlight
								  onPress={() => this._handleUpdatePress()}
									style={[MainStyles.button, MainStyles.success, {width: '100%'}]}>
									<Text style={MainStyles.buttonText}>Save</Text>
								</TouchableHighlight>
							</View>

							<View style={MainStyles.space10} />
							<DropdownAlert ref={ref => this.dropdown = ref} />
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAwareScrollView>
			</View>
		);
	}
}
