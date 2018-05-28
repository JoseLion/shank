// React components:
import React from 'react';
import { 
	ScrollView,
	Text,
	View,
	TextInput,
	TouchableHighlight,
	Image,
	TouchableOpacity,
	Picker,
	ActionSheetIOS,
	AsyncStorage,
	TouchableWithoutFeedback
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import ActionSheet from 'react-native-actionsheet';
import DropdownAlert from 'react-native-dropdownalert';
import ImagePicker from 'react-native-image-crop-picker';
import { EventRegister } from 'react-native-event-listeners';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import dismissKeyboard from 'dismissKeyboard';

// Shank components:
import { BaseComponent, BaseModel, MainStyles, AppConst, BarMessages, IsAndroid } from '../BaseComponent';
import { ApiHost } from '../../../config/variables';
import ViewStyle from './styles/addGroupStyle'

export default class EditGroup extends BaseComponent {

	static navigationOptions = {title: 'EDIT GROUP'};

	constructor(props) {
		super(props);
		this.photoOptions = ['Open your gallery', 'Take a picture', 'Cancel'];
		this.updateGroup = this.updateGroup.bind(this);
		this.openTournamentsSheet = this.openTournamentsSheet.bind(this);
		this.openImageSheet = this.openImageSheet.bind(this);
		this.selectPicture = this.selectPicture.bind(this);
		this.getPhotoSource = this.getPhotoSource.bind(this);
		this.editGroup = this.editGroup.bind(this);
		this.handleError = this.handleError.bind(this);
		this.state = {
			isLoading: false,
			tournaments: [],
			group: this.props.navigation.state.params && this.props.navigation.state.params.group ? this.props.navigation.state.params.group : {tournaments: []},
			isEditing: this.props.navigation.state.params && this.props.navigation.state.params.group,
			photoUri: null
		};
	}

	updateGroup(key, value) {
		let group = {...this.state.group};
		group[key] = value;
		this.setState({group: group});
	}

	openTournamentsSheet() {
		const names = this.state.tournaments.map(tournament => tournament.name);
		names.push('Cancel');
		ActionSheetIOS.showActionSheetWithOptions({options: names, cancelButtonIndex: names.length - 1}, index => {
			if (index != names.length - 1) {
				this.updateGroup('tournaments', [{tournament: this.state.tournaments[index]}]);
			}
		});
	}

	openImageSheet() {
		if (IsAndroid) {
			this.actionSheet.show();
		} else {
			ActionSheetIOS.showActionSheetWithOptions({options: this.photoOptions, cancelButtonIndex: 2}, index => this.selectPicture(index));
		}
	}

	async getAllTournaments() {
		this.setState({isLoading: true});
		const tournamentsData = await BaseModel.get('tournament/findAll').catch(this.handleError);
		this.setState({isLoading: false, tournaments: tournamentsData});
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

	getPhotoSource() {
		if (this.state.photoUri) {
			return {uri: this.state.photoUri};
		}

		if (this.state.group.photo) {
			return {uri: ApiHost + 'archive/download/' + this.state.group.photo};
		}

		return require('../../../../resources/add_edit_photo.png');
	}

	async editGroup() {

		if (!this.state.group.name) {
			this.handleError("Group name is required!");
			return;
		}

		if (!this.state.group.tournaments[0]) {
			this.handleError("Group tournament is required!");
			return;
		}

		if (!this.state.group.bet) {
			this.handleError("Group bet is required!");
			return;
		}

		let formData = new FormData();
		
		if (this.state.photoUri) {
			let filename = this.state.photoUri.split('/').pop();
			let match = /\.(\w+)$/.exec(filename);
			let type = match ? `image/${match[1]}` : 'image';

			formData.append('file', {uri: this.state.photoUri, type: type, name: filename});
		}

		let group_data_to_update = {
			_id: this.state.group._id,
			name: this.state.group.name,
			bet: this.state.group.bet,
			photo: this.state.group.photo
		};

		formData.append('group', JSON.stringify(group_data_to_update));

		this.setState({isLoading: true});
		let group = await BaseModel.multipart('group/update', formData).catch(this.handleError);
		this.setState({isLoading: false});
		this.props.navigation.pop();
		EventRegister.emit(AppConst.EVENTS.reloadCurrentGroup);
	}

	handleError(error) {
		this.setState({isLoading: false});
		this.dropDown.alertWithType('error', "Error", error);
	}

	componentDidMount() {
		this.getAllTournaments();
	}

	render() {
		let tournamentList;

		if (IsAndroid) {
			tournamentList = this.state.tournaments.map(tournament => {
				return (<Picker.Item style={[ViewStyle.pickerText]} key={tournament.tournamentID} value={tournament} label={tournament.name} />);
			});
		}

		return (
			<View style={MainStyles.newMainContainer}>
				<KeyboardAwareScrollView
					ref={ref => this._scrollview = ref}
					contentContainerStyle={{ alignItems: 'center'}}
					style={{flex: 1}}
					keyboardShouldPersistTaps="always">

					<TouchableWithoutFeedback onPress={() => dismissKeyboard()} style={{ flex: 1 }}>
						<View style={MainStyles.form}>
							<Spinner visible={this.state.isLoading} animation='fade'/>
							<ActionSheet ref={sheet => this.actionSheet = sheet} options={this.photoOptions} cancelButtonIndex={2} onPress={this.selectPicture} />

							<TouchableOpacity style={[MainStyles.imageButton]} onPress={this.openImageSheet}>
								<Image source={this.getPhotoSource()} style={MainStyles.image}></Image>
								<Text style={ViewStyle.imageText}>{this.state.group.photo || this.state.photoUri ? 'Change photo' : 'Add photo'}</Text>
							</TouchableOpacity>

							<TextInput
								ref={ref => this.group_name = ref}
								returnKeyType={'next'}
								underlineColorAndroid='transparent'
								style={ViewStyle.nameInput}
								onChangeText={name => this.updateGroup('name', name)}
								value={this.state.group.name}
								placeholder={'Group name'}
								onSubmitEditing={() => this.bet.focus()}/>

							<Text
								style={[ViewStyle.pickerView, MainStyles.mainFontFamily]}>
								{this.state.group.tournaments[0].tournament.name}
							</Text>

							<TextInput
							  ref={ref => this.bet = ref}
							  underlineColorAndroid='transparent'
								style={ViewStyle.betInput}
								onChangeText={bet => this.updateGroup('bet', bet)}
								value={this.state.group.bet}
								placeholder={'Bet'}
								multiline={true}
								numberOfLines={3} />

							<TouchableHighlight
								onPress={this.editGroup}
								style={[MainStyles.button, MainStyles.success, {width: '100%'}]}>
								<Text style={[MainStyles.buttonText]}>Save Changes</Text>
							</TouchableHighlight>

							<DropdownAlert ref={ref => this.dropDown = ref} />
						</View>
					</TouchableWithoutFeedback>
				</KeyboardAwareScrollView>
			</View>
		);
	}
}