// React components:
import React from 'react';
import { ActionSheetIOS, AsyncStorage, FlatList, Image, Share, TouchableHighlight, TouchableOpacity, Text, View } from 'react-native';
import { List } from 'react-native-elements';
import SortableListView from 'react-native-sortable-listview'
import {ScrollableTabBar, ScrollableTabView} from 'react-native-scrollable-tab-view';
import Swipeable from 'react-native-swipeable';
import DropdownAlert from 'react-native-dropdownalert';
import ActionSheet from 'react-native-actionsheet'

// Shank components:
import { BaseComponent, BaseModel, GolfApiModel, MainStyles, Constants, BarMessages, FontAwesome, Entypo, isAndroid } from '../BaseComponent';
import LocalStyles from './styles/local';
import { ClienHost } from '../../../config/variables';

class RoasterRow extends BaseComponent {

    constructor(props) { super(props); }
    addPlayer() {
        this.setState({playerSelectionPosition: this.props.data.position});
        this.props.navigation.navigate('PlayerSelection', {
            tPlayers: this.props.playerRankings,
            userGroupId: this.props.groupLoggedUser._id,
            groupId: this.props.currentGroup._id,
            currentPosition: this.props.data.position,
            updatePlayerRankingsList: this.props.updatePlayerRankingsList,
        })
    };

    render() {
        if (this.props.data.PlayerID) {
            return (
                <TouchableHighlight underlayColor='#E4E4E4' onPress={this.addPlayer} style={[LocalStyles.roasterRowHighlight]}>
                    <View style={[LocalStyles.roasterRowView]}>
                        <Text style={[MainStyles.shankGreen, LocalStyles.positionParticipants]}>{this.props.data.position}</Text>
                        <Image style={[LocalStyles.roasterRowPhoto]} source={{uri: this.props.data.PhotoUrl}}/>
                        <Text numberOfLines={2} style={[MainStyles.shankGreen, LocalStyles.titleStyle]}>
                            {this.props.data.FirstName} {this.props.data.LastName}{'\n'}
                            // TODO: TR LOGIC...
                            <Text style={[MainStyles.shankGreen, LocalStyles.subtitleStyle]}>{`   TR: 15   SCORE: ${this.props.data.position}`}</Text>
                        </Text>
                        <Text/>
                        <FontAwesome onPress={this.addPlayer} name='pencil' size={29} color='green' />
                    </View>
                </TouchableHighlight >
            )
        } else {
            return (
                <TouchableHighlight underlayColor='#E4E4E4' onPress={this.addPlayer} style={[LocalStyles.roasterRowHighlight]}>
                    <Text style={[MainStyles.shankGreen, LocalStyles.titleStyle]}>EMPTY SLOT</Text>
                </TouchableHighlight>
            )
        }
    }
}

export default class Group extends BaseComponent {

