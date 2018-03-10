// React components:
import React from 'react';
import { Text, TouchableHighlight, TouchableOpacity, View, TextInput, Image } from 'react-native';
import { Avatar } from 'react-native-elements';
import SortableListView from 'react-native-sortable-listview';
import DropdownAlert from 'react-native-dropdownalert';

// Shank components
import { BaseComponent, BaseModel, GolfApiModel, MainStyles, ShankConstants, BarMessages, FontAwesome, Entypo, Spinner } from '../BaseComponent';
import ViewStyle from './styles/playerSelectionStyle';

class PlayerRow extends React.Component {
	
	constructor(props) {
		super(props);
		this.isInRoaster = this.isInRoaster.bind(this);
		this.state = {currentRoaster: this.props.currentRoaster};
	}

	isInRoaster(player) {
		console.log("this.state: ", this.state);
		return this.state.currentRoaster.indexOf(player) > -1;
	}

	playerSelected(player) {
		const roaster = this.state.currentRoaster;

		if (this.isInRoaster(player)) {
			let index = this.state.currentRoaster.indexOf(player);
			roaster.splice(index, 1);
		} else {
			roaster.push(player)
		}

		this.setState({currentRoaster: roaster});
		this.props.setCurrentRoaster(this.state.currentRoaster);
	}

