/**
 * Created by MnMistake on 9/24/2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View, TextInput, TouchableHighlight, Image, FlatList} from 'react-native';
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
        let addPhoto = require('../../../../resources/createGroup/ios/Recurso13.png');
        return (
            <View style={MainStyles.container}>
                <View style={MainStyles.container}>
                    <Image style={LocalStyles.addPhotoLogo}
                           source={addPhoto}>
                    </Image>
                </View>
                <Text style={[MainStyles.centerText, LocalStyles.txtAddPhoto]}>
                    Add a photo
                </Text>
                <TextInput
                    style={LocalStyles.inputTxt}
                    onChangeText={(name) => this.setState({name})}
                    value={this.state.name}
                />
                <TextInput
                    style={LocalStyles.inputTxt}
                    onChangeText={(email) => this.setState({selectTournament})}
                    value={this.state.selectTournament}
                />
                <TextInput
                    style={LocalStyles.inputTxtPrize}
                    onChangeText={(password) => this.setState({prize})}
                    value={this.state.prize}
                />
                <View style={LocalStyles.participantsList}>
                    <Text style={MainStyles.greenMedShankFont}>
                        PARTICIPANTS
                    </Text>
                    <FlatList
                        data={[
                            {key: 'Devin'},
                            {key: 'Jackson'},
                            {key: 'James'},
                            {key: 'Joel'},
                            {key: 'John'},
                            {key: 'Jillian'},
                            {key: 'Jimmy'},
                            {key: 'Julie'},
                        ]}
                        renderItem={({item}) => <Text style={LocalStyles.item}>{item.key}</Text>}
                    />
                </View>
                <View  style={LocalStyles.addNewParticipant}>
                    <Text style={[LocalStyles.centerText,MainStyles.shankGray]}>
                        Add new participant
                    </Text>
                </View>
                <TouchableHighlight
                    onPress={this._handleNewRegistry}
                    style={LocalStyles.buttonCreateGroup}>
                    <Text style={LocalStyles.buttonText}>Create group</Text>
                </TouchableHighlight>
            </View>
        );
    }
}