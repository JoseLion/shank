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
    Image,
    TouchableOpacity,
    BackHandler,
    Platform,
    Alert,
    FlatList,
    TouchableHighlight,
    ScrollView
} from 'react-native';
import {Header} from "react-native-elements"; // 0.17.0
import {List, ListItem} from "react-native-elements"; // 0.17.0
import BaseModel from '../../../core/BaseModel';

import {Entypo, FontAwesome} from '@expo/vector-icons'; // 5.2.0
import {TabNavigator} from 'react-navigation';
import Notifier from '../../../core/Notifier';

import ParticipantRankings from './tabNav/ParticipantRankings';
import PlayerRankings from './tabNav/PlayerRankings';
import TournamentRankings from './tabNav/TournamentRankings';
import SortableListView from 'react-native-sortable-listview'

class RowComponent extends React.Component {

    constructor(props) {
        super(props);
        this.onNewPlayer = this.onNewPlayer.bind(this);
    }

    onNewPlayer = newPlayer => {
        let obj = {};
        newPlayer.onNewPlayer.position = this.state.playerSelectionPosition;
        obj[this.state.playerSelectionPosition - 1] = newPlayer.onNewPlayer;
        let copyState = this.props.playerRankings.slice()
        let oldReportCopy = Object.assign(copyState, obj);
        this.setState({newPlayer, playerRankings: oldReportCopy})
    };

