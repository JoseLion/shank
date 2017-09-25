/**
 * Created by MnMistake on 9/24/2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'

export default class TournamentsScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'TOURNAMENTS',
        headerTitleStyle: { alignSelf: 'center' },
        headerLeft: null
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
            </View>
        );
    }
}