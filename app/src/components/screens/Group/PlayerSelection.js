// React components:
import React from 'react';
import { Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import SortableListView from 'react-native-sortable-listview';
import DropdownAlert from 'react-native-dropdownalert';

// Shank components:
import { BaseComponent, BaseModel, GolfApiModel, MainStyles, Constants, BarMessages, FontAwesome, Entypo, Spinner } from '../BaseComponent';
import LocalStyles from './styles/local';

class PlayerRow extends BaseComponent {

    constructor(props) {
        super(props);
        this.playerSelected = this.playerSelected.bind(this);
        this.state = { checkIsSelected: this.props.data.isSelected ? LocalStyles.checkIsSelected : null };
    }

    playerSelected() {
        if(this.state.checkIsSelected != null) {
            this.props.data.isSelected = false;
            this.setState({checkIsSelected: null});
        } else {
            this.props.data.isSelected = true;
            this.setState({checkIsSelected: LocalStyles.checkIsSelected});

        }
        this.props.setUpdateSelected(this.props.data);
    }

    render() {
        return (
            <TouchableHighlight style={[MainStyles.listItem]} underlayColor={Constants.HIGHLIGHT_COLOR} onPress={() => this.playerSelected()}>
                <View style={[MainStyles.viewFlexItemsR]}>
                    <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart]}>
                        <Avatar medium rounded source={{uri: this.props.data.PhotoUrl}} />
                    </View>
                    <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart, {flex: 4}]}>
                        <Text style={[MainStyles.shankGreen, LocalStyles.titleStyle]}>{this.props.data.FirstName} {this.props.data.LastName}</Text>
                    </View>
                    <View style={[MainStyles.viewFlexItemsC]}>
                        <Text style={[MainStyles.shankGreen, LocalStyles.titleStyle]}>0 %</Text>
                    </View>
                    <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsEnd, {flex:2}]}>
                        <FontAwesome name='check' size={29} style={[LocalStyles.selectedCheck, this.state.checkIsSelected]}/>
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

export default class PlayerSelection extends BaseComponent {

