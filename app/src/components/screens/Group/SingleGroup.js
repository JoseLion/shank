// React components:
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Text, View, StatusBar, Image, TouchableOpacity, BackHandler, Platform, Alert, FlatList, TouchableHighlight, ScrollView, Share, Dimensions } from 'react-native';
import { Header } from 'react-native-elements'; // 0.17.0
import { List, ListItem } from 'react-native-elements'; // 0.17.0
import { TabNavigator } from 'react-navigation';
import SortableListView from 'react-native-sortable-listview'
import ScrollableTabView, {ScrollableTabBar,} from 'react-native-scrollable-tab-view';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import Swipeable from 'react-native-swipeable';

// Third party components:
import { Entypo, FontAwesome } from '@expo/vector-icons'; // 5.2.0

// Shank components:
import BaseModel from '../../../core/BaseModel';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import { ClienHost } from '../../../config/variables';
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
                    underlayColor='#c3c3c3'
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
                            style={[MainStyles.shankGreen, LocalStyles.titleStyle]}>{this.props.data.name} {this.props.data.lastName} {'\n'}
                            <Text
                                style={[MainStyles.shankGreen, LocalStyles.subtitleStyle]}>{'   TR: ' + '15' + '   SCORE: ' + this.props.data.position}</Text>
                        </Text>
                        <Text/>
                        <FontAwesome
                            onPress={this.addPlayer}
                            name='pencil' size={29} color='green'/>
                    </View>
                </TouchableHighlight >
            )
        } else {
            return (
                <TouchableHighlight
                    {...this.props.sortHandlers}
                    underlayColor='#c3c3c3'
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
            <TouchableHighlight style={[MainStyles.headerIconButtonContainer]} onPress={() => navigation.dispatch({type: 'Main'})}>
                <Entypo name='chevron-small-left' style={MainStyles.headerIconButton} />
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
        this._shareTextWithTitle = this._shareTextWithTitle.bind(this);

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
                            'RESPONSE',
                            'You have made some changes. Are you sure you want to go back.',
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
                        'RESPONSE',
                        'You have to add at least 5 players to continue. Are you sure you want to go back?',
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
            Notifier.message({title: 'RESPONSE', message: 'You already have this player on your prediction list.'});
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
                Notifier.message({title: 'RESPONSE', message: 'Your list has been updated successfully'});
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

    _shareTextWithTitle() {
        Share.share({
            message: 'Shank Group Invitation : ' + 'http://' + ClienHost + 'invite/friend?tag=' + this.state.currentGroupToken + '&linkingUri=' + Constants.LINKING_URI,
            title: 'Shank Group Invitation',
            url: 'http://' + ClienHost + 'invite/friend?tag=' + this.state.currentGroupToken  + '&linkingUri=' + Constants.LINKING_URI
        }, {
            dialogTitle: 'Shank Group Invitation',
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter',
                'com.apple.uikit.activity.mail'
            ],
            tintColor: 'green'
        }).then(this._showResult).catch(err => console.log(err))
    }

    render() {
        let navigation = this.props.navigation;
        let notAbsoluteDiff = new Date(navigation.state.params.data.tStartingDate) - this.state.currentDate.getTime();
        let addPhoto = require('../../../../resources/add_edit_photo.png');
        let diffDays = 0;
        if (notAbsoluteDiff > 0) {
            let daysLeft = Math.abs(notAbsoluteDiff);
            diffDays = Math.ceil(daysLeft / (1000 * 3600 * 24));
        }
        let lockScrollTabView = false;
        //navigation.state.params.data.currentGroup.name
        //navigation.state.params.data.tournamentName

        let totalWidth = Dimensions.get('window').width;

        return (
            <View style={[MainStyles.container]}>
                <StatusBar hidden={true}/>
                <View style={[LocalStyles.groupInformation]}>
                    <View style={[LocalStyles.viewContent, MainStyles.centeredObject, {flexDirection:'column'}]}>
                        <Image style={[LocalStyles.groupImage, {width:50,height:50}]} source={addPhoto}></Image>
                    </View>
                    <View style={[LocalStyles.viewContent, {flex:3,flexDirection:'column'}]}>
                        <View><Text style={[LocalStyles.titleText]}>{navigation.state.params.data.currentGroup.name}</Text></View>
                        <View><Text style={[LocalStyles.subtitleText]}>{navigation.state.params.data.currentGroup.tournamentName}</Text></View>
                    </View>
                    <View style={[LocalStyles.viewContent, {flex:2,flexDirection:'column'}]}>
                        <TouchableOpacity style={[MainStyles.button, MainStyles.success, MainStyles.buttonVerticalPadding]} onPress={this._shareTextWithTitle}>
                            <Text style={MainStyles.buttonText}>Invite</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[LocalStyles.groupInformation, {borderBottomWidth: 3, borderBottomColor: Constants.TERTIARY_COLOR_ALT}]}>
                    <View style={[LocalStyles.viewContent, {flexDirection:'column'}]}>
                        <View><Text style={[LocalStyles.subtitleText]}>PRIZE</Text></View>
                        <View><Text style={[LocalStyles.normalText]}>{navigation.state.params.data.currentGroup.bet}</Text></View>
                    </View>
                </View>
                <View style={[LocalStyles.groupInformation, {borderBottomWidth: 2, borderBottomColor: Constants.TERTIARY_COLOR_ALT}]}>
                    <View style={[LocalStyles.viewContent, MainStyles.centeredObject, {flexDirection:'column'}]}>
                        <View><Text style={[LocalStyles.titleText, LocalStyles.titleTextNumber]}>{this.state.groupLoggedUser.score}</Text></View>
                        <View><Text style={[LocalStyles.infoText]}>Points</Text></View>
                    </View>
                    <View style={[LocalStyles.viewContent, MainStyles.centeredObject, {flexDirection:'column'}]}>
                        <View><Text style={[LocalStyles.titleText, LocalStyles.titleTextNumber]}>{this.state.groupLoggedUser.currentRanking + '/' + navigation.state.params.data.currentGroup.users.length}</Text></View>
                        <View><Text style={[LocalStyles.infoText]}>Ranking</Text></View>
                    </View>
                    <View style={[LocalStyles.viewContent, MainStyles.centeredObject, {flexDirection:'column'}]}>
                        <View><Text style={[LocalStyles.titleText, LocalStyles.titleTextNumber]}>{diffDays}</Text></View>
                        <View><Text style={[LocalStyles.infoText]}>Days Left</Text></View>
                    </View>
                </View>
                <View style={[LocalStyles.groupInformation, LocalStyles.tabsInformation]}>
                    {(
                        <ScrollableTabView
                            initialPage={0}
                            locked={true}
                            tabBarActiveTextColor={Constants.PRIMARY_COLOR}
                            tabBarInactiveTextColor={Constants.PRIMARY_COLOR}
                            renderTabBar={() =>
                                <ScrollableTabBar />
                        }>
                            <View tabLabel='Leaderboard' style={[{
                                width: '100%'
                            }, LocalStyles.slideBorderStyle]}>
                                <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                                    <FlatList
                                        data={navigation.state.params.data.currentGroup.users}
                                        renderItem={({item}) => (
                                            <Swipeable rightButtons={[
                                                (
                                                    <TouchableHighlight style={[MainStyles.button, MainStyles.error, LocalStyles.trashButton]}>
                                                        <FontAwesome name='trash-o' style={MainStyles.headerIconButton} />
                                                    </TouchableHighlight>
                                                )
                                            ]}>
                                                <TouchableHighlight
                                                    underlayColor='#c3c3c3'
                                                    style={{
                                                        flex: 1,
                                                        padding: 20,
                                                        backgroundColor: '#ffffff',
                                                        borderBottomWidth: 1.5,
                                                        borderColor: Constants.TERTIARY_COLOR_ALT,
                                                        alignItems: 'center',
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                    }}>
                                                    <View style={{
                                                        flex: 1,
                                                        alignItems: 'center',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                    }}>
                                                        <Text style={[LocalStyles.titleText]}>{item.currentRanking + 1}</Text>
                                                        <Text style={[LocalStyles.titleText]}>{item.name}</Text>
                                                        <Text style={[LocalStyles.titleText, {color: Constants.TERTIARY_COLOR_ALT}]}>Pts: {item.score}</Text>
                                                    </View>
                                                </TouchableHighlight>
                                            </Swipeable>
                                        )}
                                        keyExtractor={item => item._id}
                                    />
                                </List>
                            </View>

                            <View tabLabel='Roaster' style={[LocalStyles.GroupList, LocalStyles.listContainer]}>
                                <SortableListView
                                    style={{flex: 1, marginBottom: '20%'}}
                                    data={JSON.parse(JSON.stringify(this.state.orderedPlayerRankings))}
                                    order={this.state.order}
                                    onMoveStart={() => {
                                        console.log('onMoveStart')
                                        lockScrollTabView = true;
                                    }}
                                    onMoveEnd={() => {
                                        console.log('onMoveEnd')
                                        lockScrollTabView = false;
                                    }}
                                    onMoveCancel ={() => {
                                        console.log('move canceled')
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
                                        left: '10%',
                                        width: '80%'
                                    }, MainStyles.button, MainStyles.success]}>
                                    <Text style={MainStyles.buttonText}>{ this.state.movementsDone} movements {(this.state.movementsDone * this.state.pricePerMovement).toFixed(2)} $</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollableTabView>
                    )}
                </View>
            </View>);
    }
}
