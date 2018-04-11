import React, { Component } from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
//import { Font } from 'expo';

import AppReducer from './components/reducers';
import AppWithNavigationState from './components/navigators/AppNavigator';

class ShankApp extends Component {
	store = createStore(AppReducer);

	/*componentDidMount() {
		Font.loadAsync({
			'century-gothic': require('./assets/fonts/CenturyGothic.ttf'),
			'century-gothic-bold': require('./assets/fonts/CenturyGothicBold.ttf'),
			'century-gothic-bold-italic': require('./assets/fonts/CenturyGothicBoldItalic.ttf'),
			'century-gothic-italic': require('./assets/fonts/CenturyGothicItalic.ttf')
		});
	}*/

	render() {
		return (
			<Provider store={this.store}>
				<AppWithNavigationState />
			</Provider>
		);
	}
}

AppRegistry.registerComponent('ShankApp', () => ShankApp);

export default ShankApp;