import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addNavigationHelpers, StackNavigator, TabNavigator} from 'react-navigation';

import Splash from '../screens/Splash/Splash'
import Login from '../screens/Login/Login';
import Main from '../screens/Main/Main';
import Profile from '../screens/Profile/Profile';
import Slider from '../screens/Slider/Slider';
import Tournament from '../screens/Tournament/Tournament';
import Group from '../screens/Group/Group';
import Register from '../screens/Register/Register';
import SingleGroup from '../screens/Group/SingleGroup';

export const TabNav = TabNavigator({
        Groups: {
            screen: Main,
        },
        News: {
            screen: Tournament,
        },
    }, {
        tabBarPosition: 'bottom',
        tabBarOptions: {
            activeTintColor: '#fff',
            style: {
                backgroundColor: "#556E3E",
            }
        },
        labelStyle: {
            fontWeight: 'bold',
        }
    }
);

export const AppNavigator = StackNavigator({
    Splash: {screen: Splash},
    Login: {screen: Login},
    Main: {screen: TabNav},
    Profile: {screen: Profile},
    Slider: {screen: Slider},
    Group: {screen: Group},
    Register: {screen: Register},
    SingleGroup: {screen: SingleGroup},
});

const AppWithNavigationState = ({dispatch, nav, auth}) => (
    <AppNavigator navigation={addNavigationHelpers({dispatch, state: nav, authState: auth})}/>
);

AppWithNavigationState.propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    nav: state.nav,
    auth: state.auth
});

export default connect(mapStateToProps)(AppWithNavigationState);