    addPlayer = () => {
        this.setState({playerSelectionPosition: this.props.data.position});
        this.props.navi.navigate('PlayerSelection', {
            tPlayers: this.props.playerRankings,
            userGroupId: this.props.groupLoggedUser._id,
            groupId: this.props.currentGroup._id,
            currentPosition: this.props.data.position,
            onNewPlayer: this.onNewPlayer,
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
                        padding: 25,
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
                            height: 40,
                            borderRadius: 20,
                            width: 40,
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
                    underlayColor="#c3c3c3"
                    {...this.props.sortHandlers}
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

import ScrollableTabView, {ScrollableTabBar,} from 'react-native-scrollable-tab-view';

//TODO REFACTOR DUPLICATED FUNCTION
const ImageHeader = navigation => (
    <View style={{backgroundColor: '#eee', height: '16%'}}>
        <Image
            style={[MainStyles.imageOpacity, LocalStyles.absoluteFill]}
            source={{uri: 'http://cdn.snappages.com/txd52k/assets/731979_1517216_1464724369.png'}}>
            <Text style={LocalStyles.singleGroupTitle}>{navigation.state.params.data.currentGroup.name}</Text>
            <Text style={LocalStyles.singleGroupTitleBold}>{navigation.state.params.data.tName}</Text>
        </Image>
        <Header onPress={() => console.log('huehueheu')} {...navigation}
                style={[{position: 'absolute', backgroundColor: 'transparent', height: '100%'}]}
                leftComponent={
                    <TouchableOpacity
                        activeOpacity={0.4}
                        onPress={() => {
                            if (navigation.state.params.playersAdded.length >= 5) {
                                if (navigation.state.params.movementsDone == 0) {
                                    navigation.goBack(null)
                                } else {
                                    Alert.alert(
                                        "RESPONSE",
                                        "You have made some changes. Are you sure you want to go back.",
                                        [
                                            {
                                                text: 'Cancel',
                                                onPress: () => console.log('Cancel Pressed'),
                                                style: 'cancel'
                                            },
                                            {text: 'OK', onPress: () => navigation.goBack(null)},
                                        ]
                                    );
                                }
                            } else {
                                Alert.alert(
                                    "RESPONSE",
                                    "You have to add at least 5 players to continue. Are you sure you want to go back?",
                                    [
                                        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                                        {text: 'OK', onPress: () => navigation.goBack(null)},
                                    ]
                                );
                            }
                        }}>
                        <View style={LocalStyles.touchableUserIcon}>
                            <Entypo
                                onPress={() => {
                                    if (navigation.state.params.playersAdded.length >= 5) {
                                        if (navigation.state.params.movementsDone == 0) {
                                            navigation.goBack(null)
                                        } else {
                                            Alert.alert(
                                                "RESPONSE",
                                                "You have made some changes. Are you sure you want to go back.",
                                                [
                                                    {
                                                        text: 'Cancel',
                                                        onPress: () => console.log('Cancel Pressed'),
                                                        style: 'cancel'
                                                    },
                                                    {text: 'OK', onPress: () => navigation.goBack(null)},
                                                ]
                                            );
                                        }
                                    } else {
                                        Alert.alert(
                                            "RESPONSE",
                                            "You have to add at least 5 players to continue. Are you sure you want to go back?",
                                            [
                                                {
                                                    text: 'Cancel',
                                                    onPress: () => console.log('Cancel Pressed'),
                                                    style: 'cancel'
                                                },
                                                {text: 'OK', onPress: () => navigation.goBack(null)},
                                            ]
                                        );
                                    }
                                }}
                                style={{marginVertical: '140%'}}
                                name="chevron-left" size={33} color="white"/>
                        </View>
                    </TouchableOpacity>
                }
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
        this.setOrderPlayer = this.setOrderPlayer.bind(this);
        this.setOrderedList = this.setOrderedList.bind(this);
        this.setStateMovements = this.setStateMovements.bind(this);
        this.setPlayerRankings = this.setPlayerRankings.bind(this);
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
            playerRankings: [{none: true, position: 1}, {none: true, position: 2}, {
                none: true,
                position: 3
            }, {none: true, position: 4}, {none: true, position: 5}],
            playerSelectionPosition: 0,
            movementsDone: 0
        };
        this.lastPosition = 1;
        this.backHandler = null
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
                {(
                    <ScrollableTabView
                        style={{backgroundColor: '#fff'}}
                        initialPage={0}
                        renderTabBar={() => <ScrollableTabBar  tabBarTextStyle={{textAlign: 'center'}} underlineStyle={{backgroundColor: '#556E3E'}}
                                                              activeTextColor='#3b4d2b' inactiveTextColor='#556E3E'/>}>
                        <View tabLabel='Participants' style={[{
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

                        <View tabLabel='Rankings' style={[LocalStyles.GroupList, LocalStyles.listContainer]}>
                            <SortableListView
                                style={{flex: 1}}
                                data={JSON.parse(JSON.stringify(this.state.orderedPlayerRankings))}
                                order={this.state.order}
                                onRowMoved={e => {
                                    let sortableList = [];
                                    //ORDER LIST
                                    let dataCopy = this.state.order.slice();
                                    let playerRankings = this.state.playerRankings.slice();
                                    let dataOrderedListCopy = this.state.orderedPlayerRankings;
                                    dataCopy.splice(e.to, 0, dataCopy.splice(e.from, 1)[0])
                                    playerRankings.splice(e.to, 0, playerRankings.splice(e.from, 1)[0])

                                    //TODO: UNCOMEMNET this one
                                    // this.swap(dataOrderedListCopy, e.to+1, dataOrderedListCopy, e.from+1);
                                    playerRankings.forEach(function (element, index) {
                                        element.position = index + 1
                                    });

                                    //ORDERED LIST
                                    //swap positions on rowMoved for display on list and ordered purposes
                                    for (let player in dataOrderedListCopy) {
                                        //TODO: UNCOMEMNET this one
                                        // dataOrderedListCopy[player].position = player
                                        sortableList.push([player, dataOrderedListCopy[player]]);
                                    }
                                    sortableList.sort(function (a, b) {
                                        return a[1] - b[1];
                                    });

                                    this.setPlayerRankings(playerRankings)
                                    this.setOrderPlayer(dataCopy);
                                    this.setOrderedList(dataOrderedListCopy);
                                    this.setStateMovements(dataCopy, dataOrderedListCopy);
                                    this.forceUpdate()
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
                                <Text style={LocalStyles.buttonText}>{ this.state.movementsDone}
                                    movements {(this.state.movementsDone * 0.99).toFixed(2)} $</Text>
                            </TouchableOpacity>
                        </View>

                        <View tabLabel='Players' style={[LocalStyles.slideBorderStyle, {
                            paddingHorizontal: '3%'
                        }]}>
                            <List containerStyle={LocalStyles.listContainer}>
                                <FlatList
                                    data={[{
                                        name: 'Si Woo Kim',
                                        tr: '1',
                                        score: '150',
                                        position: 1,
                                        photo: {path: 'http://www.golfchannel.com/sites/golfchannel.prod.acquia-sites.com/files/styles/blog_header_image_304x176/public/9/C/C/%7B9CC84FBA-BEE3-482B-9EA7-16CB3EF643AF%7Dkim_si_woo_q-school12_final_day_610.jpg?itok=DCgt_CPy'}
                                    }, {
                                        name: 'William Wheeler',
                                        tr: '2',
                                        score: '260',
                                        position: 2,
                                        photo: {path: 'http://media.golfdigest.com/photos/592442b5c45e221ebef6e668/master/w_768/satoshi-kodaira-sony-open-2017.jpg'}
                                    }, {
                                        name: 'Issac Hines',
                                        tr: '3',
                                        score: '510',
                                        position: 3,
                                        photo: {path: 'https://static1.squarespace.com/static/58abbdb120099e0b12538e67/t/5923a3a1c534a5397b32c34b/1495507887454/Richie3.jpg?format=300w'}
                                    }, {
                                        name: 'Jared Williams',
                                        tr: '4',
                                        score: '185',
                                        position: 4,
                                        photo: {path: 'http://s3.amazonaws.com/golfcanada/app/uploads/golfcanada/production/2017/06/09093500/17.06.09-Ryan-Williams-370x213.jpg'}
                                    }, {
                                        name: 'Keegan Taylor',
                                        tr: '5',
                                        score: '225',
                                        position: 5,
                                        photo: {path: 'http://media.gettyimages.com/photos/may-2000-kevin-keegan-the-england-manager-plays-out-of-a-bunker-on-picture-id1030959'}
                                    }, {
                                        name: 'Boo Weekly',
                                        tr: '6',
                                        score: '350',
                                        position: 6,
                                        photo: {path: 'https://progolfnow.com/wp-content/blogs.dir/120/files/2014/12/boo-weekley-golf-u.s.-open-first-round.jpg'}
                                    }, {
                                        name: 'Bernard Ford',
                                        tr: '7',
                                        score: '100',
                                        position: 7,
                                        photo: {path: 'http://ichef.bbci.co.uk/onesport/cps/480/mcs/media/images/71780000/jpg/_71780044_gallacherpa.jpg'}
                                    }, {
                                        name: 'Shawn Harper',
                                        tr: '8',
                                        score: '110',
                                        position: 8,
                                        photo: {path: 'http://media.jrn.com/images/photo-0627bc6sacc_6137489_ver1.0_640_480.jpg'}
                                    }]}
                                    renderItem={({item}) => (
                                        <ListItem
                                            roundAvatar
                                            titleNumberOfLines={2}
                                            titleContainerStyle={{marginLeft: '3%'}}
                                            title={`${item.name}`}
                                            titleStyle={[MainStyles.shankGreen, LocalStyles.titleStyle]}
                                            subtitle={`${'   TR: ' + item.tr + '   SCORE: ' + item.score}`}
                                            avatar={{uri: item.photo.path}}
                                            containerStyle={{borderBottomWidth: 0}}
                                            hideChevron
                                            leftIcon={<Text
                                                style={[MainStyles.shankGreen, LocalStyles.positionParticipants]}>{item.position}</Text>}
                                        />
                                    )}
                                    keyExtractor={item => item.name}
                                    ItemSeparatorComponent={this.renderSeparator}
                                />
                            </List>
                        </View>
                    </ScrollableTabView>
                )}
            </View>);
    }
}