/**
 * Created by MnMistake on 10/10/2017.
 */
import React, {Component} from 'react';

import LocalStyles from '../styles/local';
import MainStyles from '../../../../styles/main';
import {Text, View, TouchableOpacity} from 'react-native';
import {List, ListItem} from "react-native-elements"; // 0.17.0
import {FontAwesome} from '@expo/vector-icons'; // 5.2.0
import SortableListView from 'react-native-sortable-listview'


class RowComponent extends React.Component {

    constructor(props) {
        super(props);
        this.onNewPlayer = this.onNewPlayer.bind(this);
    }

    onNewPlayer = newPlayer => {
        let obj = {}
        newPlayer.onNewPlayer.position = this.state.playerSelectionPosition
        obj[this.state.playerSelectionPosition - 1] = newPlayer.onNewPlayer
        let oldReportCopy = Object.assign(this.props.playerRankings, obj)
        console.log("oldReportCopyoldReportCopyoldReportCopyoldReposasdasdsrssstCdasdopy")
        console.log(oldReportCopy)
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

    render() {
        let navigation = this.props.navigation;
        let order = Object.keys(this.props.screenProps.orderedPlayerRankings);
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
                        order={order}
                        onRowMoved={e => {
                            /*console.log("SortableListViewSortableListView RANKS")
                             console.log(orderedPlayerRankings)
                             this.updatePlayerRankings(navigation.state.params.data.currentGroup._id,groupLoggedUser._id,playerRankings).then(() => {
                             console.log("Updated Player Ranking on swap")
                             })*/
                            order.splice(e.to, 0, order.splice(e.from, 1)[0])
                        }}
                        renderRow={row => <RowComponent data={row} navigation={this.props.navigation}
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
                            {' ' + this.props.screenProps.movementsDone * 0.99} $</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}