import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {addNavigationHelpers, StackNavigator} from 'react-navigation';

import SplashScreen from '../screens/SplashScreen/SplashScreen'
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import MainScreen from '../screens/MainScreen/MainScreen';
import ProfileScreen from '../screens/ProfileScreen/ProfileScreen';
import SwiperScreen from "../screens/SliderScreen/SwiperScreen";


export const AppNavigator = StackNavigator({
    Splash: {screen: SplashScreen},
    Login: {screen: LoginScreen},
    Main: {screen: MainScreen},
    Profile: {screen: ProfileScreen},
    Slider: {screen: SwiperScreen},
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