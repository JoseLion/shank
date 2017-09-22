import React from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View} from 'react-native';
import Styles from '../../styles/main';

const LoginScreen = ({navigation}) => (
    <View style={Styles.container}>
        <Text style={Styles.welcome}>
            Screen A
        </Text>
        <Text style={Styles.instructions}>
            This is great
        </Text>
        <Button
            onPress={() => navigation.dispatch({type: 'Login'})}
            title="Log in"
        />
    </View>
);

LoginScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
};

LoginScreen.navigationOptions = {
    title: 'Log In',
};

export default LoginScreen;