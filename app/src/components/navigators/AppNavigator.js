import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, TabNavigator, NavigationActions } from 'react-navigation';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { BackHandler, TouchableOpacity, Image, Text } from 'react-native';

import * as AppConst from '../../core/AppConst';

import Splash from '../screens/Splash/Splash';
import Slider from '../screens/Splash/Slider';
import Login from '../screens/SignIn/Login';
import Register from '../screens/SignIn/Register';
import Main from '../screens/Main/MainScreen';
import Profile from '../screens/Profile/Profile';
import Tournament from '../screens/Tournament/Tournament';
import AddGroup from '../screens/Group/AddGroup';
import Group from '../screens/Group/Group';
import PlayerSelection from '../screens/Group/PlayerSelection';
import Checkout from '../screens/Group/Checkout';
import Settings from '../screens/Settings/Settings';

export const TabNav = TabNavigator({
	Groups: { screen: Main },
	News: { screen: Tournament },
}, {
	tabBarPosition: 'bottom',
	swipeEnabled: false,
	tabBarOptions: {
		activeTintColor: AppConst.COLOR_WHITE,
		activeBackgroundColor: AppConst.COLOR_BLUE,
		inactiveTintColor: AppConst.COLOR_BLUE,
		inactiveBackgroundColor: AppConst.COLOR_GRAY,
		showIcon: true,
		showLabel: true,
		upperCaseLabel: false,
		indicatorStyle: {
			backgroundColor: AppConst.COLOR_BLUE,
			height: '100%'
		},
		style: {
			backgroundColor: AppConst.COLOR_GRAY
		},
		labelStyle: {
			fontWeight: 'bold'
		}
	}
});

export const AppNavigator = StackNavigator({
	Splash: { screen: Splash },
	Slider: { screen: Slider },
	Login: { screen: Login },
	Register: { screen: Register },
	Main: { screen: TabNav },
	Profile: { screen: Profile },
	AddGroup: { screen: AddGroup },
	Group: { screen: Group },
	PlayerSelection: { screen: PlayerSelection },
	Checkout: { screen: Checkout },
	Settings: { screen: Settings }
}, {
	initialRouteName: 'Splash',
	navigationOptions: {
		headerTintColor: AppConst.COLOR_WHITE,
		headerTitleStyle: {fontFamily: 'century-gothic', alignSelf: 'center', color: AppConst.COLOR_WHITE},
		headerStyle: {backgroundColor: AppConst.COLOR_BLUE},
		headerBackTitle: 'Back'
	}
});

const mapStateToProps = state => ({
	nav: state.nav,
	auth: state.auth
});

export class AppWithNavigationState extends Component {
	render() {
		const { dispatch, nav } = this.props;
		
		return (
			<AppNavigator />
		);
	}
}

AppWithNavigationState.propTypes = {
	dispatch: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	nav: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(AppWithNavigationState);