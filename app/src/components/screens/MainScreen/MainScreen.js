import React from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'

import LoginStatusMessage from './LoginStatusMessage';
import AuthButton from './AuthButton';

const MainScreen = ({navigation}) => (
    <View style={MainStyles.container}>
        <Text style={MainStyles.welcome}>
            Screen A
        </Text>
        <Text style={MainStyles.instructions}>
            This is great
        </Text>
        <Button
            onPress={() => navigation.dispatch({type: 'Main'})}
            title="Go to profile"
        />
        <Button
            onPress={() => navigation.dispatch({type: 'Logout'})}
            title="Logout App"
        />
        <LoginStatusMessage/>
        <AuthButton/>
    </View>
);

MainScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
};

MainScreen.navigationOptions = {
    title: 'Home Screen',
};

export default MainScreen;