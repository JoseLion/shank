import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addNavigationHelpers, StackNavigator, TabNavigator} from 'react-navigation';

import SplashScreen from '../screens/SplashScreen/SplashScreen'
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import MainScreen from '../screens/MainScreen/MainScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import SliderScreen from '../screens/SliderScreen/SliderScreen';
import Tournaments from '../screens/Tournaments/TournamentsScreen';
import Groups from '../screens/Groups/GroupsScreen';

export const TabNav = TabNavigator({
        Groups: {
            screen: MainScreen,
        },
        News: {
            screen: Tournaments,
        },
    }, {
        tabBarPosition: 'bottom',
        tabBarOptions: {
            activeTintColor: '#fff',
            style :{
                backgroundColor:"#556E3E",
            }
        },
        labelStyle:{
            fontWeight: 'bold',
        }
    }
);

export const AppNavigator = StackNavigator({
    Splash: {screen: SplashScreen},
    Login: {screen: LoginScreen},
    Main: {screen: TabNav},
    Profile: {screen: ProfileScreen},
    Slider: {screen: SliderScreen},
    Groups: {screen: Groups},
});

const AppWithNavigationState = ({dispatch, nav}) => (
    <AppNavigator navigation={addNavigationHelpers({dispatch, state: nav})}/>
);

AppWithNavigationState.propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);