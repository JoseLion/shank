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
import { BaseComponent, BaseModel, GolfApiModel, MainStyles, ShankConstants, BarMessages, Entypo, isAndroid } from '../BaseComponent';
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
				this.updateGroup('tournaments', [this.state.tournaments[index]]);
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
						<Picker itemStyle={[ViewStyle.pickerText]} selectedValue={this.state.group.tournaments[0]} onValueChange={tournament => this.updateGroup('tournaments', [tournament])}>
							<Picker.Item color={ShankConstants.TERTIARY_COLOR_ALT} value='' label='Pick a tournament' />
							{tournamentList}
						</Picker>
					</View>
				:
					<TouchableOpacity style={ViewStyle.pickerView} onPress={() => this.openTournamentsSheet()}>
						<Text style={[ViewStyle.pickerText, !this.state.group.tournaments[0] ? {color: ShankConstants.TERTIARY_COLOR_ALT} : null]}>{this.state.group.tournaments[0] ? this.state.group.tournaments[0].name : 'Pick a tournament'}</Text>
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

	/*constructor(props) {
		super(props);
		this.onCreateGroupPressed = this.onCreateGroupPressed.bind(this);
		this.optionSelectedPressed = this.optionSelectedPressed.bind(this);
		this.showActionSheet = this.showActionSheet.bind(this);
		this.state = {
			bet: '',
			name: '',
			selectTournament: '',
			groupPhoto: null,
			tournamentData: [],
			tName: 'Pick a tournament',
			loading: false,
		};
	}

	componentDidMount() {
		this.setLoading(true);
		this.initialRequest();
		this.props.navigation.setParams({
			actionSheet: this.showActionSheet
		});
	}

	setLoading(loading) {
		this.setState({loading: loading});
	}

	showActionSheet() {
		if(isAndroid) {
			this.ActionSheet.show();
		} else {
			this.props.showActionSheetWithOptions(
			{
				options: [ 'Open your gallery', 'Take a picture', 'Cancel' ],
				cancelButtonIndex: 2
			},
			buttonIndex => this.optionSelectedPressed(buttonIndex)
			);
		}
	}

	optionSelectedPressed(actionIndex) {
		this.pictureSelection(actionIndex);
	}

	onCreateGroupPressed() {
		if (!this.state.groupPhoto) {
			BarMessages.showError('Please enter a photo for the group.', this.validationMessage);
			return;
		}

		if (!this.state.name) {
			BarMessages.showError('Please enter a name for the group.', this.validationMessage);
			return;
		}

		if (!this.state.selectTournament) {
			BarMessages.showError('Please select a tournament.', this.validationMessage);
			return;
		}

		if (!this.state.bet) {
			BarMessages.showError('Please enter a bet.', this.validationMessage);
			return;
		}

		this.setLoading(true);
		let formData = new FormData();
		let data = {
			name: this.state.name,
			bet: this.state.bet,
			tournamentId: this.state.selectTournament.tournamentId,
			tournamentName: this.state.selectTournament.tournamentName,
			tournamentStart: this.state.selectTournament.startDate
		};
		formData.append('groupInformation', JSON.stringify(data));
		if (this.state.groupPhoto) {
			let filename = this.state.groupPhoto;
			filename = filename.split('/').pop();
			let match = /\.(\w+)$/.exec(filename);
			let type = match ? `image/${match[1]}` : `image`;
			formData.append('groupPhoto', {uri: this.state.groupPhoto, type: type, name: filename});
		}

		this.onCreateGroupPressedAsync(formData);
	}

	async initialRequest() {
		this.setLoading(true);
		BaseModel.post(`tournaments/findTournaments`).then((tournaments) => {
			this.setState({tournamentData: tournaments});
			this.setLoading(false);
		}).catch((error) => {
			console.log('ERROR! ', error);
			this.setLoading(false);
		});
	};

	async onCreateGroupPressedAsync(data) {
		await BaseModel.multipart('groups/create', data)
		.then((response) => {
			this.setLoading(false);
			super.navigateToScreen('Group', {groupId: response._id, isOwner: true});
		}).catch((error) => {
			this.setLoading(false);
			BarMessages.showError(error, this.validationMessage);
		});
	};

	async pictureSelection(option) {
		let settings = {
			allowsEditing: true,
			aspect: [4, 4],
		};
		let result;
		switch (option) {
			case 0: result = await ImagePicker.launchImageLibraryAsync(settings); break;
			case 1: result = await ImagePicker.launchCameraAsync(settings); break;
		}
		if (result != null && !result.cancelled) {
			this.setState({groupPhoto: result.uri});
		}
	};

	render() {
		let { groupPhoto } = this.state;
		let navigation = this.props.navigation;
		let addPhoto = require('../../../../resources/add_edit_photo.png');
		let tournamentName = [];
		let tournamentKeys = [];

		let tournamentItems = this.state.tournamentData.map((s, i) => {
			tournamentName[i] = s.tournamentName
			tournamentKeys[i] = s.tournamentId
			return <Picker.Item style={[MainStyles.formPickerText]} key={i} value={s} label={s.tournamentName} />
		});
		tournamentName.push('Cancel');
		tournamentKeys.push('none');

		return (
			<View style={{flex: 1}}>
				<KeyboardAwareScrollView ref='scroll' enableOnAndroid={true} extraHeight={10} keyboardDismissMode='interactive' style={MainStyles.background}>
					<View style={[MainStyles.container]} behavior='padding'>
						<Spinner visible={this.state.loading} animation='slide'/>
						<ActionSheet ref={o => this.ActionSheet = o} options={[ 'Open your gallery', 'Take a picture', 'Cancel']} cancelButtonIndex={2} onPress={this.optionSelectedPressed} />
						
						<View style={[ViewStyle.formContainer]}>
							<TouchableOpacity style={[ViewStyle.addPhotoLogo, MainStyles.inputTopSeparation]} onPress={() => { navigation.state.params.actionSheet(); }}>
								{groupPhoto && <Image source={{uri: groupPhoto}} style={ViewStyle.groupImage}/>}
								{!groupPhoto && <Image style={ViewStyle.groupImage} source={addPhoto}></Image>}
								
								<Text style={[MainStyles.centerText, MainStyles.placeholderText]}>
									{!groupPhoto ? 'Add photo' : 'Change photo'}
								</Text>
							</TouchableOpacity>

							<TextInput returnKeyType={'next'} underlineColorAndroid='transparent' style={[MainStyles.formInput, MainStyles.noMargin]} onChangeText={(name) => this.setState({name})}
							value={this.state.name} placeholder={'Group name'} maxLength={25} />

							{isAndroid ?
								<View style={[MainStyles.formPicker, MainStyles.noMargin, MainStyles.noPadding, ViewStyle.pickerHeight]}>
									<Picker style={MainStyles.noMargin} selectedValue={this.state.selectTournament} onValueChange={(tValue, itemIndex) => this.setState({selectTournament: tValue})}>
										<Picker.Item style={[MainStyles.formPickerText]} color={ShankConstants.TERTIARY_COLOR_ALT} value='' label='Pick a tournament' />
										{tournamentItems}
									</Picker>
								</View>
							:
								<TouchableOpacity style={[MainStyles.formPicker, MainStyles.noMargin]} onPress={() => {
									ActionSheetIOS.showActionSheetWithOptions({options: tournamentName, cancelButtonIndex: tournamentName.length - 1}, buttonIndex => {
										if (tournamentKeys[buttonIndex] != 'none') {
											this.setState({selectTournament: tournamentKeys[buttonIndex]})
										}
									});
								}}>
									<Text style={[MainStyles.formPickerText, MainStyles.noMargin]} numberOfLines={1}>{this.state.tName}</Text>
								</TouchableOpacity>
							}

							<TextInput returnKeyType={'next'} underlineColorAndroid='transparent' style={[MainStyles.formInput, MainStyles.noMargin]} onChangeText={(bet) => this.setState({bet})}
							value={this.state.bet} multiline={true} numberOfLines={3} placeholder={'Bet'} maxLength={50} />

							<TouchableOpacity style={[MainStyles.button, MainStyles.success]} onPress={this.onCreateGroupPressed}>
								<Text style={MainStyles.buttonText}>Create a Group</Text>
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAwareScrollView>
				
				<DropdownAlert ref={ref => this.validationMessage = ref} />
			</View>
		);
	}*/
}