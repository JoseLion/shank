import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View, Image} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'
let Icon = require('react-native-vector-icons/Ionicons');

import LoginStatusMessage from './LoginStatusMessage';
import AuthButton from './AuthButton';


export default class MainScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'BETTING GROUPS',
        headerTitleStyle: { alignSelf: 'center' },
        headerLeft: null,
      /*  headerRight:
            <Icon name={'plus'} onPress={() => this.propTypes.navigation.dispatch({type: 'Slider'})}  />,
        headerStyle: {
            backgroundColor: MainStyles.shankGreen
        },*/
    };

    constructor(props) {
        super(props);
    }

    render() {
        let navigation = this.props.navigation;
        return (
            <View style={MainStyles.container}>
                <Text style={MainStyles.groupsNone}>
                    Tap on the "+" button to create {"\n"} or join a betting group"
                </Text>
            </View>
        );
    }
}