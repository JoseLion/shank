/**
 * Created by MnMistake on 9/24/2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View, TextInput, TouchableHighlight} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'

export default class Register extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'REGISTRO',
        headerTitleStyle: { alignSelf: 'center' },
        headerLeft: null
    };

    constructor(props) {
        super(props);
        this.state = { name: 'Name', email: 'Email', password: 'Password', repeatedPassword: 'Repeat your password' };
    }

    render() {
        let navigation = this.props.navigation;
        return (
            <View style={MainStyles.container}>
                <Text style={[MainStyles.centerText,MainStyles.greenMedShankFont]}>
                    WELCOME
                </Text>
                <Text style={[MainStyles.centerText,MainStyles.greenMedShankFont, MainStyles.inputTopSeparation]}>
                    LETS START BY CREATING {"\n"} AN ACCOUNT
                </Text>
                <TextInput
                    style={MainStyles.loginInput}
                    onChangeText={(name) => this.setState({name})}
                    value={this.state.name}
                />
                <TextInput
                    style={MainStyles.loginInput}
                    onChangeText={(email)=> this.setState({email})}
                    value={this.state.email}
                />
                <TextInput
                    style={MainStyles.loginInput}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                />
                <TextInput
                    style={MainStyles.loginInput}
                    onChangeText={(repeatedPassword) => this.setState({repeatedPassword})}
                    value={this.state.repeatedPassword}
                />
                <TouchableHighlight
                    onPress={this._handleNewRegistry}
                    style={MainStyles.goldenShankButton}>
                    <Text style={LocalStyles.buttonText}>Register</Text>
                </TouchableHighlight>
            </View>
        );
    }

    _handleNewRegistry(){
        
    }
        
}