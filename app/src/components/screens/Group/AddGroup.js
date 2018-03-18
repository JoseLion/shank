// React components:
import React from 'react';
import { Text, View, TextInput, TouchableHighlight, Image, TouchableOpacity, Picker, ActionSheetIOS, AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import ActionSheet from 'react-native-actionsheet'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';
import { ImagePicker } from 'expo';
import { connectActionSheet } from '@expo/react-native-action-sheet';

// Shank components:
import { BaseComponent, BaseModel, GolfApiModel, MainStyles, AppConst, BarMessages, Entypo, isAndroid } from '../BaseComponent';
import { ApiHost } from '../../../config/variables';
import ViewStyle from './styles/addGroupStyle'

@connectActionSheet
export default class AddGroup extends BaseComponent {

	static navigationOptions = {title: 'CREATE GROUP'};

	constructor(props) {
		super(props);
		this.photoOptions = ['Open your gallery', 'Take a picture', 'Cancel'];
		this.updateGroup = this.updateGroup.bind(this);
		this.openTournamentsSheet = this.openTournamentsSheet.bind(this);
		this.openImageSheet = this.openImageSheet.bind(this);
		this.selectPicture = this.selectPicture.bind(this);
		this.getPhotoSource = this.getPhotoSource.bind(this);
		this.createGroup = this.createGroup.bind(this);
		this.state = {
			isLoading: false,
			tournaments: [],
			group: {tournaments: []}
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
		if (isAndroid) {
			this.actionSheet.show();
		} else {
			this.props.showActionSheetWithOptions({options: this.photoOptions, cancelButtonIndex: 2}, index => this.selectPicture(index));
		}
	}

	async getAllTournaments() {
		this.setState({isLoading: true});
		const tournamentsData = await BaseModel.get('tournament/findAll').catch(error => this.validationMessage = error);
		this.setState({isLoading: false, tournaments: tournamentsData});
	}

	async selectPicture(index) {
		let result;
		let settings = {allowsEditing: true, aspect: [4, 4]};

		switch (index) {
			case 0: result = await ImagePicker.launchImageLibraryAsync(settings); break;
			case 1: result = await ImagePicker.launchCameraAsync(settings); break;
		}

		if (result != null && !result.cancelled) {
			this.setState({photoUri: result.uri});
		}
	}

	getPhotoSource() {
		if (this.state.group.photo) {
			return {uri: ApiHost + 'archive/download/' + this.state.group.photo};
		} else {
			if (this.state.photoUri) {
				return {uri: this.state.photoUri};
			} else {
				return require('../../../../resources/add_edit_photo.png');
			}
		}
	}

	async createGroup() {
		let formData = new FormData();
		let filename = this.state.photoUri.split('/').pop();
		let match = /\.(\w+)$/.exec(filename);
		let type = match ? `image/${match[1]}` : 'image';

		formData.append('group', JSON.stringify(this.state.group));
		formData.append('file', {uri: this.state.photoUri, type: type, name: filename});

		this.setState({isLoading: true});
		let group = await BaseModel.multipart('group/create', formData).catch(error => this.validationMessage = error);
		this.setState({isLoading: false});
		this.props.navigation.goBack(null);
	}

	componentDidMount() {
		this.getAllTournaments();
	}

	render() {
		let tournamentList;

		if (isAndroid) {
			tournamentList = this.state.tournaments.map(tournament => {
				return (<Picker.Item style={[ViewStyle.pickerText]} key={tournament.tournamentID} value={tournament} label={tournament.name} />);
			});
		}

		return (
			<KeyboardAwareScrollView ref='scroll' enableOnAndroid={true} extraHeight={10} keyboardDismissMode='interactive' contentContainerStyle={{flex: 1, alignItems: 'center', paddingHorizontal: Style.EM(3)}}>
				<Spinner visible={this.state.isLoading} animation='fade'/>
				<ActionSheet ref={sheet => this.actionSheet = sheet} options={this.photoOptions} cancelButtonIndex={2} onPress={this.selectPicture} />

				<TouchableOpacity style={ViewStyle.imageButton} onPress={this.openImageSheet}>
					<Image source={this.getPhotoSource()} resizeMode={'contain'} style={ViewStyle.image}></Image>
					<Text style={ViewStyle.imageText}>{this.state.group.photo || this.state.photoUri ? 'Change photo' : 'Add photo'}</Text>
				</TouchableOpacity>

				<TextInput returnKeyType={'next'} underlineColorAndroid='transparent' style={ViewStyle.nameInput} onChangeText={name => this.updateGroup('name', name)} value={this.state.group.name} placeholder={'Group name'} />

				{isAndroid ?
					<View style={[ViewStyle.pickerView, ViewStyle.androidPicker]}>
						<Picker itemStyle={[ViewStyle.pickerText]} selectedValue={this.state.group.tournaments[0].tournament} onValueChange={tournament => this.updateGroup('tournaments', [{ tournament }])}>
							<Picker.Item color={AppConst.COLOR_GRAY} value='' label='Pick a tournament' />
							{tournamentList}
						</Picker>
					</View>
				:
					<TouchableOpacity style={ViewStyle.pickerView} onPress={() => this.openTournamentsSheet()}>
						<Text style={[ViewStyle.pickerText, !this.state.group.tournaments[0] ? {color: AppConst.COLOR_GRAY} : null]}>{this.state.group.tournaments[0] ? this.state.group.tournaments[0].tournament.name : 'Pick a tournament'}</Text>
					</TouchableOpacity>
				}

				<TextInput underlineColorAndroid='transparent' style={ViewStyle.betInput} onChangeText={bet => this.updateGroup('bet', bet)} value={this.state.group.bet} placeholder={'Bet'} multiline={true} numberOfLines={3} />

				<TouchableHighlight style={[MainStyles.button, MainStyles.success]} onPress={this.createGroup}>
					<Text style={[MainStyles.buttonText]}>Create Group</Text>
				</TouchableHighlight>

				<DropdownAlert ref={ref => this.validationMessage = ref} />
			</KeyboardAwareScrollView>
		);
	}
}