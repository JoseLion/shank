import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {createStore} from 'redux';

import AppReducer from './components/reducers';
import AppWithNavigationState from './components/navigators/AppNavigator';

class ShankApp extends React.Component {
    store = createStore(AppReducer);

    render() {
        return (
            <Provider store={this.store}>
                <AppWithNavigationState/>
            </Provider>
        );
    }
}

AppRegistry.registerComponent('ShankApp', () => ShankApp);

export default ShankApp;