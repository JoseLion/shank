import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View, TextInput, TouchableHighlight} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'


export default class LoginScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'LOG IN',
        headerLeft: null
    };

    constructor(props) {
        super(props);
        this.state = {userName: 'Email', password: 'Password'};
    }

    render() {
        let navigation = this.props.navigation;
        return (
            <View style={MainStyles.container}>
                <Text style={MainStyles.greenMedShankFont}>
                    WELCOME BACK
                </Text>
                <TextInput
                    style={MainStyles.loginInput}
                    onChangeText={(userName) => this.setState({userName})}
                    value={this.state.userName}
                />
                <TextInput
                    style={MainStyles.loginInput}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                />
                <TouchableHighlight
                    onPress={this._onLoginPressed}
                    style={MainStyles.goldenShankButton}>
                    <Text style={LocalStyles.buttonText}>Log in</Text>
                </TouchableHighlight>

                <TouchableHighlight
                    onPress={this._handleFacebookLogin}
                    style={LocalStyles.fbButton}>
                    <Text style={LocalStyles.buttonText}>Continue with Facebook</Text>
                </TouchableHighlight>

                <Text style={[MainStyles.smallShankFont, MainStyles.inputTopSeparation]}>
                    Forgot my password
                </Text>
            </View>
        );
    }

    _onLoginPressed() {

    }

    _handleFacebookLogin() {

    }
}

