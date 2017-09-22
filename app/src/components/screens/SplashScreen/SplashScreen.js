import React from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View, Image, StatusBar} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';

function componentWillMount(navigation) {
    console.log("Si entra mmvga");
    setTimeout(() => {
        navigation.dispatch({type: 'Splash'});
    }, 500);
}

const SplashScreen = ({navigation}) => {

    return (
        <View style={LocalStyles.container}>
            {componentWillMount(navigation)}
            <StatusBar hidden={true}/>
            <Image
                source={require('../../../../resources/shankLogo/IOS/regular/shankLogo.png')}
                style={MainStyles.iconLG}/>
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