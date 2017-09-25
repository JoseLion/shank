import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, Image, Button} from 'react-native';
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
                </View>
                <View style={LocalStyles.slide}>
                    <Image style={LocalStyles.coverImage}
                           source={require('../../../../resources/initSlider/IOS/slider/init2/sliderInit2.png')}/>
                </View>
                <View style={LocalStyles.slide}>
                    <Image style={LocalStyles.coverImage}
                           source={require('../../../../resources/initSlider/IOS/slider/init3/sliterInit3.png')}>
                        <Text style={MainStyles.shankTitle}>SHANK</Text>
                        <Text style={MainStyles.medShankFont}>GET YOUR REWARD</Text>
                        <Text style={MainStyles.smallShankFont}>PROFIT FROM</Text>
                        <Text style={MainStyles.smallShankFont}>THE OUTCOME</Text>
                        <Text style={MainStyles.smallShankFont}>AND BET</Text>
                        <Text style={MainStyles.smallShankFont}>AGAIN</Text>
                        <View><Button style={MainStyles.startButton}
                                      onPress={() => navigation.dispatch({type: 'Slider'})}
                                      title="Let's get start"
                                      color= "#556E3E"/>
                        </View>
                    </Image>
                </View>
            </Swiper>
        );
    }
}