import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View, TextInput} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'


export default class LoginScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'LOG IN',
    };

    constructor(props) {
        super(props);
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
                    onChangeText={(text)=> this.setState({username: text})}
                    value={this.state.text}
                    placeholder="Email"
                />
                <TextInput
                    style={MainStyles.loginInput}
                    onChangeText={(password)=> this.setState({password: password})}
                    value={this.state.password}
                    placeholder="Password"
                />
                <Button style={MainStyles.goldenShankButton}
                    onPress={this._onLoginPressed}
                    title="Log in"
                />
                <Button
                    onPress={this._handleFacebookLogin}
                    title="Continue with Facebook"
                />
                <Text style={MainStyles.smallShankFont}>
                    Forgot my password
                </Text>
            </View>
        );
    }

    _onLoginPressed(){

    }

    _handleFacebookLogin(){

    }
}

