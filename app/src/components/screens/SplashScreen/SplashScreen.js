import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View, Image, StatusBar} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';

const logoTrans = require('../../../../resources/shankLogo/IOS/trans/shankLogoTrans.png');
const logoRegular = require('../../../../resources/shankLogo/IOS/regular/shankLogo.png');

class Greeting extends Component {
    constructor(props) {
        super(props);
        this.state = {showImages: true};
        // Toggle the state every second
        setInterval(() => {
            this.setState(previousState => {
                return {showImages: !previousState.showImages};
            });
        }, 1000);
    }

    render() {
        let imgSource = this.state.showImages ? logoTrans : logoRegular;
        return (
            <Image source={imgSource}
                   style={MainStyles.iconXLG}/>
        );
    }
}

const SplashScreen = ({navigation}) => {
    return (
        <View style={LocalStyles.container}>
            <StatusBar hidden={true}/>
            <Greeting/>
            <Button
                onPress={() => navigation.dispatch({type: 'Splash'})}
                title="Go to Log in"/>
        </View>
    );
};

SplashScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
};

SplashScreen.navigationOptions = {
    title: 'Splash',
    header: null
};


export default SplashScreen;