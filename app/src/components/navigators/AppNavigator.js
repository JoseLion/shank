import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, TabNavigator, NavigationActions } from 'react-navigation';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import { BackHandler } from 'react-native';

import * as Constants from '../../core/Constants';

import Splash from '../screens/Splash/Splash'
import Slider from '../screens/Slider/Slider';
import Register from '../screens/Register/Register';
import Login from '../screens/Login/Login';
import Main from '../screens/Main/Main';
import Profile from '../screens/Profile/Profile';
import Tournament from '../screens/Tournament/Tournament';
import Group from '../screens/Group/Group';
import SingleGroup from '../screens/Group/SingleGroup';
import PlayerSelection from '../screens/Group/PlayerSelection';

export const TabNav = TabNavigator({
    Groups: { screen: Main },
    News: { screen: Tournament },
}, {
    tabBarPosition: 'bottom',
    tabBarOptions: {
        style: {
            backgroundColor: Constants.PRIMARY_COLOR
        },
        labelStyle: {
            fontWeight: 'bold'
        }
    }
});

export const AppNavigator = StackNavigator({
    Splash: { screen: Splash },
    Slider: { screen: Slider },
    Register: { screen: Register },
    Login: { screen: Login },
    Main: { screen: TabNav },
    Profile: { screen: Profile },
    Group: { screen: Group },
    SingleGroup: { screen: SingleGroup },
    PlayerSelection: { screen: PlayerSelection },
});

const AppWithNavigationStateCopy = ({dispatch, nav, auth}) => (
    <AppNavigator navigation={addNavigationHelpers({dispatch, state: nav, authState: auth})}/>
);

const mapStateToProps = state => ({
    nav: state.nav,
    auth: state.auth
});

export class AppWithNavigationState extends Component {
    componentDidMount() { BackHandler.addEventListener('hardwareBackPress', this.onBackPress); }
    componentWillUnmount() { BackHandler.removeEventListener('hardwareBackPress', this.onBackPress); }
    onBackPress = () => {
        const { dispatch, nav } = this.props;
        if (nav.index === 0) {
            return false;
        }
        dispatch(NavigationActions.back());
        return true;
    };
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
    nav: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(AppWithNavigationState);
