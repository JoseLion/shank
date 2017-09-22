import React from 'react';
import {StyleSheet, Text, View, Image, Button} from 'react-native';
import MainStyles from '../../../styles/main';
import Swiper from 'react-native-swiper';
import LocalStyles from './styles/local'

const SwiperScreen = ({navigation}) =>
    (
        <Swiper style={LocalStyles.wrapper} showsButtons={false}>
            <View style={LocalStyles.slide1}>
                <Image style={LocalStyles.coverImage}
                       source={require('../../../../resources/initSlider/IOS/slider/init1/sliderInit1.png')}/>
            </View>
            <View style={LocalStyles.slide2}>
                <Image style={LocalStyles.coverImage}
                       source={require('../../../../resources/initSlider/IOS/slider/init2/sliderInit2.png')}/>
            </View>
            <View style={LocalStyles.slide3}>
                <Image style={LocalStyles.coverImage}
                       source={require('../../../../resources/initSlider/IOS/slider/init3/sliterInit3.png')}>
                    <View>
                        <Text style={MainStyles.shankTitle}>SHANK</Text>
                        <Text style={MainStyles.medShankFont}>GET YOUR REWARD</Text>
                        <Text style={MainStyles.smallShankFont}>PROFIT FROM THE OUTCOME AND BET AGAIN</Text>
                        <Button style={LocalStyles.startButton}
                                onPress={() => navigation.dispatch({type: 'Slider'})}
                                title="Let's get started"/>
                    </View>
                </Image>

            </View>
        </Swiper>
    );
SwiperScreen.navigationOptions = {
    title: 'Slider',
    header: null
};
export default SwiperScreen;