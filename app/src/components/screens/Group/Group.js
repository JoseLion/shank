/**
 * Created by MnMistake on 9/24/2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View, TextInput, TouchableHighlight, Image} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'

export default class Group extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'Create Group',
        headerTitleStyle: {alignSelf: 'center'},
        headerLeft: null
    };

    constructor(props) {
        super(props);
        this.state = {name: 'Group name', selectTournament: 'Select tournament', prize: 'Prize'};
    }

    render() {
        let navigation = this.props.navigation;
        let addPhoto = require('../../../../resources/createGroup/ios/Recurso 13.png');
        return (
            <View style={MainStyles.container}>
                <View>
                    <Image style={LocalStyles.addPhotoLogo}
                           source={addPhoto}>
                    </Image>
                </View>
                <Text style={[MainStyles.centerText, MainStyles.greenMedShankFont, MainStyles.inputTopSeparation]}>
                    Add a photo
                </Text>
                <TextInput
                    style={MainStyles.loginInput}
                    onChangeText={(name) => this.setState({name})}
                    value={this.state.name}
                />
                <TextInput
                    style={MainStyles.loginInput}
                    onChangeText={(email) => this.setState({selectTournament})}
                    value={this.state.selectTournament}
                />
                <TextInput
                    style={MainStyles.loginInput}
                    onChangeText={(password) => this.setState({prize})}
                    value={this.state.prize}
                />
                <TouchableHighlight
                    onPress={this._handleNewRegistry}
                    style={MainStyles.goldenShankButton}>
                    <Text style={LocalStyles.buttonText}>Create group</Text>
                </TouchableHighlight>
            </View>
        );
    }
}