/**
 * Created by MnMistake on 10/10/2017.
 */
import React, {Component} from 'react';

import LocalStyles from '../styles/local';
import MainStyles from '../../../../styles/main';
import {Text, View, TouchableOpacity} from 'react-native';
import {List, ListItem} from "react-native-elements"; // 0.17.0
import {FontAwesome, Entypo} from '@expo/vector-icons'; // 5.2.0
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
        console.log("obj")
        console.log(obj)
        let copyState = this.props.playerRankings.slice()
        let oldReportCopy = Object.assign(copyState, obj);
        /*        console.log(oldReportCopy)
         console.log("oldReportCopy")*/
        this.setState({newPlayer, playerRankings: oldReportCopy})
    };

    render() {
        if (this.props.data.name) {
            return (
                <ListItem
                    {...this.props.sortHandlers}
                    roundAvatar
                    titleContainerStyle={{marginLeft: '7%'}}
                    subtitleContainerStyle={{marginLeft: '7%'}}
                    title={`${this.props.data.name} ${this.props.data.lastName}`}
                    titleStyle={[MainStyles.shankGreen, LocalStyles.titleStyle]}
                    subtitle={`${'   TR: ' + '15' + '   SCORE: ' + this.props.data.position}`}
                    avatar={{uri: this.props.data.urlPhoto}}
                    containerStyle={{borderBottomWidth: 0}}
                    hideChevron
                    badge={{
                        element: <FontAwesome
                            onPress={() => {
                                this.setState({playerSelectionPosition: this.props.data.position});
                                this.props.navi.navigate('PlayerSelection', {
                                    tPlayers: this.props.playerRankings,
                                    userGroupId: this.props.groupLoggedUser._id,
                                    groupId: this.props.currentGroup._id,
                                    currentPosition: this.props.data.position,
                                    onNewPlayer: this.onNewPlayer,
                                    updatePlayerRankingsList: this.props.updatePlayerRankingsList,
                                })
                            }}
                            name="pencil" size={29} color="green"/>
                    }}
                    /*   rightIcon={<TouchableOpacity style={{
                     justifyContent: 'center',
                     borderWidth: 1,
                     borderColor: 'black',
                     marginLeft: '2%',
                     paddingHorizontal: '3%'
                     }} onPress={() => {
                     this.setState({playerSelectionPosition: this.props.data.position});
                     this.props.navigation.navigate('PlayerSelection', {
                     tPlayers: this.props.playerRankings,
                     userGroupId: this.props.groupLoggedUser._id,
                     groupId: this.props.navigation.state.params.data.currentGroup._id,
                     currentPosition: this.props.data.position,
                     onNewPlayer: this.onNewPlayer
                     })
                     }}><Text>REPLACE</Text></TouchableOpacity>}*/
                    key={this.props.data.position}
                    leftIcon={<Text
                        style={[MainStyles.shankGreen, LocalStyles.positionParticipants]}>{this.props.data.position}</Text>}
                />
            )
        } else {
            return (
                <ListItem
                    {...this.props.sortHandlers}
                    hideChevron
                    titleContainerStyle={{marginLeft: '3%'}}
                    label={<Text style={{
                        marginRight: '35%',
                        color: '#3c3c3c',
                        alignSelf: 'center'
                    }}>EMPTY SLOT</Text>}
                    leftIcon={<Text
                        style={[MainStyles.shankGreen, LocalStyles.positionParticipants]}>{this.props.data.position}</Text>}
                    containerStyle={{borderBottomWidth: 0}}
                    onPress={() => {
                        this.setState({playerSelectionPosition: this.props.data.position});
                        this.props.navi.navigate('PlayerSelection', {
                            tPlayers: this.props.playerRankings,
                            userGroupId: this.props.groupLoggedUser._id,
                            groupId: this.props.currentGroup._id,
                            currentPosition: this.props.data.position,
                            onNewPlayer: this.onNewPlayer,
                            updatePlayerRankingsList: this.props.updatePlayerRankingsList
                        })
                    }}
                    key={this.props.data.position}
                />
            )
        }
    }
}