	render() {
		return (
			<TouchableHighlight style={[ViewStyle.rowCell]} underlayColor={ShankConstants.HIGHLIGHT_COLOR} onPress={() => this.playerSelected(this.props.player)}>
				<View style={[ViewStyle.cellView]}>
					<View style={{flex: 1}}>
						<Avatar small rounded source={{uri: this.props.player.photoUrl}} />
					</View>

					<View style={{flex: 6}}>
						<Text style={[ViewStyle.playerName]}>{this.props.player.fullName}</Text>
					</View>

					<View style={{flex: 2}}>
						<Text style={[ViewStyle.pickRate]}>{this.props.player.pickRate != null ? this.props.player.pickRate : 0}{'%'}</Text>
					</View>

					<View style={{flex: 2, alignItems: 'center'}}>
						<View style={[ViewStyle.checkView, (this.isInRoaster(this.props.player) ? ViewStyle.selectedView : null)]}>
							<FontAwesome name='check' size={23} style={[ViewStyle.check, (this.isInRoaster(this.props.player) ? ViewStyle.selectedCheck : null)]} />
						</View>
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}

export default class PlayerSelection extends BaseComponent {

	static navigationOptions = ({navigation}) => {
		return {
			title: !navigation.state.params.isSearching ? 'CHOOSE PLAYER' : null,
			headerTintColor: ShankConstants.TERTIARY_COLOR,
			headerTitleStyle: !navigation.state.params.isSearching ? {alignSelf: 'center', color: ShankConstants.TERTIARY_COLOR} : null,
			headerStyle: {backgroundColor: ShankConstants.PRIMARY_COLOR},
			headerLeft: (
				!navigation.state.params.isSearching ?
					<TouchableHighlight onPress={() => navigation.goBack(null)}>
						<Entypo name='chevron-small-left' style={[MainStyles.headerIconButton]} />
					</TouchableHighlight>
				:
					<View style={[ViewStyle.searchInputView]}>
						<Image source={require('../../../../resources/search-icon.png')} resizeMode="contain" style={[ViewStyle.searchIcon]}></Image>
						<TextInput style={[ViewStyle.searchInput]} underlineColorAndroid="transparent" placeholderTextColor="#FFF" placeholder={'Search Players'} clearButtonMode="always" onChangeText={navigation.state.params.searchChanged}></TextInput>
					</View>
			),
			headerRight: (
				!navigation.state.params.isSearching ?
					<TouchableHighlight style={[MainStyles.headerIconButtonContainer]} onPress={() => navigation.setParams({isSearching: true})}>
						<FontAwesome name='search' style={[MainStyles.headerIconButton]} />
					</TouchableHighlight>
				:
					<TouchableOpacity style={[ViewStyle.cancelSearchButton]} onPress={() => navigation.setParams({isSearching: false})}>
						<Text style={[ViewStyle.cancelSearchText]}>Cancel</Text>
					</TouchableOpacity>
			)
		};
	}

	constructor(props) {
		super(props);
		/*this.setUpdateSelected = this.setUpdateSelected.bind(this);
		this.updateLocalPlayerList = this.updateLocalPlayerList.bind(this);
		this.searchChanged = this.searchChanged.bind(this);
		this.initialRequest = this.initialRequest.bind(this);
		this.updateListSelected = this.updateListSelected.bind(this);*/
		this.setCurrentRoaster = this.setCurrentRoaster.bind(this);
		this.state = {
			currentRoaster: this.props.navigation.state.params.currentRoaster ? this.props.navigation.state.params.currentRoaster : [] ,
			maxSelection: (5 - this.props.navigation.state.params.currentRoaster.length),
			tournament: this.props.navigation.state.params.tournament,
			players: [],

			/*isEmpty: this.props.navigation.state.params.isEmpty,
			groupId: this.props.navigation.state.params.groupId,
			tournament: this.props.navigation.state.params.tournament,
			actualPosition: this.props.navigation.state.params.actualPosition,
			playerRanking: this.props.navigation.state.params.playerRanking,
			playersSelected: [],
			finalPlayers: [],
			players: [],
			originalPlayers: [],*/

			loading: false
		};
	}

	componentDidMount() {
		this.props.navigation.setParams({searchPlayer: this.searchPlayer});
		this.props.navigation.setParams({searchChanged: this.searchChanged});
		this.initialRequest();
	}

	setLoading(loading) {
		this.setState({loading: loading});
	}

	setCurrentRoaster(roaster) {
		this.setState({currentRoaster: roaster});
	}

	/*updateLocalPlayerList() {
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

	playerGoBack = () => {
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

	searchChanged(name) {
		this.setState({
			players: this.state.originalPlayers.filter((player) => {
				let regex = new RegExp(".*" + name.toUpperCase() + ".*", "g");
				return regex.test(player.fullName.toUpperCase());
			})
		});
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
	}*/

	async initialRequest() {
		this.setLoading(true);

		BaseModel.post('players/findPlayers').then((data) => {
			this.setState({players: data.filter(player => {
				let inRoaster = false;

				for (let i = 0; i < this.state.currentRoaster.length; i++) {
					if (player.playerId == this.state.currentRoaster[i].playerId) {
						inRoaster = true;
						break;
					}
				}

				return !inRoaster;
			})});

			this.setLoading(false);
		}).catch((error) => {
			console.log('ERROR! ', error);
			this.setLoading(false);
		});
	};

	render() {
		return (
			<View style={[ViewStyle.mainContainer]}>
				<Spinner visible={this.state.loading} animation='fade' />

				<Text style={[ViewStyle.tournamentName]}>{this.state.tournament.tournamentName}</Text>

				<View style={[ViewStyle.headerView]}>
					<Text style={[ViewStyle.headerText, {flex: 7}]}>Players</Text>

					<Text style={[ViewStyle.headerText, {flex: 2}]}>Pick %</Text>

					<Text style={[ViewStyle.headerText, {flex: 2}]}>Max. {this.state.maxSelection > 0 ? this.state.maxSelection : '1'}</Text>
				</View>
				
				<SortableListView data={this.state.players} renderRow={(row) => (<PlayerRow player={row} currentRoaster={this.state.currentRoaster} setCurrentRoaster={this.setCurrentRoaster} />)} />

				{this.state.currentRoaster.length > 0 ?
					<View style={[ViewStyle.saveView]}>
						<TouchableOpacity onPress={() => this.updateLocalPlayerList()} style={[MainStyles.button, MainStyles.success, {width: '100%'}]}>
							<Text style={[MainStyles.buttonText]}>Save</Text>
						</TouchableOpacity>
					</View>
				: null}

				<DropdownAlert ref={ref => this.validationMessage = ref} />
			</View>
		);
	}
}