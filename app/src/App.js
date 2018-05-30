import React, { Component } from 'react';
import { View, StatusBar, AsyncStorage, PushNotificationIOS, AppState } from 'react-native';
import AppNavigator from './components/navigators/AppNavigator';
import { NavigationActions } from 'react-navigation';
import { YellowBox } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import Spinner from 'react-native-loading-spinner-overlay';
import PushNotification from 'react-native-push-notification';
import BaseModel from 'Core/BaseModel';
import { EventRegister } from 'react-native-event-listeners';
import * as AppConst from 'Core/AppConst';
import handleError from 'Core/handleError';
import LoadingIndicator from './components/common/LoadingIndicator';

YellowBox.ignoreWarnings([
	'Warning: isMounted(...) is deprecated',
	'Module RCTImageLoader requires main',
	'Class RCTCxxModule was not exported'
]);

global.setLoading = function(flag) {
    EventRegister.emit("EVT_SET_LOADING", flag);
}

export default class ShankApp extends Component {
	
	constructor(props) {
		super(props);
		this.resetIconBadgeNumber = this.resetIconBadgeNumber.bind(this);
		this.handleAppStateChange = this.handleAppStateChange.bind(this);
		this.logout = this.logout.bind(this);
        this.showError = this.showError.bind(this);
        this.setLoading = this.setLoading.bind(this);
		this.state = {
			showLoading: false
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

	async logout() {
        global.setLoading(true);
        const pushToken = await AsyncStorage.getItem(AppConst.PUSH_TOKEN).catch(handleError);
        await BaseModel.post('app_user/logout', { pushToken }).catch(handleError);
        await AsyncStorage.removeItem(AppConst.AUTH_TOKEN).catch(handleError);
        global.setLoading(false);
        
		setTimeout(() => {
			this.navigation.dispatch(NavigationActions.reset({
				index: 0,
				actions: [NavigationActions.navigate({routeName: 'Login'})],
            }));
		}, 0);
	}

	showError(error) {
        this.dropDownRef.alertWithType('error', 'Error', error);
    }
    
    setLoading(showLoading) {
        this.setState({ showLoading });
    }

	componentWillMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
        EventRegister.addEventListener("EVT_SET_LOADING", this.setLoading);
		EventRegister.addEventListener(AppConst.EVENTS.logout, this.logout);
		EventRegister.addEventListener(AppConst.EVENTS.showErrorMessageBar, this.showError);
		
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
                        await AsyncStorage.setItem(AppConst.PUSH_TOKEN, notifObj.token);
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
	}

	componentDidMount() {
        this.resetIconBadgeNumber();
	}

	componentWillUnmount() {
		AppState.removeEventListener('change', this.handleAppStateChange);
		EventRegister.removeAllListeners();
	}
	
	render() {
		return (
			<View style={{width: '100%', height: '100%'}}>
                <DropdownAlert ref={ref => this.dropDownRef = ref} zIndex={9999} onClose={() => this.setLoading(false)} />
				<StatusBar barStyle="light-content" backgroundColor={AppConst.COLOR_BLUE} />
                <LoadingIndicator visible={this.state.showLoading} />
				
				<AppNavigator ref={ref => this.navigation = ref} />
			</View>
		);
	}
}