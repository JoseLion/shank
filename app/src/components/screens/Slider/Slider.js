import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, Image, Button,TouchableHighlight} from 'react-native';
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
        let navigation = this.props.navigation;
        return (
            <Swiper style={LocalStyles.wrapper} showsButtons={false}>
                <View style={LocalStyles.slide}>
                    <Image style={LocalStyles.coverImage}
                           source={require('../../../../resources/initSlider/IOS/slider/init1/sliderInit1.png')}/>
                    <Text style={LocalStyles.shankTitle}>SHANK</Text>
                    <Text style={LocalStyles.medFont}>ADD THEM</Text>
                    <Text style={LocalStyles.smallShankFont1}>ON YOUR{"\n"}BETTING GROUP{"\n"}OR JOIN{"\n"}AN EXISTING {"\n"}ONE</Text>
                </View>
                <View style={LocalStyles.slide}>
                    <Image style={LocalStyles.coverImage}
                           source={require('../../../../resources/initSlider/IOS/slider/init2/sliderInit2.png')}/>
                    <Text style={MainStyles.shankTitle}>SHANK</Text>
                    <Text style={MainStyles.medShankFont}>BET ON YOUR{"\n"}FAVORITE PLAYERS</Text>
                    <Text style={LocalStyles.smallFont}>RAISE{"\n"}YOUR STAKES{"\n"}FOR A{"\n"}BIGGER{"\n"}PRIZE</Text>
                </View>
                <View style={LocalStyles.slide}>
                    <Image style={LocalStyles.coverImage}
                           source={require('../../../../resources/initSlider/IOS/slider/init3/sliterInit3.png')}>
                        <Text style={LocalStyles.shankTitle}>SHANK</Text>
                        <Text style={LocalStyles.medFont}>GET YOUR REWARD</Text>
                        <Text style={LocalStyles.smallFont}>GET YOUR REWARD {"\n"}PROFIT FROM{"\n"}THE OUTCOME {"\n"} AND BET{"\n"}AGAIN</Text>
                        <Image style={LocalStyles.shankLogo}
                               source={require('../../../../resources/initSlider/IOS/logo/slider1Logo.png')}>
                        </Image>
                    </Image>

                    <TouchableHighlight style={LocalStyles.buttonStart} onPress={() => navigation.dispatch({type: 'Slider'})}>
                        <Text style={LocalStyles.text}>Let's get start</Text>
                    </TouchableHighlight>
                </View>
            </Swiper>
        );
    }
}