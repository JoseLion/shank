import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addNavigationHelpers, StackNavigator, TabNavigator, NavigationActions } from 'react-navigation';
import { BackHandler, TouchableOpacity, Image, Text, Platform } from 'react-native';
import Style from 'ShankStyle';

import * as AppConst from 'Core/AppConst';

import Splash from '../screens/Splash/Splash';
import Slider from '../screens/Splash/Slider';
import Login from '../screens/SignIn/Login';
import Register from '../screens/SignIn/Register';
import Main from '../screens/Main/MainScreen';
import Profile from '../screens/Profile/Profile';
import Tournament from '../screens/Tournament/Tournament';
import AddGroup from '../screens/Group/AddGroup';
import EditGroup from '../screens/Group/EditGroup';
import AddTournament from '../screens/Group/AddTournament';
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
		inactiveTintColor: AppConst.COLOR_GRAY,
		showIcon: true,
		showLabel: true,
		upperCaseLabel: false,
		indicatorStyle: {
			backgroundColor: AppConst.COLOR_BLUE,
			height: 0
		},
		style: {
            backgroundColor: AppConst.COLOR_BLUE,
            paddingVertical: Platform.OS == 'ios' ? '2%' : 0
		},
		labelStyle: {
			fontFamily: Style.CENTURY_GOTHIC_BOLD,
			fontSize: Style.FONT_14,
			marginTop: 0
		}
	}
});

export default AppNavigator = StackNavigator({
	Splash: { screen: Splash },
	Slider: { screen: Slider },
	Login: { screen: Login },
	Register: { screen: Register },
	Main: { screen: TabNav },
	Profile: { screen: Profile },
	AddGroup: { screen: AddGroup },
	EditGroup: { screen: EditGroup },
	AddTournament: {screen: AddTournament},
	Group: { screen: Group },
	PlayerSelection: { screen: PlayerSelection },
	Checkout: { screen: Checkout },
	Settings: { screen: Settings }
}, {
	initialRouteName: 'Splash',
	navigationOptions: {
		headerTintColor: AppConst.COLOR_WHITE,
		headerTitleStyle: {
            flex: 1,
            textAlign: 'center',
            fontFamily: Style.CENTURY_GOTHIC,
            fontSize: Platform.OS == 'ios' ? Style.EM(1) : Style.EM(1.25),
            alignSelf: 'center',
            color: AppConst.COLOR_WHITE
        },
		headerStyle: {
            backgroundColor: AppConst.COLOR_BLUE,
            height: Platform.OS == 'ios' ? Style.EM(2.5) : Style.EM(3.5)
        },
		headerBackTitle: 'Back',
	}
});