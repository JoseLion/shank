import React from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View} from 'react-native';
// import {StyleSheet, View} from 'react-native';

// import LoginStatusMessage from './LoginStatusMessage';
// import AuthButton from './AuthButton';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});

// const MainScreen = () => (
//     <View style={styles.container}>
//         <LoginStatusMessage/>
//         <AuthButton/>
//     </View>
// );

const MainScreen = ({navigation}) => (
    <View style={styles.container}>
        <Text style={styles.welcome}>
            Screen A
        </Text>
        <Text style={styles.instructions}>
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