export default class PlayerRankings extends Component {
    // Define your own renderRow
    constructor(props) {
        super(props);
        this.state = {
            order: [],
            loading: false,
            tPLayers: this.props.tPlayers,
            data: {
                "A": [{
                    "name": "Anh Tuan",
                    "lastName": "Nguyen",
                    "urlPhoto": "https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"
                }, {
                    "name": "Anh Tuan",
                    "lastName": "Nguyen",
                    "urlPhoto": "https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"
                }],
                "B": [{
                    "name": "Anh Tuan",
                    "lastName": "Nguyen",
                    "urlPhoto": "https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"
                }, {
                    "name": "Anh Tuan",
                    "lastName": "Nguyen",
                    "urlPhoto": "https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"
                }],
                "C": [{
                    "name": "Anh Tuan",
                    "lastName": "Nguyen",
                    "urlPhoto": "https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"
                }, {
                    "name": "Anh Tuan",
                    "lastName": "Nguyen",
                    "urlPhoto": "https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"
                }],
                "X": [{
                    "name": "Anh Tuan",
                    "lastName": "Nguyen",
                    "urlPhoto": "https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"
                }, {
                    "name": "Anh Tuan",
                    "lastName": "Nguyen",
                    "urlPhoto": "https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"
                }],
                "Z": [{
                    "name": "Anh Tuan",
                    "lastName": "Nguyen",
                    "urlPhoto": "https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"
                }, {
                    "name": "Anh Tuan",
                    "lastName": "Nguyen",
                    "urlPhoto": "https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"
                }],
            }
        };
    }

    static navigationOptions = ({navigation}) => ({
        title: 'Player Ranking',
        headerTitleStyle: {alignSelf: 'center', color: '#fff'},
        activeTintColor: '#ffffff',
        headerStyle: {
            backgroundColor: '#556E3E',
            paddingHorizontal: '3%'
        },
    });

    componentDidMount() {

    }


    swap(sourceObj, sourceKey, targetObj, targetKey) {
        let temp = sourceObj[sourceKey];
        sourceObj[sourceKey] = targetObj[targetKey];
        targetObj[targetKey] = temp;
    }

    render() {
        let navigation = this.props.navigation;
        return (
            <View style={[LocalStyles.slideBorderStyle]}>
                <View style={[LocalStyles.GroupList, LocalStyles.listContainer, {
                    width: '100%',
                    borderTopWidth: 1,
                    borderColor: '#C0C0C0',
                    marginVertical: '5.5%'
                }]}>
                    <SortableListView
                        data={this.props.screenProps.orderedPlayerRankings}
                        order={this.props.screenProps.order}
                        onRowMoved={e => {
                            let sortableList = [];
                            //ORDER LIST
                            let dataCopy = this.props.screenProps.order.slice();
                            let playerRankings = this.props.screenProps.playerRankings.slice();
                            let dataOrderedListCopy = this.props.screenProps.orderedPlayerRankings;
                            dataCopy.splice(e.to, 0, dataCopy.splice(e.from, 1)[0])
                            playerRankings.splice(e.to, 0, playerRankings.splice(e.from, 1)[0])

                            //TODO: UNCOMEMNET this one
                           // this.swap(dataOrderedListCopy, e.to+1, dataOrderedListCopy, e.from+1);
                            console.log("playerRankings")
                            console.log(playerRankings)

                            playerRankings.forEach(function(element,index) {
                                element.position = index+1
                            });

                            //ORDERED LIST
                            //swap positions on rowMoved for display on list and ordered purposes
                            for (let player in dataOrderedListCopy) {
                                //TODO: UNCOMEMNET this one
                               // dataOrderedListCopy[player].position = player
                                sortableList.push([player, dataOrderedListCopy[player]]);
                            }
                            console.log("dataOrderedListCopydataOrderedsssListCopy")
                            console.log(dataOrderedListCopy)

                            sortableList.sort(function (a, b) {
                                return a[1] - b[1];
                            });

                            this.props.screenProps.setPlayerRankings(playerRankings)
                            this.props.screenProps.orderFunc(dataCopy);
                            this.props.screenProps.orderedListFunc(dataOrderedListCopy);
                            this.props.screenProps.movementsDoneFunc();
                            this.forceUpdate()
                        }}
                        renderRow={(row, sectionID, rowID) => <RowComponent data={row} navigation={this.props.navigation}
                                                        sectionID={sectionID}
                                                        rowID={rowID}
                                                        navi={this.props.screenProps.navi}
                                                        currentGroup={this.props.screenProps.currentGroup}
                                                        playerRankings={this.props.screenProps.playerRankings}
                                                        groupLoggedUser={this.props.screenProps.groupLoggedUser}
                                                        updatePlayerRankingsList={this.props.screenProps.updatePlayerRankingsList}/>}/>
                </View>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <TouchableOpacity
                        onPress={() => this.props.screenProps.updatePlayerRankingsListPersist(this.props.screenProps.orderedPlayerRankings.position, this.props.screenProps.groupLoggedUser._id, this.props.screenProps.currentGroup._id)}
                        style={[{position: 'absolute', bottom: '4%'}, MainStyles.goldenShankButtonPayment]}>
                        <Text style={LocalStyles.buttonText}>{ this.props.screenProps.movementsDone} movements
                            {' ' + (this.props.screenProps.movementsDone * 0.99).toFixed(2)} $</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

