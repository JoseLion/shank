import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Text, View, TouchableOpacity, Image, TextInput, TouchableHighlight, Alert, TouchableWithoutFeedback, ActionSheetIOS, Picker } from 'react-native';
import Style from '../../../styles/ShankStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import DropdownAlert from 'react-native-dropdownalert';
import handleError from 'Core/handleError';
import { FileHost } from '../../../config/variables';
import { BaseComponent, BaseModel, MainStyles, AppConst, IsAndroid } from '../BaseComponent';
import dismissKeyboard from 'dismissKeyboard';
import ActionSheet from 'react-native-actionsheet';
import ViewStyle from './styles/profileStyle';

import AddEditPhoto from 'Res/add_edit_photo.png';

export default class ProfileScreen extends BaseComponent {
	static navigationOptions = {title: 'User Profile'};

	constructor(props) {
		super(props);
		this.updateProfile = this.updateProfile.bind(this);
		this.openImageSheet = this.openImageSheet.bind(this);
		this.selectPicture = this.selectPicture.bind(this);

		this.state = {
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

	async updateProfile() {
		if (!this.state.fullName) {
			handleError("Username cant be empty");
			return;
		}

		if (!this.state.email) {
			handleError("Email cant be empty");
			return;
		}

		global.setLoading(true);

		let json_profile_data = {_id: this.state._id, fullName: this.state.fullName, country: this.state.country, gender: this.state.gender};

		if (this.state.photoUri) {

			let filename = this.state.photoUri.split('/').pop();
			let match = /\.(\w+)$/.exec(filename);
			let type = match ? `image/${match[1]}` : 'image';

			let formData = new FormData();
			let user_data = JSON.stringify(json_profile_data);
			formData.append('user', user_data);
			formData.append('file', {uri: this.state.photoUri, type: type, name: filename});
			await BaseModel.multipart('update_profile_with_image', formData).catch(handleError);
			global.setLoading(false);
			this.dropdown.alertWithType('success', 'Success!', 'Profile updated');
		}
		else {
			await BaseModel.post('update_profile', json_profile_data).catch(handleError);
			global.setLoading(false);
			this.dropdown.alertWithType('success', 'Success!', 'Profile updated');
		}
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
			return {uri: FileHost + this.state.photo};
		}

		return AddEditPhoto;
    }
    
    async componentDidMount() {
        global.setLoading(true);
        const response = await BaseModel.get('app_profile').catch(handleError);
        this.setState({...response.user});
        global.setLoading(false);
	}

	render() {
		const countryList = this.state.countries.map((country) => {
			return (<Picker.Item style={[ViewStyle.pickerItem]} key={country.name} value={country.name} label={country.name} />);
		});

		const genderList = this.state.genders.map((gender) => {
			return (<Picker.Item style={[ViewStyle.pickerItem]} key={gender.name} value={gender.name} label={gender.name} />);
		});

		return (
			<View style={ViewStyle.mainContainer}>
			    <KeyboardAwareScrollView ref={ref => this._scrollview = ref} contentContainerStyle={ViewStyle.scrollView} keyboardShouldPersistTaps="always">
					<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
						<View style={ViewStyle.mainView}>
							<ActionSheet ref={sheet => this.actionSheet = sheet} options={this.photoOptions} cancelButtonIndex={2} onPress={this.selectPicture} />

							<TouchableOpacity style={ViewStyle.imageView} onPress={this.openImageSheet}>
								<Image source={this.getPhotoSource()} style={ViewStyle.photoImage} />
								<Text style={ViewStyle.imageText}>{this.state.photo || this.state.photoUri ? 'Change photo' : 'Add photo'}</Text>
							</TouchableOpacity>

							<TextInput
								ref={ref => this.name = ref}
								returnKeyType={"next"}
								underlineColorAndroid="transparent"
								style={ViewStyle.formInput}
								onChangeText={(fullName) => this.setState({fullName})}
								value={this.state.fullName}
								placeholder={'Name'}
								onSubmitEditing={() => this.country.focus()}/>

							<Text style={ViewStyle.formInput}>{this.state.email}</Text>

							<View style={ViewStyle.pickerView}>
								<Picker itemStyle={ViewStyle.pickerItem} selectedValue={this.state.country} onValueChange={itemValue => this.setState({country: itemValue})}>
									<Picker.Item color={AppConst.COLOR_GRAY} value='' label='Country' />
									{countryList}
								</Picker>
							</View>

							<View style={ViewStyle.pickerView}>
								<Picker itemStyle={ViewStyle.pickerItem} selectedValue={this.state.gender} onValueChange={itemValue => this.setState({gender: itemValue})}>
									<Picker.Item fontFamily={Style.CENTURY_GOTHIC} color={AppConst.COLOR_GRAY} value='' label='Gender' />
									{genderList}
								</Picker>
							</View>

                            <TouchableHighlight onPress={this.updateProfile} style={[MainStyles.button, MainStyles.success]}>
                                <Text style={MainStyles.buttonText}>Save</Text>
                            </TouchableHighlight>

							<DropdownAlert ref={ref => this.dropdown = ref} />
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAwareScrollView>
			</View>
		);
	}
}
