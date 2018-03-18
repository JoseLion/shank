// React components:
import React from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';
import Swiper from 'react-native-swiper';

// Shank components:
import { BaseComponent, MainStyles, AppConst } from '../BaseComponent';
import LocalStyles from './styles/local';

export default class SliderScreen extends BaseComponent {

    static navigationOptions = ({navigation}) => ({
        title: 'Slider',
        header: null,
        imageSource: null
    });

    constructor(props) { super(props); }

    render() {
        let ImgSlideOne = require('../../../../resources/slider/shank-slider_1.png');
        let ImgSlideTwo = require('../../../../resources/slider/shank-slider_2.png');
        let ImgSlideThree = require('../../../../resources/slider/shank-slider_3.png');
        return (
            <Swiper showsButtons={false} loop={false}>
                <View style={LocalStyles.slide}>
                    <Image style={LocalStyles.coverImage} source={ImgSlideOne}></Image>
                </View>
                <View style={LocalStyles.slide}>
                    <Image style={LocalStyles.coverImage} source={ImgSlideTwo}></Image>
                </View>
                <View style={LocalStyles.slide}>
                    <Image style={LocalStyles.coverImage} source={ImgSlideThree}></Image>
                    <TouchableHighlight style={[MainStyles.button, MainStyles.tertiary, LocalStyles.startButton]} underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={() => super.navigateToScreen('Login')}>
                        <Text style={MainStyles.buttonLinkText}>Let{"\'"}s get start</Text>
                    </TouchableHighlight>
                </View>
            </Swiper>
        );
    }
}
