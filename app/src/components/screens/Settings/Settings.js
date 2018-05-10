// React components:
import React, { Component } from 'react';
import { TouchableOpacity, Text, View, Image, TouchableHighlight, AsyncStorage, FlatList } from 'react-native';

// Shank components:
import NoAuthModel from 'Core/NoAuthModel';
import * as AppConst from 'Core/AppConst';
import handleError from 'Core/handleError';
import MainStyles from 'MainStyles';
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
		this.removeStorage = this.removeStorage.bind(this);
		this.actionForRow - this.actionForRow.bind(this);
		this.state = {
			data: [
				{id: 0, name: 'Edit Profile'},
				{id: 1, name: 'Privacy Policy'},
				{id: 2, name: 'Terms of Service'},
				{id: 3, name: 'Rules'}
			]
		};
	}

	async removeStorage() {
		global.setLoading(true);
		let token = await AsyncStorage.removeItem(AppConst.AUTH_TOKEN).catch(handleError);
		global.setLoading(false);
		this.props.navigation.navigate('Main');
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

			default: {
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
					<FlatList style={ViewStyle.list} data={this.state.data} keyExtractor={item => item.name} renderItem={({item, index}) => <SettingsRow data={item} onPress={() => this.actionForRow(index)} /> }/>

					<TouchableOpacity style={[MainStyles.button, MainStyles.error, {width: '80%'}]} onPress={this.removeStorage}>
						<Text style={MainStyles.buttonText}>Log Out</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	}

}