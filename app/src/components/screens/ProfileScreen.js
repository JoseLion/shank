import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Styles from '../../styles/main';

const ProfileScreen = () => (
    <View style={Styles.container}>
        <Text style={Styles.welcome}>
            Profile Screen
        </Text>
    </View>
);

ProfileScreen.navigationOptions = {
    title: 'Profile',
};

export default ProfileScreen;