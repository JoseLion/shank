// React components:
import React from 'react';
// import { ActionSheetIOS, AsyncStorage, FlatList, Image, Share, TouchableHighlight, TouchableOpacity, Text, View } from 'react-native';
import { Modal, Text, View, TextInput, TouchableHighlight, Image, FlatList, TouchableOpacity, Picker, ActivityIndicator, Alert, Platform, PickerIOS, ActionSheetIOS, Share, TouchableWithoutFeedback, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import SortableListView from 'react-native-sortable-listview'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import Swipeable from 'react-native-swipeable';
import DropdownAlert from 'react-native-dropdownalert';
import ActionSheet from 'react-native-actionsheet'

// Shank components:
import { BaseComponent, BaseModel, GolfApiModel, MainStyles, Constants, BarMessages, FontAwesome, Entypo, isAndroid } from '../BaseComponent';
import LocalStyles from './styles/local';
import { ClienHost } from '../../../config/variables';

class RoasterRow extends BaseComponent {

    constructor(props) {
        super(props);
        this.addPlayer = this.addPlayer.bind(this);
    }
    addPlayer() {
        super.navigateToScreen('PlayerSelection', {
            actualPosition: this.props.data.position,
            groupId: this.props.groupId,
            tournamentId: this.props.tournamentId,
            playerRanking: this.props.playerRanking,
            updatePlayerRankingList: this.props.updatePlayerRankingList
        });
    }

    render() {
        if (this.props.data.playerId) {
            return (
                <TouchableHighlight style={[LocalStyles.roasterRowHighlight]} underlayColor={Constants.HIGHLIGHT_COLOR} onPress={this.addPlayer}>
                    <View style={[LocalStyles.roasterRowView]}>
                        <Text style={[MainStyles.shankGreen, LocalStyles.positionParticipants]}>{this.props.data.position}</Text>
                        <Image style={[LocalStyles.roasterRowPhoto]} source={{uri: this.props.data.photoUrl}}/>
                        <Text numberOfLines={2} style={[MainStyles.shankGreen, LocalStyles.titleStyle]}>
                            {this.props.data.firstName} {this.props.data.lastName}{'\n'}
                            <Text style={[MainStyles.shankGreen, LocalStyles.subtitleStyle]}>{`   TR: 15   SCORE: ${this.props.data.score}`}</Text>
                        </Text>
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
        this.updateRankingList = this.updateRankingList.bind(this);
        this.updatePlayerRankingList = this.updatePlayerRankingList.bind(this);
        this.onGroupAsync = this.onGroupAsync.bind(this);
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
            orderedPlayerRankings: [],
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
            movementsDone: 0,
            pricePerMovement: 0
        };
    }
    componentDidMount() {
        this.props.navigation.setParams({ actionSheet: this.showActionSheet });
        AsyncStorage.getItem(Constants.USER_PROFILE).then(user => { this.setState({currentUser: JSON.parse(user)}); });
        this.onGroupAsync(this.props.navigation.state.params.groupId);
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
                this.state.currentTournament.users.push({fullName: 'Invite', _id: (Math.random() * -1000)});
            } while(this.state.currentTournament.users.length < 5);
            this.state.currentGroup.users.push({fullName: 'Invite', _id: (Math.random() * -1000)});
            GolfApiModel.get(`Leaderboard/${this.props.navigation.state.params.tournamentId}`).then(leaderboard => {
                this.setState({tournamentData: leaderboard.Tournament, playersLeaderboard: leaderboard.Players});
                this.setLoading(false);
            }).catch(error => {
                this.setLoading(false);
                console.log('ERROR: ', error);
            });
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
    setOrderedList(newList) { this.setState({orderedPlayerRanking: newList}); }
    setPlayerRanking(newList) { this.setState({playerRanking: newList}); }

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

    //TODO REFACTOR updatePlayerRankingList AND DOES SOM LIKE THE setInitialPlayerRanking
    updatePlayerRankingList(playerRanking) {
        this.setState({playerRanking: playerRanking});
        // let existingPlayer = this.state.playerRanking.find(o => o.PlayerID === newAddition.PlayerID);
        // if (existingPlayer) {
        //     BarMessages.showError('You already have this player on your prediction list.', this.validationMessage);
        // } else {
        //     newAddition.position = currentPosition;
        //     obj[currentPosition - 1] = newAddition;
        let clonePlayerRankings = playerRanking.slice();
        // let oldReportCopy = Object.assign(clonePlayerRankings, obj);
        let orderedPlayerRankings = clonePlayerRankings.reduce(function (obj, item) {
            obj[item.position] = item;
            return obj;
        }, {});
        let order = Object.keys(orderedPlayerRankings);
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
            this.setState({
                playerRanking: playerRanking,
                orderedPlayerRankings: orderedPlayerRankings,
                order: order
            });
        // }
    }

    updateRankingList() {
        // this.updateRankingListAsync();
    }
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
        let self = this;
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
            currentGroup.tournaments[0].users.forEach(function(user) {
                if(user._id == self.state.currentUser._id) {
                    self.setState({playerRanking: user.playerRanking});
                    console.log('PLAYER RANKING: ', user.playerRanking);
                    return;
                }
            });
            this.props.navigation.setParams({currentGroup: currentGroup});
            this.initialRequest();
        }).catch((error) => {
            console.log('ERROR! ', error);
            this.setLoading(false);
            BarMessages.showError(error, this.validationMessage);
        });
    };
    updateRankingListAsync = async (data) => {
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

    render() {
        let addPhoto = require('../../../../resources/add_edit_photo.png');
        let navigation = this.props.navigation;

        let oneDay = 24*60*60*1000;
        let diffDays = new Date(this.state.tournamentData.EndDate).getTime() - new Date().getTime();
        if(diffDays < 0) diffDays = 0;
        else diffDays = Math.round(diffDays / oneDay);

        return (
            <View style={[MainStyles.container]}>
                <ActionSheet ref={o => this.ActionSheet = o} options={this.state.tournamentsName} cancelButtonIndex={this.state.tournamentsName.length - 1} onPress={this.optionSelectedPressed} />

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

                <View style={[LocalStyles.groupInformation, LocalStyles.tabsInformation]}>
                    {(
                        <ScrollableTabView
                            initialPage={0}
                            locked={true}
                            tabBarActiveTextColor={Constants.PRIMARY_COLOR}
                            tabBarInactiveTextColor={Constants.PRIMARY_COLOR}
                            renderTabBar={() => <ScrollableTabBar /> }>
                            <View tabLabel='Leaderboard' style={[{
                                width: '100%'
                            }, LocalStyles.slideBorderStyle]}>
                                <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                                    <FlatList
                                        data={this.state.currentTournament.users}
                                        renderItem={({item}) => (
                                            <Swipeable rightButtons={[
                                                (item._id > 0 && item._id != this.state.currentGroup.owner)
                                                ? ( <TouchableHighlight style={[MainStyles.button, MainStyles.error, LocalStyles.trashButton]}>
                                                        <FontAwesome name='trash-o' style={MainStyles.headerIconButton} />
                                                    </TouchableHighlight> )
                                                : ( <View></View> ) ]}
                                                rightButtonWidth={(item._id < 0 || item._id == this.state.currentGroup.owner) ? 0 : 75}>
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
                                                    }}
                                                    onPress={() => {if(item._id < 0) this.inviteToJoin();} }>
                                                    <View style={{
                                                        flex: 1,
                                                        alignItems: 'center',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                    }}>
                                                        <Text style={[LocalStyles.titleText]}>{item.ranking}</Text>
                                                        <Text style={[LocalStyles.titleText]}>{item.fullName}</Text>
                                                        <Text style={[LocalStyles.titleText, {color: Constants.TERTIARY_COLOR_ALT}]}>{item._id > 0 ? 'Pts: ' : ''}{item.score}</Text>
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
                                    data={this.state.playerRanking}
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
                                        // let dataCopy = this.state.order.slice();
                                        // let playerRankings = this.state.playerRankings.slice();
                                        // let dataOrderedListCopy = this.state.orderedPlayerRankings;
                                        // dataCopy.splice(e.to, 0, dataCopy.splice(e.from, 1)[0])
                                        // playerRankings.splice(e.to, 0, playerRankings.splice(e.from, 1)[0])
                                        //
                                        // playerRankings.forEach(function (element, index) {
                                        //     element.position = index + 1
                                        // });
                                        // this.setPlayerRankings(playerRankings)
                                        // this.setOrderPlayer(dataCopy);
                                        // this.setOrderedList(dataOrderedListCopy);
                                        // this.setStateMovements(dataCopy, dataOrderedListCopy);
                                        //this.forceUpdate()
                                    }}
                                    renderRow={(row) =>
                                        (<RoasterRow
                                                    navigation={navigation}
                                                    data={row}
                                                    groupId={this.state.currentGroup._id}
                                                    tournamentId={this.state.currentTournament._id}
                                                    playerRanking={this.state.playerRanking}
                                                    updatePlayerRankingList={this.updatePlayerRankingList} />)
                                    }
                                />

                                {
                                    diffDays > 4
                                    ?
                                        <TouchableOpacity
                                            onPress={() => this.updateUserRankingsListPersist()}
                                            style={[{
                                                position: 'absolute',
                                                bottom: '3%',
                                                left: '10%',
                                                width: '80%'
                                            }, MainStyles.button, MainStyles.success]}>
                                            <Text style={MainStyles.buttonText}>{ this.state.movementsDone} movements {(this.state.movementsDone * this.state.pricePerMovement).toFixed(2)} $</Text>
                                        </TouchableOpacity>
                                    :
                                        <View></View>
                                }
                            </View>
                        </ScrollableTabView>
                    )}
                </View>

                <DropdownAlert ref={ref => this.validationMessage = ref} />
            </View>);
    }
}
