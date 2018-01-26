import React from 'react';
import {AppRegistry} from 'react-native';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';

import AppReducer from './components/reducers';
import AppWithNavigationState from './components/navigators/AppNavigator';

class ShankApp extends React.Component {
  store = createStore(AppReducer);
  render() {
    return (
      <ActionSheetProvider>
        <Provider store={this.store}>
          <AppWithNavigationState/>
        </Provider>
      </ActionSheetProvider>
    );
  }
}

AppRegistry.registerComponent('ShankApp', () => ShankApp);

export default ShankApp;
