import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, Image, Button, TouchableHighlight, TouchableOpacity} from 'react-native';
import MainStyles from '../../../styles/main';
import Swiper from 'react-native-swiper';
import LocalStyles from './styles/local'

export default class SliderScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'Slider',
        header: null
    };

    constructor(props) {
        super(props);

    }

    render() {
        let logoRegular = require('../../../../resources/initSlider/IOS/logo/slider1Logo.png');
        let ImgSlideOne = require('../../../../resources/initSlider/IOS/slider/init1/sliderInit1.png');
        let ImgSlideTwo = require('../../../../resources/initSlider/IOS/slider/init2/sliderInit2.png');
        let ImgSlideThree = require('../../../../resources/initSlider/IOS/slider/init3/sliterInit3.png');
        return (
            <Swiper style={LocalStyles.wrapper} showsButtons={false}>
                <View style={LocalStyles.slide}>
                    <Image style={LocalStyles.coverImage}
                           source={ImgSlideOne}>
                        <Text style={LocalStyles.titleTxtSlideOne}>SHANK</Text>
                        <Text style={LocalStyles.medTxtSlideOne}>INVITE YOUR FRIENDS</Text>
                        <View style={LocalStyles.positionTextSlideOne}>
                            <Text style={LocalStyles.botTxtSlideOne}>ADD THEM{"\n"}ON YOUR{"\n"}BETTING GROUP{"\n"}OR
                                JOIN{"\n"}AN
                                EXISTING {"\n"}ONE</Text>
                        </View>
                        <Image style={LocalStyles.shankLogoSlideOne}
                               source={logoRegular}>
                        </Image>
                    </Image>
                </View>
                <View style={LocalStyles.slide}>
                    <Image style={LocalStyles.coverImage}
                           source={ImgSlideTwo}>
                        <Text style={LocalStyles.titleTxtSlideTwo}>SHANK</Text>
                        <Text style={LocalStyles.medTxtSlideTwo}>BET ON YOUR{"\n"}FAVORITE PLAYERS</Text>
                        <View style={LocalStyles.positionTextSlideTwo}>
                            <Text style={LocalStyles.botTxtSlideTwo}>RAISE{"\n"}YOUR STAKES{"\n"}FOR
                                A{"\n"}BIGGER{"\n"}PRIZE</Text>
                        </View>
                        <Image style={LocalStyles.shankLogoSlideTwo}
                               source={logoRegular}>
                        </Image>
                    </Image>
                </View>
                <View style={LocalStyles.slide}>
                    <Image style={LocalStyles.coverImage}
                           source={ImgSlideThree}>
                        <Text style={LocalStyles.titleTxtSlideThree}>SHANK</Text>
                        <Text style={LocalStyles.medTxtSlideThree}>GET YOUR REWARD</Text>
                        <View style={LocalStyles.positionTextSlideThree}>
                            <Text style={LocalStyles.botTxtSlideThree}>PROFIT FROM{"\n"}THE
                                OUTCOME {"\n"}
                                AND BET{"\n"}AGAIN</Text>
                        </View>
                        <Image style={LocalStyles.shankLogoTopSlideThree}
                               source={logoRegular}>
                        </Image>
                        <Image style={LocalStyles.shankLogoBotSlideThree}
                               source={logoRegular}>
                        </Image>
                    </Image>
                    <TouchableOpacity style={LocalStyles.buttonStart}
                                        onPress={() => this.props.navigation.dispatch({type: 'Main'})}>
                        <Text style={LocalStyles.text}>Let's get start</Text>
                    </TouchableOpacity>
                </View>
            </Swiper>
        );
    }
}