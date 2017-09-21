import React from 'react';
import {
    TabNavigator,
} from 'react-navigation';

const BasicApp = TabNavigator({
    Main: {screen: MainScreen},
    Setup: {screen: SetupScreen},
});