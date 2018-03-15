import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, TabNavigator, NavigationActions } from 'react-navigation';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { BackHandler, TouchableOpacity, Image, Text } from 'react-native';

import * as ShankConstants from '../../core/ShankConstants';

import Splash from '../screens/Splash/Splash';
import Slider from '../screens/Splash/Slider';
import Login from '../screens/SignIn/Login';
import Register from '../screens/SignIn/Register';
import Main from '../screens/Main/MainScreen';
import Profile from '../screens/Profile/Profile';
import Tournament from '../screens/Tournament/Tournament';
import AddGroup from '../screens/Group/AddGroup';
import EditGroup from '../screens/Group/EditGroup';
import Group from '../screens/Group/Group';
import PlayerSelection from '../screens/Group/PlayerSelection';
import PlayerSelectionSearch from '../screens/Group/PlayerSelectionSearch';
import Checkout from '../screens/Group/Checkout';
import Settings from '../screens/Settings/Settings';

export const TabNav = TabNavigator({
	Groups: { screen: Main },
	News: { screen: Tournament },
}, {
	tabBarPosition: 'bottom',
	swipeEnabled: false,
	tabBarOptions: {
		activeTintColor: ShankConstants.TERTIARY_COLOR,
		activeBackgroundColor: ShankConstants.PRIMARY_COLOR,
		inactiveTintColor: ShankConstants.PRIMARY_COLOR,
		inactiveBackgroundColor: ShankConstants.TERTIARY_COLOR_ALT,
		showIcon: true,
		showLabel: true,
		upperCaseLabel: false,
		indicatorStyle: {
			backgroundColor: ShankConstants.PRIMARY_COLOR,
			height: '100%'
		},
		style: {
			backgroundColor: ShankConstants.TERTIARY_COLOR_ALT
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
	EditGroup: { screen: EditGroup },
	Group: { screen: Group },
	PlayerSelection: { screen: PlayerSelection },
	PlayerSelectionSearch: { screen: PlayerSelectionSearch },
	Checkout: { screen: Checkout },
	Settings: { screen: Settings }
}, {
	initialRouteName: 'Splash',
	navigationOptions: {
		headerTintColor: ShankConstants.TERTIARY_COLOR,
		headerTitleStyle: {fontFamily: 'century-gothic', alignSelf: 'center', color: ShankConstants.TERTIARY_COLOR},
		headerStyle: {backgroundColor: ShankConstants.PRIMARY_COLOR},
		headerBackTitle: 'Back'
	}
});

const AppWithNavigationStateCopy = ({dispatch, nav, auth}) => (
	<AppNavigator navigation={addNavigationHelpers({dispatch, state: nav, authState: auth})}/>
);

const mapStateToProps = state => ({
	nav: state.nav,
	auth: state.auth
});

export class AppWithNavigationState extends Component {
	// TODO: Set the back button press action ###
	render() {
		const { dispatch, nav } = this.props;
		
		return (
			<AppNavigator navigation={addNavigationHelpers({dispatch, state: nav})} />
		);
	}
}

AppWithNavigationState.propTypes = {
	dispatch: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired,
	nav: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(AppWithNavigationState);