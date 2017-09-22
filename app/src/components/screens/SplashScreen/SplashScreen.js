import React from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'

const SplashScreen = ({navigation}) => (
    <View style={LocalStyles.container}>
        <Text style={MainStyles.welcome}>

        </Text>
        <Text style={MainStyles.instructions}>
            Splash
        </Text>
        <Button
            onPress={() => navigation.dispatch({type: 'Splash'})}
            title="Go to Log in"
        />
    </View>
);

SplashScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
};

SplashScreen.navigationOptions = {
    title: 'Splash',
};

export default SplashScreen;