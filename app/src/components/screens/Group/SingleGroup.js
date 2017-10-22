/**
 * Created by MnMistake on 10/4/2017.
 */
import PropTypes from 'prop-types';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';

import React, {Component} from 'react';
import {Text, View, StatusBar, FlatList, Image, TouchableOpacity, AsyncStorage} from 'react-native';
import {List, ListItem, Header} from "react-native-elements"; // 0.17.0
import Swiper from 'react-native-swiper';
import {LinearGradient} from 'expo';
import BaseModel from '../../../core/BaseModel';

import {FontAwesome, Entypo} from '@expo/vector-icons'; // 5.2.0
import * as Constants from '../../../core/Constans';
import Spinner from 'react-native-loading-spinner-overlay';
import {TabNavigator} from 'react-navigation';

import ParticipantRankings from './tabNav/ParticipantRankings';
import PlayerRankings from './tabNav/PlayerRankings';
import TournamentRankings from './tabNav/TournamentRankings';

const InnerSingleGroupTabNav = TabNavigator({
    Participants: {
        screen: ParticipantRankings,
    },
    Rankings: {
        screen: PlayerRankings,
    },
    TRankings: {
        screen: TournamentRankings,
    },
}, {
    tabBarPosition: 'top',
    animationEnabled: true,
    tabBarOptions: {
        activeTintColor: '#556E3E',
        inactiveTintColor: '#556E3E',
        style: {
            backgroundColor: "#fff",
        }
    },
    labelStyle: {
        fontWeight: 'black',
    }
});

const ImageHeader = navigation => (
    <View style={{backgroundColor: '#eee', height: '16%'}}>
        <Image
            style={[MainStyles.imageOpacity, LocalStyles.absoluteFill]}
            source={{uri: 'http://cdn.snappages.com/txd52k/assets/731979_1517216_1464724369.png'}}>
            <Text style={LocalStyles.singleGroupTitle}>{navigation.state.params.data.currentGroup.name}</Text>
            <Text style={LocalStyles.singleGroupTitleBold}>{navigation.state.params.data.tName}</Text>
        </Image>
        <Header onPress={() => console.log('hueheuhSSeuSSeu')} {...navigation}
                style={[{position: 'absolute', backgroundColor: 'transparent', height: '100%'}]}
                leftComponent={<Entypo
                    onPress={() => {
                        navigation.goBack(null)
                    }}
                    style={{backgroundColor: 'black', height: '100%', left: '3%', top: '40%'}}
                    name="chevron-left" size={33} color="white"/>}
        />
    </View>
    /*leftComponent={{icon: 'chevron-left', color: '#fff', onPress: () => navigation.goBack(null)}}*/
);

export default class SingleGroup extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            tournamentRankings: [],
            currentGroup: {},
            initialState: false,
            stillLoading: false,
            tournamentName: '',
            tournamentEndDate: '',
            tournamentStartDate: '',
            loading: false,
            currentDate: new Date(),
            currentUser: {},
            sliderPosition: 0,
            newPlayer: {},
            playerRankings: [{none: true, position: 1}, {none: true, position: 2}, {
                none: true,
                position: 3
            }, {none: true, position: 4}, {none: true, position: 5}],
            playerSelectionPosition: 0
        };
        this.lastPosition = 1;
    }

    static navigationOptions = ({navigation}) => ({
        title: 'The Masters',
        headerTintColor: 'white',
        headerTitleStyle: {alignSelf: 'center', color: '#fff'},
        header: (<ImageHeader {...navigation}/>),
    });

    setLoading(loading) {
        this.setState({loading: loading});
    }

    componentDidMount() {

    }


    updatePlayerRankings = async (groupId, userGroupId, playerRankings) => {
        this.setLoading(true);
        let data = {
            userGroupId: userGroupId,
            playerRankings: playerRankings,
            groupId: groupId,
        }
        console.log("datadatadataupdatePlayerRanksssingsupdatePlayerRankingsupdatePlayerRankings")
        console.log(data)
        try {
            const currentGroup = await BaseModel.create('updateUserPlayerRankingByGroup', data)
        } catch (e) {
            console.log('error in initialRequest: SingleGroup.js')
            console.log(e)
        }
    };

    render() {
        console.log('got in render')
        console.log('playerRankingsplayerRankings')
        console.log(this.state.playerRankings)
        let navigation = this.props.navigation;
        let whistleIcon = require('../../../../resources/singleGroup/ios/Recurso18.png');
        let notAbsoluteDiff = new Date(navigation.state.params.data.tStartingDate) - this.state.currentDate.getTime();
        let diffDays = 0;
        if (notAbsoluteDiff > 0) {
            let daysLeft = Math.abs(notAbsoluteDiff);
            diffDays = Math.ceil(daysLeft / (1000 * 3600 * 24));
        }
        let playerRankings = this.state.playerRankings
        let groupLoggedUser = navigation.state.params.data.currentGroup.users.find(user => user.userId === navigation.state.params.currentUser._id);
        if (groupLoggedUser.playerRanking.length > 0) {
            playerRankings = groupLoggedUser.playerRanking
        }
        let orderedPlayerRankings = playerRankings.reduce(function (obj, item) {
            obj[item.position] = item;
            return obj;
        }, {});
        console.log("orderedPlayerRankingsorderedPlayerRankissngs")
        console.log(orderedPlayerRankings)
        let order = Object.keys(orderedPlayerRankings) //Array of keys positions
        console.log("orderorderorderorder")
        console.log(order)
        /*console.log('ssdsdsdsadasczxczxc')
         console.log(playerRankings)*/
        console.log('playerRankingsplayerRankingsplayersssRasssnkingsplayerRasssnkingsplayerRankings')
        console.log(playerRankings)
        return (
            <View style={MainStyles.stretchContainer}>
                <StatusBar hidden={true}/>
                <View style={LocalStyles.singleGroupBoxes}>
                    <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupPrize]}>
                        PRIZE
                    </Text>
                    <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupPrizeDescription]}>
                        {navigation.state.params.data.currentGroup.prize}
                    </Text>
                </View>
                <View style={[LocalStyles.innerScoreGroupBox, LocalStyles.singleGroupBoxes]}>
                    <View style={MainStyles.centeredObject}>
                        <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupScoreTab]}>
                            {groupLoggedUser.score}
                        </Text>
                        <Text style={LocalStyles.singleGroupScoreTabDescription}>
                            Score
                        </Text>
                    </View>
                    <View style={MainStyles.centeredObject}>
                        <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupScoreTab]}>
                            {groupLoggedUser.currentRanking + '/' + navigation.state.params.data.currentGroup.users.length}
                        </Text>
                        <Text style={LocalStyles.singleGroupScoreTabDescription}>
                            Ranking
                        </Text>
                    </View>
                    <View style={[MainStyles.centeredObject]}>
                        <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupScoreTab]}>
                            {diffDays}
                        </Text>
                        <Text style={LocalStyles.singleGroupScoreTabDescription}>
                            Days Left
                        </Text>
                    </View>
                </View>
                <InnerSingleGroupTabNav screenProps={{
                    groupUsers: navigation.state.params.data.currentGroup.users,
                    orderedPlayerRankings: orderedPlayerRankings,
                    playerRankings: playerRankings,
                    groupLoggedUser: groupLoggedUser
                }}/>
            </View>);
    }
}