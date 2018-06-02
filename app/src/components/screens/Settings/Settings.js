// React components:
import React, { Component } from 'react';
import {
	TouchableOpacity,
	Text,
	View,
	Image,
	TouchableHighlight,
	AsyncStorage,
	FlatList,
	Linking
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { EventRegister } from 'react-native-event-listeners';

// Shank components:
import { BaseComponent, BaseModel, FileHost, MainStyles, AppConst, IsAndroid, Spinner } from '../BaseComponent';
import handleError from 'Core/handleError';
import ViewStyle from './styles/settingsStyle';

import RighCaretIcon from 'Res/right-caret-icon.png';
import index from 'react-native-swipeable';

class SettingsRow extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TouchableHighlight underlayColor={AppConst.COLOR_GRAY} onPress={this.props.onPress}>
				<View style={ViewStyle.listRowView}>
					<Text style={ViewStyle.listRowText}>{this.props.data.name}</Text>
					<Image style={ViewStyle.listRowCaret} source={RighCaretIcon} resizeMode="contain" resizeMethod={'resize'} />
				</View>
			</TouchableHighlight> 
		);
	}
}

export default class Settings extends Component {

	static navigationOptions = ({navigation}) => ({title: 'SETTINGS'});

	constructor(props) {
		super(props);
		this.logout = this.logout.bind(this);
		this.actionForRow - this.actionForRow.bind(this);
		this.state = {
			data: [
				{id: 0, name: 'Edit Profile'},
				{id: 1, name: 'Privacy Policy'},
				{id: 2, name: 'Terms of Service'},
				{id: 3, name: 'Rules'}
			],
			settingData: null
		};
	}

  componentDidMount() {
		this.loadInitialData();
	}
	
	async loadInitialData() {
		const data = await BaseModel.get("get_weblinks").catch(error => {
			handleError(error);
		});
		
		if (data) {
			this.setState({settingData: data});
		}
	}

  openLink(index) {
		let url = this.state.settingData.values[index];
		
		if (url) {
			Linking.canOpenURL(url).then(supported => {
				if (supported) {
					Linking.openURL(url);
				}
				else {
					console.log('Don\'t know how to open URI: ' + this.props.url);
				}
			});
		}
  }

	async logout() {
        EventRegister.emit(AppConst.EVENTS.logout);
	}

	async actionForRow(index) {
		switch(index) {
			case 0: {
				global.setLoading(true);
				const user = await AsyncStorage.getItem(AppConst.USER_PROFILE).catch(handleError);
				global.setLoading(false);

				if (user) {
					this.props.navigation.navigate('Profile', {currentUser: JSON.parse(user)});
				}
				break;
			}
			case 1: {
				this.openLink(0);
				break;
			}
			case 2: {
				this.openLink(1);
				break;
			}
			case 3: {
				this.openLink(2);
				break;
			}
		}
	}

	render() {
		let navigation = this.props.navigation;
		let completeData = this.state.data;

		return (
			<View style={ViewStyle.mainContainer}>
				<View style={ViewStyle.mainSubview}>
					<FlatList
						style={ViewStyle.list}
						data={this.state.data}
						keyExtractor={item => item.name}
						renderItem={({item, index}) => <SettingsRow data={item}
						onPress={() => this.actionForRow(index)} /> }/>

					<TouchableOpacity style={[MainStyles.button, MainStyles.error, {width: '80%'}]} onPress={this.logout}>
						<Text style={MainStyles.buttonText}>Log Out</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

}