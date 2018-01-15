import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, TabNavigator, NavigationActions } from 'react-navigation';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { BackHandler } from 'react-native';

import * as Constants from '../../core/Constants';

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
import Settings from '../screens/Settings/Settings';

export const TabNav = TabNavigator({
    Groups: { screen: Main },
    News: { screen: Tournament },
}, {
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    tabBarOptions: {
        activeTintColor: Constants.TERTIARY_COLOR,
        activeBackgroundColor: Constants.PRIMARY_COLOR,
        inactiveTintColor: Constants.PRIMARY_COLOR,
        inactiveBackgroundColor: Constants.TERTIARY_COLOR_ALT,
        showIcon: true,
        showLabel: true,
        upperCaseLabel: false,
        indicatorStyle: {
            backgroundColor: Constants.PRIMARY_COLOR,
            height: '100%'
        },
        style: {
            backgroundColor: Constants.TERTIARY_COLOR_ALT
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
    Settings: { screen: Settings }
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
            <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
        );
    }
}

AppWithNavigationState.propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    nav: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(AppWithNavigationState);
