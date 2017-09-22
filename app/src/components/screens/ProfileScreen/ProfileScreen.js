import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'

const ProfileScreen = () => (
    <View style={MainStyles.container}>
        <Text style={MainStyles.welcome}>
            Profile Screen
        </Text>
    </View>
);

ProfileScreen.navigationOptions = {
    title: 'Profile',
};

export default ProfileScreen;