    static navigationOptions = ({navigation}) => ({
        title: 'GROUP',
        headerTintColor: Constants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: Constants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: Constants.PRIMARY_COLOR },
        headerLeft: (
            <TouchableHighlight onPress={() => navigation.dispatch({type: 'Main'})}>
                <Entypo name='chevron-small-left' style={[MainStyles.headerIconButton]} />
            </TouchableHighlight>
        ),
        headerRight:
            navigation.state.params.isOwner
            ? ( <TouchableHighlight onPress={() => navigation.navigate('EditGroup', navigation.state.params)}>
                    <Entypo name='pencil' style={[MainStyles.headerIconButton]} />
                </TouchableHighlight> )
            : (<View></View>)
    });

    constructor(props) {
        super(props);
        this.inviteToJoin = this.inviteToJoin.bind(this);
        this.showActionSheet = this.showActionSheet.bind(this);
        this.optionSelectedPressed = this.optionSelectedPressed.bind(this);
        // this.updatePlayerRankingsList = this.updatePlayerRankingsList.bind(this);
        // this.updateUserRankingsListPersist = this.updateUserRankingsListPersist.bind(this);
        // this.goMain = this.goMain.bind(this);
        // this.setOrderPlayer = this.setOrderPlayer.bind(this);
        // this.setOrderedList = this.setOrderedList.bind(this);
        // this.setStateMovements = this.setStateMovements.bind(this);
        // this.setPlayerRankings = this.setPlayerRankings.bind(this);

        // this.lastPosition = 1;
        this.state = {
            currentGroup: {},
            currentTournament: {},
            tournamentData: {},
            tournaments: [],
            tournamentsName: [],

            playersLeaderboard: [],

            usersLength: 5,
            score: 0,
            ranking: 0,
            playerRanking: [
                {none: true, position: 1},
                {none: true, position: 2},
                {none: true, position: 3},
                {none: true, position: 4},
                {none: true, position: 5}
            ],

            // tournamentRankings: [],
            // initialState: false,
            // stillLoading: false,
            // tournamentName: '',
            // tournamentEndDate: '',
            // tournamentStartDate: '',
            // loading: false,
            // currentDate: new Date(),
            // currentUser: {},
            // sliderPosition: 0,
            // newPlayer: {},
            // orderedPlayerRankings: [],
            // groupLoggedUser: {},
            // initialPlayerRankings: {},
            // playerRankings: [
            //     {none: true, position: 1},
            //     {none: true, position: 2},
            //     {none: true, position: 3},
            //     {none: true, position: 4},
            //     {none: true, position: 5}
            // ],
            // playerSelectionPosition: 0,
            // movementsDone: 0,
            // pricePerMovement: 0
        };
    }
    componentDidMount() {
        this.props.navigation.setParams({ actionSheet: this.showActionSheet });
        AsyncStorage.getItem(Constants.USER_PROFILE).then(user => { this.setState({currentUser: JSON.parse(user)}); });
        this.onGroupAsync(this.props.navigation.state.params.groupId);

        // this.props.navigation.setParams({movementsDone: this.state.movementsDone});
        // this.setInitialPlayerRanking(this.props.navigation);
        // if (Platform.OS === 'android') {
            // this.backHandler = BackHandler.addEventListener('hardwareBackPress', function () {
            //     if (this.state.playersAdded.length >= 5) {
            //         if (this.state.movementsDone == 0) {
            //             return false;
            //         } else {
            //             Alert.alert(
            //                 'RESPONSE',
            //                 'You have made some changes. Are you sure you want to go back.',
            //                 [
            //                     {
            //                         text: 'Cancel', onPress: () => {
            //                         return false
            //                     }, style: 'cancel'
            //                     },
            //                     {text: 'OK', onPress: () => this.goMain()},
            //                 ]
            //             );
            //             return true;
            //         }
            //     } else {
            //         Alert.alert(
            //             'RESPONSE',
            //             'You have to add at least 5 players to continue. Are you sure you want to go back?',
            //             [
            //                 {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            //                 {text: 'OK', onPress: () => this.goMain()},
            //             ]
            //         );
            //         return true;
            //     }
            // }.bind(this));
        // }
        /*   if (Platform.OS === 'android') {
         const { dispatch, navigation, nav } = this.props;
         BackHandler.addEventListener('hardwareBackPress', this.backHandler(dispatch)).bind(this);
         }*/
         // this._getPricePerMovement();
    }


    optionSelectedPressed(actionIndex) {
        //this.pictureSelection(actionIndex);
        console.log(actionIndex);
    }
    showActionSheet() {
        if(isAndroid) {
            this.ActionSheet.show();
        } else {
            this.props.showActionSheetWithOptions(
                {
                    options: [ 'Cancel' ],
                    cancelButtonIndex: 0
                },
                buttonIndex => this.optionSelectedPressed(buttonIndex)
            );
        }
    }

    initialRequest = async () => {
        this.setLoading(true);
        try {
            do {
                this.state.currentGroup.users.push({fullName: 'Invite', _id: (Math.random() * -1000)});
            } while(this.state.currentGroup.users.length < 5);
            this.setState({tournamentData: {
                "Canceled": false,
                "City": null,
                "Country": null,
                "Covered": true,
                "EndDate": "2018-01-08T00:00:00",
                "Format": null,
                "IsInProgress": true,
                "IsOver": false,
                "Location": "Dallas, TX",
                "Name": "AT&T Byron Nelson",
                "Par": null,
                "Purse": 7700000,
                "Rounds": [
                    {
                        "Day": "2018-01-05T00:00:00",
                        "Number": 4,
                        "RoundID": 990,
                    },
                    {
                        "Day": "2018-01-06T00:00:00",
                        "Number": 3,
                        "RoundID": 989,
                    },
                    {
                        "Day": "2018-01-07T00:00:00",
                        "Number": 2,
                        "RoundID": 988,
                    },
                    {
                        "Day": "2018-01-08T00:00:00",
                        "Number": 1,
                        "RoundID": 987,
                    },
                ],
                "StartDate": "2018-01-05T00:00:00",
                "StartDateTime": null,
                "State": null,
                "TimeZone": null,
                "TournamentID": 267,
                "Venue": "Trinity Forest Golf Club",
                "Yards": null,
                "ZipCode": null,
            }, playersLeaderboard: []});

            // GolfApiModel.get(`Leaderboard/${this.props.navigation.state.params.tournamentId}`).then(leaderboard => {
            //     this.setState({tournamentData: leaderboard.Tournament, playersLeaderboard: leaderboard.Players});
            //     this.setLoading(false);
            // }).catch(error => {
            //     this.setLoading(false);
            //     console.log('ERROR: ', error);
            // });
            // this.setState({assignUsers: groupUser});
        } catch (error) {
            this.setLoading(false);
            console.log('ERROR! ', error);
        }
    };

    setLoading(loading) { this.setState({loading: loading}); }

    setStateMovements(newOrder, dataOrderedListCopy) {
        // if (this.state.playersAdded.length >= 5) {
        //     let noMatch = 0
        //     newOrder.forEach(function (value) {
        //         if (new String(dataOrderedListCopy[value].position).valueOf() !== new String(value).valueOf()) {
        //             noMatch++
        //         }
        //     });
        //     if (noMatch > 0) {
        //         this.setState({movementsDone: noMatch / 2})
        //         this.props.navigation.setParams({movementsDone: noMatch / 2})
        //     } else {
        //         this.setState({movementsDone: 0})
        //         this.props.navigation.setParams({movementsDone: 0})
        //     }
        // }
    }

    setOrderPlayer(order) { this.setState({order: order}); }
    setOrderedList(newList) { this.setState({orderedPlayerRankings: newList}); }
    setPlayerRankings(newList) { this.setState({playerRankings: newList}); }

    // goMain = () => {
    //     this.props.navigation.dispatch({type: 'Main'})
    //     return true;
    // };

    isPlayerObjectEqual(obj, compareObject) {
        let notEqualMatches = 0;
        Object.keys(obj).forEach(function (key, index) {
            if (new String(obj[key].name).valueOf() !== new String(compareObject[key].name).valueOf()) {
                notEqualMatches++;
            }
        });
        return notEqualMatches;
    }

    //TODO REFACTOR updatePlayerRankingsList AND DOES SOM LIKE THE setInitialPlayerRanking
    updatePlayerRankingsList(currentPosition, newAddition) {
        // let existingPlayer = this.state.playerRanking.find(o => o.PlayerID === newAddition.PlayerID);
        // if (existingPlayer) {
        //     BarMessages.showError('You already have this player on your prediction list.', this.validationMessage);
        // } else {
        //     newAddition.position = currentPosition;
        //     obj[currentPosition - 1] = newAddition;
        //     let clonePlayerRankings = this.state.playerRankings.slice();
        //     let oldReportCopy = Object.assign(clonePlayerRankings, obj);
        //     let orderedPlayerRankings = clonePlayerRankings.reduce(function (obj, item) {
        //         obj[item.position] = item;
        //         return obj;
        //     }, {});
        //     let order = Object.keys(orderedPlayerRankings);
        //     if (this.state.playersAdded.length >= 5) {
        //         let matches = this.isPlayerObjectEqual(this.state.initialPlayerRankings, orderedPlayerRankings);
        //         if (matches > 0) {
        //             this.setState({movementsDone: matches})
        //             // this.props.navigation.setParams({movementsDone: matches})
        //         } else {
        //             this.setState({movementsDone: 0})
        //             // this.props.navigation.setParams({movementsDone: 0})
        //         }
        //     }
        //     this.setState({
        //         playerRankings: oldReportCopy,
        //         orderedPlayerRankings: orderedPlayerRankings,
        //         order: order
        //     });
        // }
    }

    updateUserRankingsListPersist = async (currentPosition, userGroupId, groupId) => {
        // this.setLoading(true);
        // let data = {
        //     userGroupId: userGroupId,
        //     playerRankings: this.state.playerRankings,
        //     groupId: groupId,
        // };
        // try {
        //     const currentGroup = await BaseModel.create('updateUserPlayerRankingByGroup', data);
        //     if (currentGroup) {
        //         this.setState({movementsDone: 0})
        //         this.props.navigation.setParams({movementsDone: 0});
        //         Notifier.message({title: 'RESPONSE', message: 'Your list has been updated successfully'});
        //     }
        // } catch (e) {
        //     console.log('error in initialRequest: Group.js')
        //     console.log(e)
        // }
    };

    setInitialPlayerRanking(navigation) {
        // let playerRankings = this.state.playerRankings.slice();
        // let groupLoggedUser = navigation.state.params.data.currentGroup.users.find(user => user.userId === navigation.state.params.currentUser._id);
        // if (groupLoggedUser.playerRanking.length > 0) {
        //     playerRankings = groupLoggedUser.playerRanking
        // }
        // let orderedPlayerRankings = playerRankings.reduce(function (obj, item) {
        //     obj[item.position] = item;
        //     return obj;
        // }, {});
        // let order = Object.keys(orderedPlayerRankings); //Array of keys positions
        // let playersAdded = groupLoggedUser.playerRanking.filter(function (el) {
        //     if (el.name) {
        //         return el.name.length > 0;
        //     }
        // });
        // navigation.setParams({playersAdded: playersAdded});
        // this.setState({
        //     groupLoggedUser: groupLoggedUser,
        //     playerRankings: playerRankings,
        //     orderedPlayerRankings: orderedPlayerRankings,
        //     initialPlayerRankings: orderedPlayerRankings,
        //     order: order,
        //     playersAdded: playersAdded
        // })
    }

    _getPricePerMovement = async() => {
        // await BaseModel.get('appSettings/findByCode/PPM').then((setting) => {
        //     this.state.pricePerMovement = JSON.parse(setting.value);
        // })
        // .catch((error) => {
        //     this.setLoading(false);
        //     console.log('ERROR: ', error);
        // })
    }

    inviteToJoin() {
        Share.share({
            message: `Shank Group Invitation: http://${ClienHost}invite/${this.state.currentGroup.groupToken}`,
            title: 'Shank Group Invitation',
            url: `http://${ClienHost}invite/${this.state.currentGroup.groupToken}`
        }, {
            dialogTitle: 'Shank Group Invitation',
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter',
                'com.apple.uikit.activity.mail'
            ],
            tintColor: 'green'
        }).then(this._showResult).catch(err => console.log(err))
    }

    onGroupAsync = async(data) => {
        this.setState({loading: true});
        await BaseModel.get(`groups/group/${data}`).then((currentGroup) => {
            let tournaments = [];
            let tournamentsName = [];
            currentGroup.tournaments.forEach(function(tournament) {
                tournaments.push(tournament);
                tournamentsName.push(tournament.tournamentName);
            });
            tournamentsName.push('Cancel');
            this.setState({
                currentGroup: currentGroup,
                currentTournament: currentGroup.tournaments[0],
                tournaments: tournaments,
                tournamentsName: tournamentsName,
                usersLength: currentGroup.users.length,
                loading: false});
            this.props.navigation.setParams({currentGroup: currentGroup});
            this.initialRequest();
        }).catch((error) => {
            console.log('ERROR! ', error);
            this.setLoading(false);
            BarMessages.showError(error, this.validationMessage);
        });
    };

    render() {
        let addPhoto = require('../../../../resources/add_edit_photo.png');
        let navigation = this.props.navigation;

        let oneDay = 24*60*60*1000;
        let diffDays = new Date(this.state.tournamentData.EndDate).getTime() - new Date().getTime();
        if(diffDays < 0) diffDays = 0;
        else diffDays = Math.round(diffDays / oneDay);

        return (
            <View style={[MainStyles.container]}>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={this.state.tournamentsName}
                    cancelButtonIndex={this.state.tournamentsName.length - 1}
                    onPress={this.optionSelectedPressed} />
                <View style={[LocalStyles.groupInformation]}>
                    <View style={[LocalStyles.viewContent, MainStyles.centeredObject, {flexDirection:'column'}]}>
                        <Image style={[LocalStyles.groupImage, {width:50,height:50}]} source={addPhoto}></Image>
                    </View>
                    <View style={[LocalStyles.viewContent, {flex:3,flexDirection:'column'}]}>
                        <View><Text style={[LocalStyles.titleText]}>{this.state.currentGroup.name}</Text></View>
                        <View>
                            <TouchableHighlight underlayColor={Constants.HIGHLIGHT_COLOR}
                                onPress={() => navigation.state.params.actionSheet()}>
                                <Text style={[LocalStyles.subtitleText]}>{this.state.currentTournament.tournamentName}</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                    <View style={[LocalStyles.viewContent, {flex:2,flexDirection:'column'}]}>
                        { this.state.currentGroup.isOwner
                            ? ( <TouchableOpacity style={[MainStyles.button, MainStyles.success, MainStyles.buttonVerticalPadding]} onPress={this.inviteToJoin}>
                                    <Text style={MainStyles.buttonText}>Invite</Text>
                                </TouchableOpacity> )
                            : <View></View>
                        }
                    </View>
                </View>
                <View style={[LocalStyles.groupInformation, {borderBottomWidth: 3, borderBottomColor: Constants.TERTIARY_COLOR_ALT}]}>
                    <View style={[LocalStyles.viewContent, {flexDirection:'column'}]}>
                        <View><Text style={[LocalStyles.subtitleText]}>PRIZE</Text></View>
                        <View><Text style={[LocalStyles.normalText]}>{this.state.currentGroup.bet}</Text></View>
                    </View>
                </View>
                <View style={[LocalStyles.groupInformation, {borderBottomWidth: 2, borderBottomColor: Constants.TERTIARY_COLOR_ALT}]}>
                    <View style={[LocalStyles.viewContent, MainStyles.centeredObject, {flexDirection:'column'}]}>
                        <View><Text style={[LocalStyles.titleText, LocalStyles.titleTextNumber]}>{this.state.currentTournament.myScore}</Text></View>
                        <View><Text style={[LocalStyles.infoText]}>Points</Text></View>
                    </View>
                    <View style={[LocalStyles.viewContent, MainStyles.centeredObject, {flexDirection:'column'}]}>
                        <View><Text style={[LocalStyles.titleText, LocalStyles.titleTextNumber]}>{this.state.currentTournament.myRanking}/{this.state.usersLength}</Text></View>
                        <View><Text style={[LocalStyles.infoText]}>Ranking</Text></View>
                    </View>
                    <View style={[LocalStyles.viewContent, MainStyles.centeredObject, {flexDirection:'column'}]}>
                        <View><Text style={[LocalStyles.titleText, LocalStyles.titleTextNumber]}>{diffDays}</Text></View>
                        <View><Text style={[LocalStyles.infoText]}>Days Left</Text></View>
                    </View>
                </View>
                <DropdownAlert ref={ref => this.validationMessage = ref} />
            </View>);
    }
}
