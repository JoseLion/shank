import React from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View} from 'react-native';
import Styles from '../../styles/main';

const SplashScreen = ({navigation}) => (
    <View style={Styles.container}>
        <Text style={Styles.welcome}>

        </Text>
        <Text style={Styles.instructions}>
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