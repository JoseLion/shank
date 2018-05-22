import React, { Component } from 'react';
import { View, StatusBar, AsyncStorage, PushNotificationIOS, AppState } from 'react-native';
import AppNavigator from './components/navigators/AppNavigator';
import { YellowBox } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import Spinner from 'react-native-loading-spinner-overlay';
import PushNotification from 'react-native-push-notification';
import BaseModel from 'Core/BaseModel';
import { EventRegister } from 'react-native-event-listeners';
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
		this.resetIconBadgeNumber = this.resetIconBadgeNumber.bind(this);
		this.handleAppStateChange = this.handleAppStateChange.bind(this);
		this.state = {
			showSpinner: false
		}
	}

	resetIconBadgeNumber() {
		PushNotification.getApplicationIconBadgeNumber(badgeCount => {
			if (badgeCount > 0) {
				PushNotification.setApplicationIconBadgeNumber(0);
			}
		});
	}

	handleAppStateChange(nextAppState) {
		if (nextAppState === 'active') {
			this.resetIconBadgeNumber();
		}
	}

	componentWillMount() {
		AppState.addEventListener('change', this.handleAppStateChange);
		
		PushNotification.configure({
			onRegister: async notifObj => {
				try {
					const userStr = await AsyncStorage.getItem(AppConst.USER_PROFILE);
					let currentUser = JSON.parse(userStr);
					let tokenPresent = false;
					
					if (currentUser.notifications) {
						currentUser.notifications.forEach(notif => {
							if (notif.token === notifObj.token && notif.os === notifObj.os) {
								tokenPresent = true;
								return;
							}
						});
					}

					if (!tokenPresent) {
						currentUser.notifications = await BaseModel.post('app_user/registerNotificationsToken', notifObj);
						await AsyncStorage.setItem(AppConst.USER_PROFILE, JSON.stringify(currentUser));
					}
				} catch (error) {
					handleError(error);
				}
			},

			onNotification: notification => {
				PushNotification.setApplicationIconBadgeNumber(0);
				notification.finish(PushNotificationIOS.FetchResult.NoData);
			},

			senderID: AppConst.FCM_SENDER_ID,
			popInitialNotification: true,
			requestPermissions: false
		});

		global.setLoading = flag => this.setState({showSpinner: flag});
	}

	componentDidMount() {
		this.resetIconBadgeNumber();
		this.handleErrorEvent = EventRegister.addEventListener(AppConst.EVENTS.showErrorMessageBar, error => this.dropDownRef.alertWithType('error', 'Error', error));
	}

	componentWillUnmount() {
		AppState.removeEventListener('change', this.handleAppStateChange);
		EventRegister.removeEventListener(this.handleErrorEvent);
	}
	
	render() {
		return (
			<View style={{width: '100%', height: '100%'}}>
				<DropdownAlert ref={ref => this.dropDownRef = ref} />
				<StatusBar barStyle="light-content" backgroundColor={AppConst.COLOR_BLUE} />
				<Spinner visible={this.state.showSpinner} animation='slide' />
				<AppNavigator />
			</View>
		);
	}
}