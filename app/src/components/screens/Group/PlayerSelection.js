// React components:
import React from 'react';
import { Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import SortableListView from 'react-native-sortable-listview';
import DropdownAlert from 'react-native-dropdownalert';

// Shank components:
import { BaseComponent, BaseModel, GolfApiModel, MainStyles, ShankConstants, BarMessages, FontAwesome, Entypo, Spinner } from '../BaseComponent';
import LocalStyles from './styles/local';

class PlayerRow extends React.Component {
	
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<TouchableHighlight style={[LocalStyles.cellMainView]} underlayColor={ShankConstants.HIGHLIGHT_COLOR} onPress={this.addPlayer} {...this.props.sortHandlers}>
				<View style={[LocalStyles.cellSubview, this.getCellBorderStyle(this.props.rowId), {paddingVertical: '5%'}]}>
					
				</View>
			</TouchableHighlight>
		);
	}
}



class PlayerRowOld extends BaseComponent {

	constructor(props) {
		super(props);
		this.playerSelected = this.playerSelected.bind(this);
		this.state = {checkIsSelected: this.props.data.isSelected ? LocalStyles.checkIsSelected : null};
	}

	playerSelected(data) {
		if (this.state.checkIsSelected != null) {
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
			<TouchableHighlight style={[MainStyles.listItem]} underlayColor={ShankConstants.HIGHLIGHT_COLOR} onPress={() => this.playerSelected(this.props.data)}>
				<View style={[MainStyles.viewFlexItemsR]}>
					<View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart]}>
						<Avatar medium rounded source={{uri: this.props.data.photoUrl}} />
					</View>

					<View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart, {flex: 2}]}>
						<Text style={[MainStyles.shankGreen, LocalStyles.titleStyle]}>{this.props.data.fullName}</Text>
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
		headerTintColor: ShankConstants.TERTIARY_COLOR,
		headerTitleStyle: {alignSelf: 'center', color: ShankConstants.TERTIARY_COLOR},
		headerStyle: { backgroundColor: ShankConstants.PRIMARY_COLOR },
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
		this.props.navigation.setParams({ searchPlayer: this.searchPlayer });
		this.initialRequest();
	}

	setLoading(loading) {
		this.setState({loading: loading});
	}

	updateLocalPlayerList() {
		if (this.state.isEmpty) {
			let quantityPlayersEmpty = 0;
			this.state.playerRanking.forEach(player => { if (player.playerId == null) quantityPlayersEmpty++; });
			
			if (this.state.finalPlayers.length > quantityPlayersEmpty) {
				let message = (quantityPlayersEmpty > 1) ? `You must select between 1 and ${quantityPlayersEmpty} players.` : 'You must select one player.';
				BarMessages.showError(message, this.validationMessage);
				return;
			}
		} else {
			if (this.state.finalPlayers.length != 1) {
				BarMessages.showError('You must select one player.', this.validationMessage);
				return;
			}
		}

		let playerRanking = this.state.playerRanking;
		if (this.state.finalPlayers.length == 1) {
			this.state.finalPlayers[0].position = this.state.actualPosition;
			playerRanking[this.state.actualPosition - 1] = this.state.finalPlayers[0];
		} else {
			this.state.finalPlayers.forEach(player => {
				for (let idx = 0 ; idx<5 ; idx++) {
					if (playerRanking[idx].playerId == null) {
						player.position = playerRanking[idx].position;
						playerRanking[idx] = player;
						break;
					}
				}
			});
		}

		this.setLoading(true);
		this.props.navigation.state.params.onPlayerRankingSaveAsync(playerRanking, this.playerGoBack);
	}

	playerGoBack() {
		this.props.navigation.goBack(null);
	};

	setUpdateSelected(playerSelected) {
		let players = this.state.finalPlayers;

		if (playerSelected.isSelected) {
			players.push({
				playerId: playerSelected.playerId,
				fullName: playerSelected.fullName,
				photoUrl: playerSelected.photoUrl
			});
		} else {
			for (let idx=0 ; idx<players.length ; idx++) {
				if (players[idx].playerId == playerSelected.PlayerID) {
					players.splice(idx, 1);
					break;
				}
			}
		}

		this.setState({playersSelected: players});
	}

	searchPlayer() {
		let players = this.state.players.filter(player => { return player.isSelected == null || !player.isSelected; });
		super.navigateToScreen('PlayerSelectionSearch', { players: players, updateListSelected: this.updateListSelected });
	}

	updateListSelected(playersSelected) {
		let finalPlayers = this.state.finalPlayers;
		let players = this.state.players;

		playersSelected.forEach(player => {
			if (player.playerId != null && finalPlayers.filter(found => { return found.playerId == player.playerId; }).length == 0) {
				finalPlayers.push(player);
			}

			this.state.players.filter(found => {
				return found.PlayerID == player.playerId;
			}).map(found => {
				found.isSelected = true;
				return found;
			});
		});

		this.setState({finalPlayers: finalPlayers});
	}

	async initialRequest() {
		this.setLoading(true);
		BaseModel.post(`players/findPlayers`).then((players) => {
			let playersSelected = [];
			this.state.playerRanking.forEach(player => {
				if (player.playerId != null) {
					playersSelected.push(player);
				}

				players = players.filter(found => {
					return found.playerId != player.playerId;
				});
			});

			this.setState({players: players, playersSelected: playersSelected});
			this.setLoading(false);
		}).catch((error) => {
			console.log('ERROR! ', error);
			this.setLoading(false);
		});
	};

	render() {
		return (
			<View style={{flex:1, width:'100%', backgroundColor: ShankConstants.BACKGROUND_COLOR}} >
				<Spinner visible={this.state.loading} animation='fade' />
				<SortableListView style={{flex: 1, marginBottom: '20%'}} data={this.state.players} renderRow= { (row) => (
					<PlayerRow data={row} players={this.state.players} setUpdateSelected={this.setUpdateSelected} navigation={this.props.navigation} />
				)} />

				<TouchableOpacity onPress={() => this.updateLocalPlayerList()} style={[MainStyles.button, MainStyles.success, {position: 'absolute', bottom: '1%', left: '5%', width: '90%'}]}>
					<Text style={MainStyles.buttonText}>Save</Text>
				</TouchableOpacity>

				<DropdownAlert ref={ref => this.validationMessage = ref} />
			</View>
		);
	}
}