// React components:
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Image, Button, TouchableHighlight, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper';

// Shank components:
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'

export default class SliderScreen extends Component {

    static propTypes = { navigation: PropTypes.object.isRequired };
    static navigationOptions = {
        title: 'Slider',
        header: null
    };

    constructor(props) {
        super(props);
    }

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
                    <TouchableOpacity style={[MainStyles.button, MainStyles.tertiary, LocalStyles.startButton]} onPress={ () => this.props.navigation.navigate('Register', {url: this.props.navigation.state.params.url}) }>
                        <Text style={MainStyles.buttonLinkText}>Let{"\'"}s get start</Text>
                    </TouchableOpacity>
                </View>
            </Swiper>
        );
    }
}
