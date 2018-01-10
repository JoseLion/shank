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
        this.state = { checkIsSelected: null };
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
            <TouchableHighlight underlayColor={Constants.HIGHLIGHT_COLOR}
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
                onPress={() => this.playerSelected()}>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <Avatar medium rounded source={{uri: this.props.data.PhotoUrl}} />
                    <Text>{this.props.data.position}</Text>
                    <Text style={[MainStyles.shankGreen, LocalStyles.titleStyle]}>{this.props.data.FirstName} {this.props.data.LastName}</Text>
                    <FontAwesome name='check' size={29} style={[LocalStyles.selectedCheck, this.state.checkIsSelected]}/>
                </View>
            </TouchableHighlight >
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
            <View>
                <FontAwesome name='search' style={[MainStyles.headerIconButton]} />
            </View>
        )
    });

    constructor(props) {
        super(props);
        this.setUpdateSelected = this.setUpdateSelected.bind(this);
        this.updateLocalPlayerList = this.updateLocalPlayerList.bind(this);
        this.state = {
            groupId: this.props.navigation.state.params.groupId,
            tournamentId: this.props.navigation.state.params.tournamentId,
            actualPosition: this.props.navigation.state.params.actualPosition,
            playerRanking: this.props.navigation.state.params.playerRanking,
            playersSelected: [],
            players: [],
            loading: false
        };
    }
    componentDidMount() { this.initialRequest(); }

    setLoading(loading) { this.setState({loading: loading}); }
    updateLocalPlayerList() {
        if(this.state.playersSelected.length === 0 || this.state.playersSelected.length > 5) {
            BarMessages.showError('You must select 5 players.', this.validationMessage);
            return;
        }
        let playerRanking = this.state.playerRanking;
        if(this.state.playersSelected.length == 1) {
            this.state.playersSelected[0].position = this.state.actualPosition;
            playerRanking[this.state.actualPosition - 1] = this.state.playersSelected[0];
        } else {
            playerRanking = [];
            let actualPosition = this.state.actualPosition;
            this.state.playersSelected.forEach(function(player) {
                player.position = actualPosition++;
                playerRanking.push(player);
                if(actualPosition == 6) actualPosition = 1;
            });
            while(playerRanking.length < 5) {
                playerRanking.push({position: actualPosition++});
                if(actualPosition == 6) actualPosition = 1;
            }
        }
        this.setLoading(true);
        this.onPlayerRankingSaveAsync(playerRanking);
    }
    setUpdateSelected(playerSelected) {
        let players = this.state.playersSelected;
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

    // Async methods:
    initialRequest = async () => {
        this.setLoading(true);
        try {
            GolfApiModel.get('Players').then((players) => {
                this.setState({players: players});
                this.setLoading(false);
            }).catch(error => {
                console.log('ERROR! ', error);
                this.setLoading(false);
            });
        } catch (error) {
            console.log('ERROR! ', error);
            this.setLoading(false);
        }
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
