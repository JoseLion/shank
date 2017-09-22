import React from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'

const LoginScreen = ({navigation}) => (
    <View style={MainStyles.container}>
        <Text style={MainStyles.welcome}>
            Screen A
        </Text>
        <Text style={MainStyles.instructions}>
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
    // header: null,
};

export default LoginScreen;