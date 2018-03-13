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
		this.state = {currentRoaster: this.props.currentRoaster, oneSelected: false};
	}

	isInRoaster(player) {
		return this.state.currentRoaster.indexOf(player) > -1;
	}

	playerSelected(player) {
		let roaster = this.state.currentRoaster;

		if (this.props.currentPosition) {
			if (this.isInRoaster(player)) {
				this.setState({oneSelected: false});
				roaster.splice(this.props.currentPosition - 1, 1, null);
			} else {
				if (!this.state.oneSelected) {
					this.setState({oneSelected: true});
					roaster.splice(this.props.currentPosition - 1, 1, player);
				}
			}
		} else {
			if (this.state.currentRoaster.length < 5 || this.isInRoaster(player)) {
				if (this.isInRoaster(player)) {
					let index = this.state.currentRoaster.indexOf(player);
					roaster.splice(index, 1);
				} else {
					roaster.push(player)
				}
			}
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
					<TouchableOpacity style={[ViewStyle.cancelSearchButton]} onPress={() => {
						navigation.state.params.searchChanged("");
						navigation.setParams({isSearching: false});
					}}>
						<Text style={[ViewStyle.cancelSearchText]}>Cancel</Text>
					</TouchableOpacity>
			)
		};
	}

	constructor(props) {
		super(props);
		this.setCurrentRoaster = this.setCurrentRoaster.bind(this);
		this.searchChanged = this.searchChanged.bind(this);
		this.save = this.save.bind(this);
		this.state = {
			currentRoaster: this.props.navigation.state.params.currentRoaster ? this.props.navigation.state.params.currentRoaster : [] ,
			currentPosition: this.props.navigation.state.params.currentPosition,
			group: this.props.navigation.state.params.group,
			tournament: this.props.navigation.state.params.tournament,
			updateRoaster: this.props.navigation.state.params.updateRoaster,
			searchPlayers: [],
			players: [],
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

	searchChanged(name) {
		this.setState({
			players: this.state.searchPlayers.filter((player) => {
				let regex = new RegExp(".*" + name.toUpperCase() + ".*", "g");
				return regex.test(player.fullName.toUpperCase());
			})
		});
	}

	async save() {
		let currentRoaster = this.state.currentRoaster;

		if (this.state.currentPosition) {
			currentRoaster[this.state.currentPosition - 1].position = this.state.currentPosition;
		} else {
			let pos = 0;

			currentRoaster.forEach(player => {
				if (player.position != null) {
					pos = player.position;
				} else {
					pos++;
					player.position = pos;
				}
			});
		}

		if (this.hasTournamentBegan()) {
			this.state.updateRoaster(currentRoaster);
			this.props.navigation.goBack(null);
		} else {
			this.setLoading(true);

			console.log("currentRoaster: ", currentRoaster);
			await BaseModel.put(`groups/editMyPlayers/${this.state.group._id}/${this.state.tournament._id}`, {players: currentRoaster}).then(response => {
				this.state.updateRoaster(currentRoaster);
				this.setLoading(false);
				this.props.navigation.goBack(null);
			}).catch(error => {
				console.log("error: ", error);
				BarMessages.showError(error, this.validationMessage);
				this.setLoading(false);
			});
		}
	}

	playerGoBack() {
		this.props.navigation.goBack(null);
	}

	hasTournamentBegan() {
		let today = new Date();
		let startDate = new Date(this.state.tournament.startDate);

		if (today.getTime() >= startDate.getTime()) {
			return true;
		}

		return false;
	}

	async initialRequest() {
		this.setLoading(true);

		BaseModel.post('players/findPlayers').then((data) => {
			const players = data.filter(player => {
				let inRoaster = false;

				for (let i = 0; i < this.state.currentRoaster.length; i++) {
					if (player.playerId == this.state.currentRoaster[i].playerId) {
						inRoaster = true;
						break;
					}
				}

				return !inRoaster;
			});

			this.setState({players: players, searchPlayers: players});
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

					<Text style={[ViewStyle.headerText, {flex: 2}]}>Select {this.state.currentPosition ? '1' : '5'}</Text>
				</View>
				
				<SortableListView data={this.state.players} renderRow={(row) => (<PlayerRow player={row} currentRoaster={this.state.currentRoaster} setCurrentRoaster={this.setCurrentRoaster} currentPosition={this.state.currentPosition} />)} />

				{this.state.currentRoaster.length == (this.state.currentPosition ? 1 : 5) ?
					<View style={[ViewStyle.saveView]}>
						<TouchableOpacity onPress={this.save} style={[MainStyles.button, MainStyles.success, {width: '100%'}]}>
							<Text style={[MainStyles.buttonText]}>{this.hasTournamentBegan() ? 'Done' : 'Save'}</Text>
						</TouchableOpacity>
					</View>
				: null}

				<DropdownAlert ref={ref => this.validationMessage = ref} />
			</View>
		);
	}
}