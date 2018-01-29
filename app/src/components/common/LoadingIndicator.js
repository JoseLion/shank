import React, { Component } from 'react';

import { StyleSheet, View, ActivityIndicator } from 'react-native';
import * as ShankConstants from '../../core/ShankConstants';

class LoadingIndicator extends Component {
  render () {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: ShankConstants.TERTIARY_COLOR_ALT}}>
          <ActivityIndicator
            color={'#fff'}
            style={{paddingTop: 100}}
            size="large"
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({

});

export default LoadingIndicator;
