import React from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});

const SplashScreen = ({navigation}) => (
    <View style={styles.container}>
        <Text style={styles.welcome}>

        </Text>
        <Text style={styles.instructions}>
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