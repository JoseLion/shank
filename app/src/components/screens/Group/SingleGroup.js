/**
 * Created by MnMistake on 10/4/2017.
 */
import PropTypes from 'prop-types';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';

import React, {Component} from 'react';
import {
    Text,
    View,
    StatusBar,
    FlatList,
    Image,
    TouchableOpacity,
    AsyncStorage,
    BackHandler,
    Platform,
    Alert
} from 'react-native';
import {List, ListItem, Header} from "react-native-elements"; // 0.17.0
import Swiper from 'react-native-swiper';
import {LinearGradient} from 'expo';
import BaseModel from '../../../core/BaseModel';

import {FontAwesome, Entypo} from '@expo/vector-icons'; // 5.2.0
import * as Constants from '../../../core/Constans';
import Spinner from 'react-native-loading-spinner-overlay';
import {TabNavigator} from 'react-navigation';
import Notifier from '../../../core/Notifier';

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
                    style={{backgroundColor: 'transparent', height: '100%', left: '4%', paddingVertical: '100%'}}
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
        this.updatePlayerRankingsList = this.updatePlayerRankingsList.bind(this);
        this.updateUserRankingsListPersist = this.updateUserRankingsListPersist.bind(this);
        this.goMain = this.goMain.bind(this);
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
            orderedPlayerRankings: [],
            groupLoggedUser: {},
            initialPlayerRankings: [],
            playerRankings: [{none: true, position: 1}, {none: true, position: 2}, {
                none: true,
                position: 3
            }, {none: true, position: 4}, {none: true, position: 5}],
            playerSelectionPosition: 0,
            movementsDone: 0
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

    setStateMovements() {
        this.setState({movementsDone: this.state.movementsDone++});
    }

    goMain = () => {
        console.log("got here shit")
        this.props.navigation.dispatch({type: 'Main'})
    };

    componentDidMount() {
        this.setInitialPlayerRanking(this.props.navigation);
        console.log("this.props.navigation")
        console.log(this.props.navigation)
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', function () {
                if (this.state.movementsDone == 0) {
                    return false;
                } else {
                    Alert.alert(
                        "RESPONSE",
                        "You have made some changes. Are you sure you want to go back.",
                        [
                            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                            {text: 'OK', onPress: () => this.goMain()},
                        ]
                    );
                    return true;
                }
            }.bind(this));
        }
        /*   if (Platform.OS === 'android') {
         const { dispatch, navigation, nav } = this.props;
         BackHandler.addEventListener('hardwareBackPress', this.backHandler(dispatch)).bind(this);
         }*/
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') BackHandler.removeEventListener('hardwareBackPress')
    }

    //TODO REFACTOR updatePlayerRankingsList AND DOES SOM LIKE THE setInitialPlayerRanking
    updatePlayerRankingsList(currentPosition, newAddition) {
        let existingPlayer = this.state.playerRankings.find(o => o.name === newAddition.name && o.lastName === newAddition.lastName);
        if (existingPlayer) {
            Notifier.message({title: 'RESPONSE', message: "You already have this player on your prediction list."});
        } else {
            let newAdditionInPosition = {};
            newAdditionInPosition[currentPosition - 1] = newAddition;
            let oldReportCopy = Object.assign(this.state.playerRankings, newAdditionInPosition)
            let orderedPlayerRankings = this.state.playerRankings.reduce(function (obj, item) {
                obj[item.position] = item;
                return obj;
            }, {});
            this.setState({
                playerRankings: oldReportCopy,
                orderedPlayerRankings: orderedPlayerRankings,
                movementsDone: this.state.movementsDone + 1,
                initialPlayerRankings: orderedPlayerRankings,
            })
        }
    }

    updateUserRankingsListPersist = async (currentPosition, userGroupId, groupId) => {
        this.setLoading(true);
        let data = {
            userGroupId: userGroupId,
            playerRankings: this.state.playerRankings,
            groupId: groupId,
        };
        try {
            const currentGroup = await BaseModel.create('updateUserPlayerRankingByGroup', data);
            if (currentGroup) {
                console.log("UPDATED SUCESSFULY")
            }
        } catch (e) {
            console.log('error in initialRequest: SingleGroup.js')
            console.log(e)
        }
    };

    setInitialPlayerRanking(navigation) {
        let playerRankings = this.state.playerRankings;
        let groupLoggedUser = navigation.state.params.data.currentGroup.users.find(user => user.userId === navigation.state.params.currentUser._id);
        if (groupLoggedUser.playerRanking.length > 0) {
            playerRankings = groupLoggedUser.playerRanking
        }
        let orderedPlayerRankings = playerRankings.reduce(function (obj, item) {
            obj[item.position] = item;
            return obj;
        }, {});
        let order = Object.keys(orderedPlayerRankings); //Array of keys positions
        this.setState({
            groupLoggedUser: groupLoggedUser,
            playerRankings: playerRankings,
            orderedPlayerRankings: orderedPlayerRankings
        })
    }

    render() {
        let navigation = this.props.navigation;
        let notAbsoluteDiff = new Date(navigation.state.params.data.tStartingDate) - this.state.currentDate.getTime();
        let diffDays = 0;
        if (notAbsoluteDiff > 0) {
            let daysLeft = Math.abs(notAbsoluteDiff);
            diffDays = Math.ceil(daysLeft / (1000 * 3600 * 24));
        }
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
                            {this.state.groupLoggedUser.score}
                        </Text>
                        <Text style={LocalStyles.singleGroupScoreTabDescription}>
                            Score
                        </Text>
                    </View>
                    <View style={MainStyles.centeredObject}>
                        <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupScoreTab]}>
                            {this.state.groupLoggedUser.currentRanking + '/' + navigation.state.params.data.currentGroup.users.length}
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
                    currentGroup: navigation.state.params.data.currentGroup,
                    groupUsers: navigation.state.params.data.currentGroup.users,
                    orderedPlayerRankings: this.state.orderedPlayerRankings,
                    playerRankings: this.state.playerRankings,
                    groupLoggedUser: this.state.groupLoggedUser,
                    updatePlayerRankingsList: this.updatePlayerRankingsList,
                    updatePlayerRankingsListPersist: this.updateUserRankingsListPersist,
                    movementsDoneFunc: this.setStateMovements,
                    movementsDone: this.state.movementsDone,
                    navi: navigation
                }}/>
            </View>);
    }
}