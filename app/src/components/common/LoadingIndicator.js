import React, { Component } from 'react';

import { StyleSheet, View, ActivityIndicator } from 'react-native';
import * as AppConst from 'Core/AppConst';

class LoadingIndicator extends Component {
  render () {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1, backgroundColor: AppConst.COLOR_GRAY}}>
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