    static navigationOptions = ({navigation}) => ({
        title: 'CHOOSE PLAYER',
        headerTintColor: Constants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: Constants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: Constants.PRIMARY_COLOR },
        headerLeft: (
            <TouchableHighlight onPress={() => navigation.goBack(null)}>
                <Entypo name='chevron-small-left' style={[MainStyles.headerIconButton]} />
            </TouchableHighlight>
        ),
        headerRight: (
            <TouchableHighlight style={[MainStyles.headerIconButtonContainer]} onPress={() => navigation.state.params.searchPlayer()}>
                <FontAwesome name='search' style={[MainStyles.headerIconButton]} />
            </TouchableHighlight>
        )
    });

    constructor(props) {
        super(props);
        this.setUpdateSelected = this.setUpdateSelected.bind(this);
        this.updateLocalPlayerList = this.updateLocalPlayerList.bind(this);
        this.searchPlayer = this.searchPlayer.bind(this);
        this.initialRequest = this.initialRequest.bind(this);
        this.updateListSelected = this.updateListSelected.bind(this);
        console.log('IS EMPTY: ', this.props.navigation.state.params.isEmpty)
        this.state = {
            isEmpty: this.props.navigation.state.params.isEmpty,
            groupId: this.props.navigation.state.params.groupId,
            tournamentId: this.props.navigation.state.params.tournamentId,
            actualPosition: this.props.navigation.state.params.actualPosition,
            playerRanking: this.props.navigation.state.params.playerRanking,
            playersSelected: [],
            finalPlayers: [],
            players: [],
            loading: false
        };
    }
    componentDidMount() {
        this.props.navigation.setParams({
            searchPlayer: this.searchPlayer
        });
        this.initialRequest();
    }

    setLoading(loading) { this.setState({loading: loading}); }
    updateLocalPlayerList() {
        if(this.state.isEmpty) {
            let quantityPlayersEmpty = 0;
            this.state.playerRanking.forEach(player => { if(player.playerId == null) quantityPlayersEmpty++; });
            if(this.state.finalPlayers.length > quantityPlayersEmpty) {
                let message = (quantityPlayersEmpty > 1)
                    ? `You must select between 1 and ${quantityPlayersEmpty} players.`
                    : 'You must select one player.';
                BarMessages.showError(message, this.validationMessage);
                return;
            }
        } else {
            if(this.state.finalPlayers.length != 1) {
                BarMessages.showError('You must select one player.', this.validationMessage);
                return;
            }
        }

        let playerRanking = this.state.playerRanking;
        if(this.state.finalPlayers.length == 1) {
            this.state.finalPlayers[0].position = this.state.actualPosition;
            playerRanking[this.state.actualPosition - 1] = this.state.finalPlayers[0];
        } else {
            this.state.finalPlayers.forEach(player => {
                for(let idx = 0 ; idx<5 ; idx++) {
                    if(playerRanking[idx].playerId == null) {
                        player.position = playerRanking[idx].position;
                        playerRanking[idx] = player;
                        break;
                    }
                }
            });
        }
        this.setLoading(true);
        this.onPlayerRankingSaveAsync(playerRanking);
    }
    setUpdateSelected(playerSelected) {
        let players = this.state.finalPlayers;
        if(playerSelected.isSelected) {
            players.push({
                playerId: playerSelected.PlayerID,
                firstName: playerSelected.FirstName,
                lastName: playerSelected.LastName,
                photoUrl: playerSelected.PhotoUrl
            });
        } else {
            for(let idx=0 ; idx<players.length ; idx++) {
                if(players[idx].playerId == playerSelected.PlayerID) {
                    players.splice(idx, 1);
                    break;
                }
            }
        }
        this.setState({playersSelected: players});
    }
    searchPlayer() {
        super.navigateToScreen('PlayerSelectionSearch', {
            playersSelected: this.state.finalPlayers,
            players: this.state.players,
            updateListSelected: this.updateListSelected
        });
    }
    updateListSelected(playersSelected, players) {
        let playersSelectedFinal = [];
        this.state.finalPlayers.forEach(player => {
            if(player.playerId != null) playersSelectedFinal.push(player);
            players.filter(found => {
                return found.PlayerID != player.playerId;
            })
            // .map(found => {
            //     found.isSelected = true;
            //     return found;
            // });
        });
        this.setState({players: players, playersSelected: playersSelectedFinal});
    }

    // Async methods:
    initialRequest = async () => {

        let players = [
            { "PlayerID": 40000024, "FirstName": "Frank", "LastName": "Adams", "PhotoUrl": "https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/40000024.png" },
            { "PlayerID": 40000028, "FirstName": "Felipe", "LastName": "Aguilar", "PhotoUrl": "https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/40000028.png" },
            { "PlayerID": 40000031, "FirstName": "Thomas", "LastName": "Aiken", "PhotoUrl": "https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/40000031.png" },
            { "PlayerID": 40000035, "FirstName": "Steven", "LastName": "Alker", "PhotoUrl": "https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/40000035.png" },
            { "PlayerID": 40000037, "FirstName": "Fulton", "LastName": "Allem", "PhotoUrl": "https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/40000037.png" },
            { "PlayerID": 40000038, "FirstName": "Michael", "LastName": "Allen", "PhotoUrl": "https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/40000038.png" },
            { "PlayerID": 40000039, "FirstName": "Robert", "LastName": "Allenby", "PhotoUrl": "https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/40000039.png" },
            { "PlayerID": 40000040, "FirstName": "Jason", "LastName": "Allred", "PhotoUrl": "https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/40000040.png" },
            { "PlayerID": 40000044, "FirstName": "Stephen", "LastName": "Ames", "PhotoUrl": "https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/40000044.png" },
            { "PlayerID": 40000045, "FirstName": "Byeong-Hun", "LastName": "An", "PhotoUrl": "https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/40000045.png" },
            { "PlayerID": 40000052, "FirstName": "Billy", "LastName": "Andrade", "PhotoUrl": "https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/40000052.png" },
            { "PlayerID": 40001657, "FirstName": "Mark", "LastName": "Anguiano", "PhotoUrl": "https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/40001657.png" },
            { "PlayerID": 40000053, "FirstName": "Kiradech", "LastName": "Aphibarnrat", "PhotoUrl": "https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/40000053.png" },
            { "PlayerID": 40000054, "FirstName": "Stuart", "LastName": "Appleby", "PhotoUrl": "https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/40000054.png" },
            { "PlayerID": 40000055, "FirstName": "Alex", "LastName": "Aragon", "PhotoUrl": "https://s3-us-west-2.amazonaws.com/static.fantasydata.com/headshots/golf/low-res/40000055.png" }
        ];

        let playersSelected = [];
        this.state.playerRanking.forEach(player => {
            if(player.playerId != null) playersSelected.push(player);
            players = players.filter(found => {
                return found.PlayerID != player.playerId;
            })
            // .map(found => {
            //     found.isSelected = true;
            //     return found;
            // });
        });
        this.setState({players: players, playersSelected: playersSelected});

        // this.setLoading(true);
        // try {
        // GolfApiModel.get('Players').then((players) => {
        //     this.setState({players: players});
        //     this.setLoading(false);
        // }).catch(error => {
        //     console.log('ERROR! ', error);
        //     this.setLoading(false);
        // });
        // } catch (error) {
        //     console.log('ERROR! ', error);
        this.setLoading(false);
        // }
    };
    onPlayerRankingSaveAsync = async(data) => {
        await BaseModel.put(`groups/editMyPlayers/${this.state.groupId}/${this.state.tournamentId}`, {players: data})
        .then((response) => {
            this.setLoading(false);
            this.props.navigation.state.params.updatePlayerRankingList(data);
            this.props.navigation.goBack(null);
        }).catch((error) => {
            this.setLoading(false);
            BarMessages.showError(error, this.validationMessage);
        });
    };

    render() {
        return (
            <View style={{flex:1, width:'100%', backgroundColor: Constants.BACKGROUND_COLOR}} >
                <Spinner visible={this.state.loading} animation='fade' />
                <SortableListView
                    style={{flex: 1, marginBottom: '20%'}}
                    data={this.state.players}
                    renderRow= { (row) =>
                        <PlayerRow
                            data={row}
                            players={this.state.players}
                            setUpdateSelected={this.setUpdateSelected}
                            navigation={this.props.navigation} />
                    } />

                <TouchableOpacity onPress={() => this.updateLocalPlayerList()}
                    style={[MainStyles.button, MainStyles.success, {
                        position: 'absolute',
                        bottom: '1%',
                        left: '5%',
                        width: '90%'
                    }]}>
                    <Text style={MainStyles.buttonText}>Save</Text>
                </TouchableOpacity>
                <DropdownAlert ref={ref => this.validationMessage = ref} />
            </View>
        );
    }
}
