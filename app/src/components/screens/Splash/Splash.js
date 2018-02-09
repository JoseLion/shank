// React components:
import React from 'react';
import {
  Animated,
  AsyncStorage,
  Image,
  Linking,
  StatusBar,
  View
} from 'react-native';

import { Constants } from 'expo';

// Shank components:
import { BaseComponent, MainStyles, ShankConstants } from '../BaseComponent';
import LocalStyles from './styles/local';

import BackgroundSolid from '../../../../resources/shank_logo.png';
import BackgroundTransparent from '../../../../resources/shank_fade_out.png';

var qs = require('qs');

export default class SplashScreen extends BaseComponent {

  static navigationOptions = ({navigation}) => ({
    title: 'Splash',
    header: null,
    imageSource: null
  });

  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0)
    };
  };

  componentDidMount() {
    this.setState({imageSource: BackgroundSolid});

    Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 2500 }).start(() => {
      Animated.timing(this.state.fadeAnim, { toValue: 0, duration: 500 }).start(() => {
        this.setState({imageSource: BackgroundTransparent});
        Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 2500 }).start(() => {
          Animated.timing(this.state.fadeAnim, { toValue: 0, duration: 2000 }).start(() => {
            AsyncStorage.getItem(ShankConstants.FIRST_TIME).then(firstTime => {
              if (firstTime) {
                this.props.navigation.navigate('Main', {auth: true});
              }
              else {
                AsyncStorage.setItem(ShankConstants.FIRST_TIME, 'no');
                this.props.navigation.navigate('Slider', {auth: false})
              }
            });
          });
        });
      });
    });
  };

  componentWillUnmount() {
    clearTimeout(this.timeoutHandle);
  };

  render() {
    let { fadeAnim } = this.state;
    return (
      <View style={[MainStyles.container, LocalStyles.container]}>
        <StatusBar hidden={false}/>
        <Animated.View style={{opacity: fadeAnim}}>
          <Image source={this.state.imageSource} style={[MainStyles.iconXLG]}/>
        </Animated.View>
      </View>
    );
  }
}
