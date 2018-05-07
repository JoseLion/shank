import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import AppNavigator from './components/navigators/AppNavigator';
import { YellowBox } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';

YellowBox.ignoreWarnings([
	'Warning: isMounted(...) is deprecated',
	'Module RCTImageLoader requires main',
	'Class RCTCxxModule was not exported'
]);

export default class ShankApp extends Component {
	render() {
		return (
			<View style={{width: '100%', height: '100%'}}>
				<DropdownAlert ref={ref => global.dropDownRef = ref} />
				<AppNavigator />
			</View>
		);
	}
}