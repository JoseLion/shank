import React from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View} from 'react-native';
// import {StyleSheet, View} from 'react-native';
import Styles from '../../styles/main';

// import LoginStatusMessage from './LoginStatusMessage';
// import AuthButton from './AuthButton';
// const MainScreen = () => (
//     <View style={styles.container}>
//         <LoginStatusMessage/>
//         <AuthButton/>
//     </View>
// );

const MainScreen = ({navigation}) => (
    <View style={Styles.container}>
        <Text style={Styles.welcome}>
            Screen A
        </Text>
        <Text style={Styles.instructions}>
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
    </View>
);

MainScreen.propTypes = {
    navigation: PropTypes.object.isRequired,
};

MainScreen.navigationOptions = {
    title: 'Home Screen',
};

export default MainScreen;