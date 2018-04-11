import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import AppNavigator from './components/navigators/AppNavigator';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings([
	'Warning: isMounted(...) is deprecated'
]);

export default class ShankApp extends Component {
	render() {
		return (<AppNavigator />);
	}
}