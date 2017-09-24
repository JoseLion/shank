import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'


export default class LoginScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'Log In',
    };

    constructor(props) {
        super(props);
    }

    render() {
        let navigation = this.props.navigation;
        return (
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
    }
}