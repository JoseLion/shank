// React components:
import React from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import Swiper from 'react-native-swiper';

// Shank components:
import { BaseComponent, MainStyles, AppConst } from '../BaseComponent';
import ViewStyle from './styles/sliderStyle';

import ImgSlideOne from '../../../../resources/slider/shank-slider_1.png';
import ImgSlideTwo from '../../../../resources/slider/shank-slider_2.png';
import ImgSlideThree from '../../../../resources/slider/shank-slider_3.png';

export default class SliderScreen extends BaseComponent {

	static navigationOptions = ({navigation}) => ({
		title: 'Slider',
		header: null,
		imageSource: null
	});

	constructor(props) {
		super(props);
		this.goToMainScreen = this.goToMainScreen.bind(this);
	}

	goToMainScreen() {
		this.props.navigation.dispatch(NavigationActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({routeName: 'Main'})],
		}));
	}

	render() {
		return (
			<Swiper showsButtons={false} loop={false}>
				<View style={ViewStyle.slide}>
					<Image style={ViewStyle.coverImage} source={ImgSlideOne} />
				</View>

				<View style={ViewStyle.slide}>
					<Image style={ViewStyle.coverImage} source={ImgSlideTwo}></Image>
				</View>

				<View style={ViewStyle.slide}>
					<Image style={ViewStyle.coverImage} source={ImgSlideThree}></Image>
					
					<TouchableHighlight style={[MainStyles.button, MainStyles.tertiary, ViewStyle.startButton]} underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={this.goToMainScreen}>
						<Text style={MainStyles.buttonLinkText}>Let{"\'"}s get start</Text>
					</TouchableHighlight>
				</View>
			</Swiper>
		);
	}
}
