// React components:
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Text, View, StatusBar, Image, TouchableOpacity, BackHandler, Platform, Alert, FlatList, TouchableHighlight, ScrollView } from 'react-native';
import { Header } from "react-native-elements"; // 0.17.0
import { List, ListItem } from "react-native-elements"; // 0.17.0
import { TabNavigator } from 'react-navigation';
import SortableListView from 'react-native-sortable-listview'
import ScrollableTabView, {ScrollableTabBar,} from 'react-native-scrollable-tab-view';

// Third party components:
import { Entypo, FontAwesome } from '@expo/vector-icons'; // 5.2.0

// Shank components:
import BaseModel from '../../../core/BaseModel';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import * as Constants from '../../../core/Constants';
import * as BarMessages from '../../../core/BarMessages';
import ParticipantRankings from './tabNav/ParticipantRankings';
import PlayerRankings from './tabNav/PlayerRankings';
import TournamentRankings from './tabNav/TournamentRankings';
import Notifier from '../../../core/Notifier';

class RowComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    addPlayer = () => {
        this.setState({playerSelectionPosition: this.props.data.position});
        this.props.navi.navigate('PlayerSelection', {
            tPlayers: this.props.playerRankings,
            userGroupId: this.props.groupLoggedUser._id,
            groupId: this.props.currentGroup._id,
            currentPosition: this.props.data.position,
            updatePlayerRankingsList: this.props.updatePlayerRankingsList,
        })
    };

    render() {
        if (this.props.data.name) {
            return (
                <TouchableHighlight
                    {...this.props.sortHandlers}
                    underlayColor="#c3c3c3"
                    onPress={this.addPlayer}
                    style={{
                        flex: 1,
                        padding: 20,
                        backgroundColor: '#ffffff',
                        borderBottomWidth: 1.5,
                        borderColor: '#c3c3c3',
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                >
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                    }}>
                        <Text
                            style={[MainStyles.shankGreen, LocalStyles.positionParticipants]}>{this.props.data.position}
                        </Text>
                        <Image style={ {
                            height: 30,
                            width: 30,
                            borderRadius: 15,
                        }} source={{uri: this.props.data.urlPhoto}}/>
                        <Text
                            numberOfLines={2}
                            style={[MainStyles.shankGreen, LocalStyles.titleStyle]}>{this.props.data.name} {this.props.data.lastName} {"\n"}
                            <Text
                                style={[MainStyles.shankGreen, LocalStyles.subtitleStyle]}>{'   TR: ' + '15' + '   SCORE: ' + this.props.data.position}</Text>
                        </Text>
                        <Text/>
                        <FontAwesome
                            onPress={this.addPlayer}
                            name="pencil" size={29} color="green"/>
                    </View>
                </TouchableHighlight >
            )
        } else {
            return (
                <TouchableHighlight
                    {...this.props.sortHandlers}
                    underlayColor="#c3c3c3"
                    style={{
                        flex: 1,
                        padding: 25,
                        backgroundColor: '#ffffff',
                        borderBottomWidth: 1,
                        borderColor: '#eee',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                    onPress={this.addPlayer}
                >
                    <Text
                        style={[MainStyles.shankGreen, LocalStyles.titleStyle]}>EMPTY SLOT</Text>
                </TouchableHighlight>
            )
        }
    }
}

export default class SingleGroup extends Component {

    static propTypes = { navigation: PropTypes.object.isRequired };
    static navigationOptions = ({navigation}) => ({
        title: 'Group',
        headerTintColor: Constants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: Constants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: Constants.PRIMARY_COLOR },
        headerLeft: (
            <TouchableHighlight onPress={() => navigation.dispatch({type: 'Main'})}>
                <FontAwesome name="chevron-left" style={MainStyles.headerIconButton} />
            </TouchableHighlight>
        ),
        headerRight: (
            <View></View>
        )
    });

    constructor(props) {
        super(props);
        this.updatePlayerRankingsList = this.updatePlayerRankingsList.bind(this);
        this.updateUserRankingsListPersist = this.updateUserRankingsListPersist.bind(this);
        this.goMain = this.goMain.bind(this);
        this.setOrderPlayer = this.setOrderPlayer.bind(this);
        this.setOrderedList = this.setOrderedList.bind(this);
        this.setStateMovements = this.setStateMovements.bind(this);
        this.setPlayerRankings = this.setPlayerRankings.bind(this);

        this.lastPosition = 1;
        this.backHandler = null;
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
            initialPlayerRankings: {},
            playerRankings: [
                {none: true, position: 1},
                {none: true, position: 2},
                {none: true, position: 3},
                {none: true, position: 4},
                {none: true, position: 5}
            ],
            playerSelectionPosition: 0,
            movementsDone: 0,
            pricePerMovement: 0
        };
    }

    setLoading(loading) {
        this.setState({loading: loading});
    }

    setStateMovements(newOrder, dataOrderedListCopy) {
        if (this.state.playersAdded.length >= 5) {
            let noMatch = 0
            newOrder.forEach(function (value) {
                if (new String(dataOrderedListCopy[value].position).valueOf() !== new String(value).valueOf()) {
                    noMatch++
                }
            });
            if (noMatch > 0) {
                this.setState({movementsDone: noMatch / 2})
                this.props.navigation.setParams({movementsDone: noMatch / 2})
            } else {
                this.setState({movementsDone: 0})
                this.props.navigation.setParams({movementsDone: 0})
            }
        }
    }

    setOrderPlayer(order) {
        this.setState({order: order});
    }

    setOrderedList(newList) {
        this.setState({orderedPlayerRankings: newList});
    }

    setPlayerRankings(newList) {
        this.setState({playerRankings: newList});
    }

    goMain = () => {
        this.props.navigation.dispatch({type: 'Main'})
        return true;
    };

    componentDidMount() {
        this.props.navigation.setParams({movementsDone: this.state.movementsDone});
        this.setInitialPlayerRanking(this.props.navigation);
        if (Platform.OS === 'android') {
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
                if (this.state.playersAdded.length >= 5) {
                    if (this.state.movementsDone == 0) {
                        return false;
                    } else {
                        Alert.alert(
                            "RESPONSE",
                            "You have made some changes. Are you sure you want to go back.",
                            [
                                {
                                    text: 'Cancel', onPress: () => {
                                    return false
                                }, style: 'cancel'
                                },
                                {text: 'OK', onPress: () => this.goMain()},
                            ]
                        );
                        return true;
                    }
                } else {
                    Alert.alert(
                        "RESPONSE",
                        "You have to add at least 5 players to continue. Are you sure you want to go back?",
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
         this._getPricePerMovement();
    }

    isPlayerObjectEqual(obj, compareObject) {
        let notEqualMatches = 0
        Object.keys(obj).forEach(function (key, index) {
            if (new String(obj[key].name).valueOf() !== new String(compareObject[key].name).valueOf()) {
                notEqualMatches++
            }
        });
        return notEqualMatches
    }

    componentWillUnmount() {
        if (Platform.OS === 'android') this.backHandler.remove()
    }

    //TODO REFACTOR updatePlayerRankingsList AND DOES SOM LIKE THE setInitialPlayerRanking
    updatePlayerRankingsList(currentPosition, newAddition) {
        let existingPlayer = this.state.playerRankings.find(o => o.name === newAddition.name && o.lastName === newAddition.lastName);
        if (existingPlayer) {
            Notifier.message({title: 'RESPONSE', message: "You already have this player on your prediction list."});
        } else {
            let obj = {};
            newAddition.position = currentPosition;
            obj[currentPosition - 1] = newAddition;
            let clonePlayerRankings = this.state.playerRankings.slice()
            let oldReportCopy = Object.assign(clonePlayerRankings, obj)
            let orderedPlayerRankings = clonePlayerRankings.reduce(function (obj, item) {
                obj[item.position] = item;
                return obj;
            }, {});
            let order = Object.keys(orderedPlayerRankings); //Array of keys positions
            if (this.state.playersAdded.length >= 5) {
                let matches = this.isPlayerObjectEqual(this.state.initialPlayerRankings, orderedPlayerRankings)
                if (matches > 0) {
                    this.setState({movementsDone: matches})
                    this.props.navigation.setParams({movementsDone: matches})
                } else {
                    this.setState({movementsDone: 0})
                    this.props.navigation.setParams({movementsDone: 0})
                }
            }
            this.setState({
                playerRankings: oldReportCopy,
                orderedPlayerRankings: orderedPlayerRankings,
                order: order
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
                this.setState({movementsDone: 0})
                this.props.navigation.setParams({movementsDone: 0});
                Notifier.message({title: 'RESPONSE', message: "Your list has been updated successfully"});
            }
        } catch (e) {
            console.log('error in initialRequest: SingleGroup.js')
            console.log(e)
        }
    };

    setInitialPlayerRanking(navigation) {
        let playerRankings = this.state.playerRankings.slice();
        let groupLoggedUser = navigation.state.params.data.currentGroup.users.find(user => user.userId === navigation.state.params.currentUser._id);
        if (groupLoggedUser.playerRanking.length > 0) {
            playerRankings = groupLoggedUser.playerRanking
        }
        let orderedPlayerRankings = playerRankings.reduce(function (obj, item) {
            obj[item.position] = item;
            return obj;
        }, {});
        let order = Object.keys(orderedPlayerRankings); //Array of keys positions
        let playersAdded = groupLoggedUser.playerRanking.filter(function (el) {
            if (el.name) {
                return el.name.length > 0;
            }
        });
        navigation.setParams({playersAdded: playersAdded});
        this.setState({
            groupLoggedUser: groupLoggedUser,
            playerRankings: playerRankings,
            orderedPlayerRankings: orderedPlayerRankings,
            initialPlayerRankings: orderedPlayerRankings,
            order: order,
            playersAdded: playersAdded
        })
    }

    _getPricePerMovement = async() => {
        await BaseModel.get('appSettings/findByCode/PPM').then((setting) => {
            this.state.pricePerMovement = JSON.parse(setting.value);
        })
        .catch((error) => {
            this.setLoading(false);
            console.log('ERROR: ', error);
        })
    }

    renderSeparator = () => {
        return (
            <View style={MainStyles.listRenderSeparator}/>
        );
    };


    render() {
        let navigation = this.props.navigation;
        let notAbsoluteDiff = new Date(navigation.state.params.data.tStartingDate) - this.state.currentDate.getTime();
        let diffDays = 0;
        if (notAbsoluteDiff > 0) {
            let daysLeft = Math.abs(notAbsoluteDiff);
            diffDays = Math.ceil(daysLeft / (1000 * 3600 * 24));
        }
        let lockScrollTabView = false;
        return (
            <View style={MainStyles.stretchContainer}>
                <StatusBar hidden={true}/>
                <View style={LocalStyles.singleGroupBoxes}>
                    <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupPrize]}>
                        {navigation.state.params.data.currentGroup.name}
                    </Text>
                    <Text style={[MainStyles.shankGreen, LocalStyles.singleGroupPrizeDescription]}>
                        {navigation.state.params.data.tournamentName}
                    </Text>
                </View>
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
                            Points
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
                {(
                    <ScrollableTabView
                        style={{backgroundColor: '#fff'}}
                        initialPage={0}
                        locked={false}
                        renderTabBar={() =>
                            <ScrollableTabBar tabBarTextStyle={{textAlign: 'center'}} underlineStyle={{backgroundColor: '#556E3E'}} activeTextColor='#3b4d2b' inactiveTextColor='#556E3E'/>
                    }>
                        <View tabLabel='Leaderboard' style={[{
                            backgroundColor: '#556E3E',
                            paddingHorizontal: '3%'
                        }, LocalStyles.slideBorderStyle]}>
                            <List containerStyle={LocalStyles.listContainer}>
                                <FlatList
                                    data={navigation.state.params.data.currentGroup.users}
                                    renderItem={({item}) => (
                                        <ListItem
                                            key={item.userId}
                                            titleContainerStyle={{marginLeft: '6%'}}
                                            title={`${item.name}`}
                                            hideChevron
                                            titleStyle={[MainStyles.shankGreen, LocalStyles.titleStyle]}
                                            rightTitle={`${'Score: ' + item.score}`}
                                            rightTitleStyle={LocalStyles.participantsScore}
                                            containerStyle={{borderBottomWidth: 0}}
                                            /*   rightIcon={<Image style={{marginHorizontal: '2%'}}
                                             source={whistleIcon}/>}*/
                                            leftIcon={<Text
                                                style={[MainStyles.shankGreen, LocalStyles.positionParticipants]}>1</Text>}
                                        />
                                    )}
                                    keyExtractor={item => item.name}
                                    ItemSeparatorComponent={this.renderSeparator}
                                />
                            </List>
                        </View>

                        <View tabLabel='Roaster' style={[LocalStyles.GroupList, LocalStyles.listContainer]}>
                            <SortableListView
                                style={{flex: 1, marginBottom: '20%'}}
                                data={JSON.parse(JSON.stringify(this.state.orderedPlayerRankings))}
                                order={this.state.order}
                                onMoveStart={() => {
                                    console.log("onMoveStart")
                                    lockScrollTabView = true;
                                }}
                                onMoveEnd={() => {
                                    console.log("onMoveEnd")
                                    lockScrollTabView = false;
                                }}
                                onMoveCancel ={() => {
                                    console.log("move canceled")
                                }}
                                onRowMoved={e => {
                                    let dataCopy = this.state.order.slice();
                                    let playerRankings = this.state.playerRankings.slice();
                                    let dataOrderedListCopy = this.state.orderedPlayerRankings;
                                    dataCopy.splice(e.to, 0, dataCopy.splice(e.from, 1)[0])
                                    playerRankings.splice(e.to, 0, playerRankings.splice(e.from, 1)[0])

                                    playerRankings.forEach(function (element, index) {
                                        element.position = index + 1
                                    });
                                    this.setPlayerRankings(playerRankings)
                                    this.setOrderPlayer(dataCopy);
                                    this.setOrderedList(dataOrderedListCopy);
                                    this.setStateMovements(dataCopy, dataOrderedListCopy);
                                    //this.forceUpdate()
                                }}
                                renderRow={(row, sectionID, rowID) => <RowComponent data={row}
                                                                                    navigation={navigation}
                                                                                    sectionID={sectionID}
                                                                                    rowID={rowID}
                                                                                    navi={navigation}
                                                                                    currentGroup={navigation.state.params.data.currentGroup}
                                                                                    playerRankings={this.state.playerRankings}
                                                                                    groupLoggedUser={this.state.groupLoggedUser}
                                                                                    updatePlayerRankingsList={ this.updatePlayerRankingsList}/>}/>

                            <TouchableOpacity
                                onPress={() => this.updateUserRankingsListPersist(JSON.parse(JSON.stringify(this.state.orderedPlayerRankings)).position, this.state.groupLoggedUser._id, navigation.state.params.data.currentGroup._id)}
                                style={[{
                                    position: 'absolute',
                                    bottom: '3%',
                                    left: '29%'
                                }, MainStyles.goldenShankButtonPayment]}>
                                <Text style={LocalStyles.buttonText}>{ this.state.movementsDone} movements {(this.state.movementsDone * this.state.pricePerMovement).toFixed(2)} $</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollableTabView>
                )}
            </View>);
    }
}
