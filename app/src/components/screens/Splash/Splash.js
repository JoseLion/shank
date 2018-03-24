// React components:
import React from 'react';
import { Animated, AsyncStorage, Image, View } from 'react-native';
import { Constants } from 'expo';

// Shank components:
import { BaseComponent, AppConst } from '../BaseComponent';
import ViewStyle from './styles/splashStyle';

import ShankLogo from '../../../../resources/shank-logo.png';
import ShankWiredLogo from '../../../../resources/shank-wired-logo.png';

export default class SplashScreen extends BaseComponent {

	static navigationOptions = ({navigation}) => ({
		title: 'Splash',
		header: null
	});

	constructor(props) {
		super(props);
		this.state = {
			fade: new Animated.Value(0),
			wiredOpacity: 0
		};
	}

	sleep(timeMs) {
		return new Promise(resolve => setTimeout(resolve, timeMs));
	}

	async componentDidMount() {
		await this.sleep(500);

		Animated.timing(this.state.fade, {toValue: 1, duration: 750}).start(async () => {
			await this.sleep(500);

			this.setState({wiredOpacity: 1});
			Animated.timing(this.state.fade, {toValue: 0, duration: 1000}).start(async () => {
				await this.sleep(500);
				const isFisrtOpen = await AsyncStorage.getItem(AppConst.FIRST_TIME);

				if (isFisrtOpen) {
					this.props.navigation.navigate('Main', {auth: true});
				} else {
					await AsyncStorage.setItem(AppConst.FIRST_TIME, 'no');
					this.props.navigation.navigate('Slider', {auth: false});
				}
			});
		});
	}

	render() {
		return (
			<View style={ViewStyle.mainContainer}>
				<Image source={ShankWiredLogo} resizeMode={'contain'} resizeMethod={'resize'} style={[ViewStyle.wiredLogo, {opacity: this.state.wiredOpacity}]} />
				<Animated.Image source={ShankLogo} resizeMode={'contain'} resizeMethod={'resize'} style={[ViewStyle.logo, {opacity: this.state.fade}]} />
			</View>
		);
	}
}