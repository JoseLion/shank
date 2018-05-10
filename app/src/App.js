import React, { Component } from 'react';
import { AppRegistry, View } from 'react-native';
import AppNavigator from './components/navigators/AppNavigator';
import { YellowBox } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import Spinner from 'react-native-loading-spinner-overlay';

YellowBox.ignoreWarnings([
	'Warning: isMounted(...) is deprecated',
	'Module RCTImageLoader requires main',
	'Class RCTCxxModule was not exported'
]);

export default class ShankApp extends Component {
	
	constructor(props) {
		super(props);
		this.state = {
			showSpinner: false
		}
	}

	componentWillMount() {
		global.setLoading = flag => this.setState({showSpinner: flag});
	}
	
	render() {
		return (
			<View style={{width: '100%', height: '100%'}}>
				<Spinner visible={this.state.showSpinner} animation='slide' />
				<DropdownAlert ref={ref => global.dropDownRef = ref} />
				<AppNavigator />
			</View>
		);
	}
}