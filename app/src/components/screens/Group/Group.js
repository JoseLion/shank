// React components:
import React from 'react';
// import { ActionSheetIOS, AsyncStorage, FlatList, Image, Share, TouchableHighlight, TouchableOpacity, Text, View } from 'react-native';
import { Modal, Text, View, TextInput, TouchableHighlight, Image, FlatList, TouchableOpacity, Picker, ActivityIndicator, Alert, Platform, PickerIOS, ActionSheetIOS, Share, TouchableWithoutFeedback, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import { Avatar, List, ListItem } from 'react-native-elements';
import SortableListView from 'react-native-sortable-listview'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import Swipeable from 'react-native-swipeable';
import DropdownAlert from 'react-native-dropdownalert';
import ActionSheet from 'react-native-actionsheet'

// Shank components:
import { BaseComponent, BaseModel, GolfApiModel, MainStyles, Constants, BarMessages, FontAwesome, Entypo, isAndroid, Spinner } from '../BaseComponent';
import LocalStyles from './styles/local';
import { ClienHost } from '../../../config/variables';

class RoasterRow extends BaseComponent {

    constructor(props) {
        super(props);
        this.addPlayer = this.addPlayer.bind(this);
    }
    addPlayer() {
        super.navigateToScreen('PlayerSelection', {
            actualPosition: Number.parseInt(this.props.rowId) + 1,
            groupId: this.props.groupId,
            tournamentId: this.props.tournamentId,
            playerRanking: this.props.playerRanking,
            updatePlayerRankingList: this.props.updatePlayerRankingList
        });
    }

    render() {
        if (this.props.data != null && this.props.data.playerId) {
            return (
                <TouchableHighlight style={[MainStyles.listItem, {paddingLeft: 0, paddingRight: 0}]} underlayColor={Constants.HIGHLIGHT_COLOR} onPress={this.addPlayer} {...this.props.sortHandlers}>
                    <View style={[MainStyles.viewFlexItemsR]}>
                        <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart]}>
                            <Text style={[MainStyles.shankGreen, LocalStyles.positionParticipants]}>{this.props.data.position}</Text>
                        </View>
                        <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart]}>
                            <Avatar small rounded source={{uri: this.props.data.photoUrl}} />
                        </View>
                        <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart, {flex:7}]}>
                            <Text numberOfLines={2} style={[MainStyles.shankGreen, LocalStyles.titleStyle]}>
                                {this.props.data.firstName} {this.props.data.lastName}{'\n'}
                                <Text style={[MainStyles.shankGreen, LocalStyles.subtitleStyle]}>{`   TR: 15   SCORE: ${this.props.data.score == null ? '-' : this.props.data.score }`}</Text>
                            </Text>
                        </View>
                    </View>
                </TouchableHighlight>
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
                    <Entypo name='user' style={[MainStyles.headerIconButton]} />
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
        this.checkChangesOnList = this.checkChangesOnList.bind(this);
        this.removeUser = this.removeUser.bind(this);
        this.handleRefresh = this.handleRefresh.bind(this);
        // this.goMain = this.goMain.bind(this);
        // this.setOrderPlayer = this.setOrderPlayer.bind(this);
        // this.setOrderedList = this.setOrderedList.bind(this);
        // this.setStateMovements = this.setStateMovements.bind(this);
        // this.setPlayerRankings = this.setPlayerRankings.bind(this);

        // this.lastPosition = 1;
        this.state = {
            currentGroup: {},
            groupPhoto: null,
            currentTournament: {},
            tournamentData: {},
            diffDays: 0,
            tournaments: [],
            tournamentsName: [],

            playersLeaderboard: [],

            usersLength: 5,
            score: 0,
            ranking: 0,
            playerRanking: [],
            order: [],
            originalRanking: '',

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
        try {
            do {
                this.state.currentTournament.users.push({fullName: 'Invite', _id: (Math.random() * -1000)});
            } while(this.state.currentTournament.users.length < 5);
            this.state.currentGroup.users.push({fullName: 'Invite', _id: (Math.random() * -1000)});
        } catch (error) {
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

    updatePlayerRankingList(playerRanking) {
        playerRanking = playerRanking.sort(function(a, b) { return a.position - b.position; });
        let order = Object.keys(playerRanking);
        this.setState({playerRanking: playerRanking, order: order});
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
    checkChangesOnList(playerRanking) {
        let quantityMovements = 0;
        let originalRanking = JSON.parse(this.state.originalRanking);
        originalRanking.forEach(function(original) {
            if(original.playerId) {
                let found = playerRanking.filter(function(ranking) {
                    return original.playerId == ranking.playerId;
                });
                if(original.position != found[0].position) {
                    quantityMovements++;
                }
            }
        });
        if(this.state.diffDays > 4) {
            this.onPlayerRankingSaveAsync(playerRanking);
        }
    }
    removeUser(item) { this.onRemoveGroupAsync(item); }
    handleRefresh = () => {
        this.setState(
            { refreshing: true },
            () => { this.onGroupAsync(this.state.currentGroup._id); }
        );
    };

    _getPricePerMovement = async() => {
        // await BaseModel.get('appSettings/findByCode/PPM').then((setting) => {
        //     this.state.pricePerMovement = JSON.parse(setting.value);
        // })
        // .catch((error) => {
        //     this.setLoading(false);
        //     console.log('ERROR: ', error);
        // })
    }
    onPlayerRankingSaveAsync = async(data) => {
        this.setLoading(true);
        await BaseModel.put(`groups/editMyPlayers/${this.state.currentGroup._id}/${this.state.currentTournament._id}`, {players: data})
            .then((response) => { this.setLoading(false); })
            .catch((error) => { BarMessages.showError(error, this.validationMessage); });
    };

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
                groupPhoto: currentGroup.photo.path,
                currentTournament: currentGroup.tournaments[0],
                tournaments: tournaments,
                tournamentsName: tournamentsName,
                usersLength: currentGroup.users.length,
                loading: false});
            currentGroup.tournaments[0].users.forEach(function(user) {
                if(user._id == self.state.currentUser._id) {
                    let playerRanking = (user.playerRanking == null) ? [] : user.playerRanking;
                    while(playerRanking.length < 5)
                        playerRanking.push({position: 6});
                    self.setState({originalRanking: JSON.stringify(playerRanking)});
                    self.updatePlayerRankingList(playerRanking);
                    return;
                }
            });
            this.props.navigation.setParams({currentGroup: currentGroup});
            GolfApiModel.get(`Leaderboard/${currentGroup.tournaments[0].tournamentId}`).then(leaderboard => {
                this.setState({tournamentData: leaderboard.Tournament, playersLeaderboard: leaderboard.Players, diffDays: new Date(leaderboard.Tournament.EndDate).getTime() - new Date().getTime()});
                this.setLoading(false);
            }).catch(error => {
                this.setLoading(false);
                console.log('ERROR: ', error);
            });
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
    onRemoveGroupAsync = async(data) => {
        this.setLoading(true);
        let endPoint;
        await BaseModel.delete(`groups/removeUser/${this.state.currentGroup._id}/${data._id}`).then(() => {
            this.handleRefresh();
        }).catch((error) => {
            console.log('ERROR! ', error);
            BarMessages.showError(error, this.validationMessage);
        }).finally(() => {
            this.setLoading(false);
        });
    };

    render() {
        let addPhoto = require('../../../../resources/add_edit_photo.png');
        let navigation = this.props.navigation;

        let oneDay = 24*60*60*1000;
        let diffDays = this.state.diffDays;
        if(diffDays < 0) diffDays = 0;
        else diffDays = Math.round(diffDays / oneDay);

        return (
            <View style={[MainStyles.container]}>
                <Spinner visible={this.state.loading} animation='fade' />
                <ActionSheet ref={o => this.ActionSheet = o} options={this.state.tournamentsName} cancelButtonIndex={this.state.tournamentsName.length - 1} onPress={this.optionSelectedPressed} />

                <View style={[LocalStyles.groupInformation, {paddingTop: 20}]}>
                    <View style={[LocalStyles.viewContent, MainStyles.centeredObject, {flexDirection:'column'}]}>
                        { this.state.groupPhoto != null && this.state.groupPhoto != ''
                            ? <Avatar large rounded source={{uri: this.state.groupPhoto}} />
                            : <Avatar large rounded source={addPhoto} />
                        }
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
                    <View style={[LocalStyles.viewContent, {flex:2,flexDirection:'column', alignItems:'flex-start'}]}>
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
                        <View><Text style={[LocalStyles.titleText]}>PRIZE</Text></View>
                        <View><Text style={[LocalStyles.titleText, {fontWeight:'400'}]}>{this.state.currentGroup.bet}</Text></View>
                    </View>
                </View>

                <View style={[LocalStyles.groupInformation, {borderBottomWidth: 2, borderBottomColor: Constants.TERTIARY_COLOR_ALT, paddingTop: 15, paddingBottom: 15}]}>
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
                            <View tabLabel='Leaderboard' style={[{ width:'100%', paddingLeft: '10%', paddingRight: '10%' }, LocalStyles.slideBorderStyle]}>
                                <Text style={[LocalStyles.subtitleText, {paddingTop: 20, paddingBottom: 0}]}>Rank</Text>
                                <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0, paddingTop: 5, marginTop: 0}}>
                                    <FlatList
                                        data={this.state.currentTournament.users}
                                        renderItem={({item}) => (
                                            <Swipeable rightButtons={[
                                                (this.state.currentGroup.isOwner && item._id > 0 && item._id != this.state.currentGroup.owner)
                                                ? ( <TouchableHighlight style={[MainStyles.button, MainStyles.error, LocalStyles.trashButton]}  onPress={() => this.removeUser(item)}>
                                                        <FontAwesome name='trash-o' style={MainStyles.headerIconButton} />
                                                    </TouchableHighlight> )
                                                : ( <View></View> ) ]}
                                                rightButtonWidth={(!this.state.currentGroup.isOwner || item._id < 0 || item._id == this.state.currentGroup.owner) ? 0 : 75}>
                                                <TouchableHighlight style={[MainStyles.listItem, {paddingLeft: 0, paddingRight: 0}]} underlayColor={Constants.HIGHLIGHT_COLOR}
                                                    onPress={() => {if(item._id < 0) this.inviteToJoin();} }>
                                                    { item.fullName == 'Invite'
                                                        ?
                                                            <View style={[MainStyles.viewFlexItemsR]}>
                                                                <View style={[MainStyles.viewFlexItemsC]}>
                                                                    <Text style={[LocalStyles.titleText]}>{item.fullName}</Text>
                                                                </View>
                                                            </View>
                                                        :
                                                            <View style={[MainStyles.viewFlexItemsR]}>
                                                                <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart]}>
                                                                    <Text style={[LocalStyles.titleText]}>{item.ranking}</Text>
                                                                </View>
                                                                <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart, {flex:4}]}>
                                                                    <Text style={[LocalStyles.titleText]}>{item.fullName}</Text>
                                                                </View>
                                                                <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsEnd], {flex:1}}>
                                                                    <Text style={[LocalStyles.subtitleText, {color: Constants.TERTIARY_COLOR_ALT}]}>{item._id > 0 ? 'Pts: ' : ''}{item.score}</Text>
                                                                </View>
                                                            </View>
                                                    }
                                                </TouchableHighlight>
                                            </Swipeable>
                                        )}
                                        keyExtractor={item => item._id}
                                    />
                                </List>
                            </View>
                            <View tabLabel='Roaster' style={[{ width:'100%', paddingLeft: '10%', paddingRight: '10%' }, LocalStyles.slideBorderStyle]}>
                                <SortableListView
                                    style={{flex: 1}}
                                    data={this.state.playerRanking}
                                    order={this.state.order}
                                    disableSorting={diffDays == 0}
                                    onMoveStart={() => {
                                        lockScrollTabView = true;
                                    }}
                                    onMoveEnd={() => {
                                        lockScrollTabView = false;
                                    }}
                                    onRowMoved={e => {
                                        this.state.order.splice(e.to, 0, this.state.order.splice(e.from, 1)[0]);
                                        let playerRanking = [];
                                        Object.assign(playerRanking, this.state.playerRanking);
                                        playerRanking[e.from].position = (e.to + 1);
                                        if(e.to > e.from) {
                                            for(let idx = e.from + 1 ; idx > e.from && idx <= e.to ; idx++) {
                                                playerRanking[idx].position = playerRanking[idx].position - 1;
                                            }
                                        } else if(e.to < e.from) {
                                            for(let idx = e.to ; idx >= e.to && idx < e.from ; idx++) {
                                                playerRanking[idx].position = playerRanking[idx].position + 1;
                                            }
                                        }
                                        this.updatePlayerRankingList(playerRanking);
                                        this.checkChangesOnList(playerRanking);
                                        this.forceUpdate();
                                    }}
                                    renderRow={(row, rowId, sectionId) =>
                                        (<RoasterRow
                                                    navigation={navigation}
                                                    data={row}
                                                    rowId={sectionId}
                                                    groupId={this.state.currentGroup._id}
                                                    tournamentId={this.state.currentTournament._id}
                                                    playerRanking={this.state.playerRanking}
                                                    updatePlayerRankingList={this.updatePlayerRankingList} />)
                                    }
                                />

                                { diffDays > 0 && diffDays <= 4
                                    ?
                                        <TouchableOpacity
                                            onPress={() => this.onPlayerRankingSaveAsync(this.state.playerRanking)}
                                            style={[{
                                                position: 'absolute',
                                                bottom: '3%',
                                                left: '10%',
                                                width: '80%'
                                            }, MainStyles.button, MainStyles.success]}>
                                            <Text style={MainStyles.buttonText}>{ this.state.movementsDone} movements {(this.state.movementsDone * this.state.pricePerMovement).toFixed(2)} $</Text>
                                        </TouchableOpacity>
                                    : <View></View>
                                }
                            </View>
                        </ScrollableTabView>
                    )}
                </View>

                <DropdownAlert ref={ref => this.validationMessage = ref} />
            </View>);
    }
}
