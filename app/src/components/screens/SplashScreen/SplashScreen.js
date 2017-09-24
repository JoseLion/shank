import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View, Image, StatusBar} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';

const logoTrans = require('../../../../resources/shankLogo/IOS/trans/shankLogoTrans.png');
const logoRegular = require('../../../../resources/shankLogo/IOS/regular/shankLogo.png');

let randomHex = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export default class SplashScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'Splash',
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            showImages: true,
            backgroundColor: randomHex()
        };

        setInterval(() => {
            this.setState(previousState => {
                return {
                    showImages: !previousState.showImages,
                    backgroundColor: randomHex(),
                };
            });
        }, 1000);
    }

    render() {
        let navigation = this.props.navigation;
        let imgSource = this.state.showImages ? logoTrans : logoRegular;
        return (
            <View style={[LocalStyles.container, {backgroundColor: this.state.backgroundColor}]}>
                <StatusBar hidden={true}/>
                <Image source={imgSource}
                       style={MainStyles.iconXLG}/>
                <Button
                    onPress={() => navigation.dispatch({type: 'Splash'})}
                    title="Go to Log in"/>
            </View>

        );
    }
}