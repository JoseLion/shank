import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View, Image, } from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'
let Icon = require('react-native-vector-icons/Ionicons');

import LoginStatusMessage from './LoginStatusMessage';
import AuthButton from './AuthButton';


export default class MainScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
    }

    handleSave() {
 
    }

    static navigationOptions = {
        title: 'BETTING GROUPS',
        headerTitleStyle: { alignSelf: 'center' },
        headerStyle: {
            backgroundColor: MainStyles.shankGreen
        },
        headerLeft: null,
        headerRight: <Button title='+' onPress = {() => this.handleSave()}/>,
        showIcon: true,
        tabBarIcon: () => {
            return(
                <Image
                    source={require('../../../../resources/mainMenu/menuTaskBar/ios/Recurso 9.png')}
                    style={{tintColor: '#000', width: 50, height: 50}}
                />
            )
        },
    };


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