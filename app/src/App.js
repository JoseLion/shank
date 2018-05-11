import React, { Component } from 'react';
import { AppRegistry, View, StatusBar, AsyncStorage, PushNotificationIOS, AlertIOS } from 'react-native';
import AppNavigator from './components/navigators/AppNavigator';
import { YellowBox } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import Spinner from 'react-native-loading-spinner-overlay';
import PushNotification from 'react-native-push-notification';
import BaseModel from 'Core/BaseModel';
import * as AppConst from 'Core/AppConst';
import handleError from 'Core/handleError';

YellowBox.ignoreWarnings([
	'Warning: isMounted(...) is deprecated',
	'Module RCTImageLoader requires main',
	'Class RCTCxxModule was not exported'
]);

export default class ShankApp extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			showSpinner: false
		}
	}

	componentWillMount() {
		PushNotification.configure({
			onRegister: async notifObj => {
				try {
					const userStr = await AsyncStorage.getItem(AppConst.USER_PROFILE);
					let currentUser = JSON.parse(userStr);

					await BaseModel.post('app_user/registerPushNotifications', notifObj);
					currentUser.notifications = notifObj;

					await AsyncStorage.setItem(AppConst.USER_PROFILE, JSON.stringify(currentUser));
				} catch (error) {
					handleError(error);
				}
			},

			onNotification: notification => {
				console.log("NOTIFICATION: ", notification);
				PushNotification.setApplicationIconBadgeNumber(0);
				notification.finish(PushNotificationIOS.FetchResult.NoData);
			},

			senderID: "FCM SENDER ID",
			popInitialNotification: true,
			requestPermissions: false
		});

		global.setLoading = flag => this.setState({showSpinner: flag});
	}
	
	render() {
		return (
			<View style={{width: '100%', height: '100%'}}>
				<StatusBar barStyle="light-content" backgroundColor={AppConst.COLOR_BLUE} />
				<Spinner visible={this.state.showSpinner} animation='slide' />
				<DropdownAlert ref={ref => global.dropDownRef = ref} />
				<AppNavigator />
			</View>
		);
	}
}