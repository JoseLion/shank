// React components:
import React from 'react';
import { Text, TouchableHighlight, TouchableOpacity, View, TextInput, Image, FlatList } from 'react-native';
import { Avatar } from 'react-native-elements';
import SortableListView from 'react-native-sortable-listview';
import DropdownAlert from 'react-native-dropdownalert';

// Shank components
import { BaseComponent, BaseModel, GolfApiModel, MainStyles, AppConst, BarMessages, FontAwesome, Entypo, Spinner } from '../BaseComponent';
import ViewStyle from './styles/playerSelectionStyle';

class PlayerRow extends React.Component {
	
	constructor(props) {
		super(props);
		this.onPress = this.onPress.bind(this);
		this.state = {
			cross: this.props.cross,
			count: this.props.count,
			checkGreen: require('../../../../resources/check-green-icon.png'),
			checkWhite: require('../../../../resources/check-white-icon.png')
		};
	}

	onPress() {
		if (this.props.count < this.props.max || this.state.cross.isSelected) {
			this.setState(state => {
				const cross = Object.assign({}, state.cross);
				cross.isSelected = !state.cross.isSelected;
				return { cross };
			});

			this.props.onPressItem();
		}
	}

	render() {
		return (
			<TouchableHighlight style={[ViewStyle.rowCell]} underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={this.onPress}>
				<View style={[ViewStyle.cellView]}>
					<View style={{flex: 1}}>
						<Image source={{uri: this.state.cross.player && this.state.cross.player.photoUrl}} resizeMode={'contain'} resizeMethod={'resize'} style={ViewStyle.playerImage} />
					</View>

					<View style={{flex: 6}}>
						<Text style={[ViewStyle.playerName]}>{this.state.cross.player && (this.state.cross.player.firstName + ' ' + this.state.cross.player.lastName)}</Text>
					</View>

					<View style={{flex: 2}}>
						<Text style={[ViewStyle.pickRate]}>0%</Text>
					</View>

					<View style={{flex: 2, alignItems: 'center'}}>
						<View style={[ViewStyle.checkView, (this.state.cross.isSelected ? ViewStyle.selectedView : null)]}>
							<Image source={this.state.cross.isSelected ? this.state.checkWhite : this.state.checkGreen} resizeMode={'contain'} resizeMethod={'resize'} style={ViewStyle.checkImage} />
						</View>
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}

export default class PlayerSelection extends BaseComponent {

	static navigationOptions = ({navigation}) => {
		if (navigation.state.params.isSearching) {
			return {
				title: null,
				headerTitleStyle: null,
				headerLeft: (
					<View style={[ViewStyle.searchInputView]}>
						<Image source={require('../../../../resources/search-icon.png')} resizeMode="contain" style={[ViewStyle.searchIcon]}></Image>
						<TextInput style={[ViewStyle.searchInput]} underlineColorAndroid="transparent" placeholderTextColor="#FFF" placeholder={'Search Players'} clearButtonMode="always" onChangeText={navigation.state.params.searchChanged}></TextInput>
					</View>
				),
				headerRight: (
					<TouchableOpacity style={[ViewStyle.cancelSearchButton]} onPress={() => {
						navigation.state.params.searchChanged("");
						navigation.setParams({isSearching: false});
					}}>
						<Text style={[ViewStyle.cancelSearchText]}>Cancel</Text>
					</TouchableOpacity>
				)
			};
		} else {
			return {
				title: 'CHOOSE PLAYER',
				headerRight: (
					<TouchableOpacity style={[MainStyles.headerIconButtonContainer]} onPress={() => navigation.setParams({isSearching: true})}>
						<FontAwesome name='search' style={[MainStyles.headerIconButton]} />
					</TouchableOpacity>
				)
			};
		}
	}

	constructor(props) {
		super(props);
		this.playerSelected = this.playerSelected.bind(this);

		this.setCurrentRoaster = this.setCurrentRoaster.bind(this);
		this.searchChanged = this.searchChanged.bind(this);
		this.save = this.save.bind(this);
		this.state = {
			isLoading: false,
			selectCount: 0,
			roaster: this.props.navigation.state.params.roaster ? this.props.navigation.state.params.roaster : [] ,
			position: this.props.navigation.state.params.position,
			group: this.props.navigation.state.params.group,
			tournamentIndex: this.props.navigation.state.params.tournamentIndex,
			currentUserIndex: this.props.navigation.state.params.currentUserIndex,
			searchPlayers: [],
			leaderboard: [],
			loading: false
		};
	}

	playerSelected(cross) {
		let roaster = [...this.state.roaster];
		let selectCount = this.state.selectCount;

		if (this.state.position) {
			if (roaster[position] == cross) {
				selectCount = 0;
				roaster[position] = {};
			} else {
				selectCount = 1;
				roaster[position] = cross;
			}
		} else {
			let index = roaster.indexOf(cross);

			if (index > -1) {
				roaster.splice(index, 1);
				selectCount--;
			} else {
				roaster.push(cross);
				selectCount++;
			}
		}

		this.setState({ roaster, selectCount });
	}

	async componentDidMount() {
		//this.props.navigation.setParams({searchPlayer: this.searchPlayer});
		this.props.navigation.setParams({searchChanged: this.searchChanged});

		this.setState({isLoading: true});
		let leaderboard = await BaseModel.get('leaderboard/findByTournament/' + this.state.group.tournaments[this.state.tournamentIndex].tournament._id).catch(error => this.toasterMsg = error);
		this.setState({leaderboard: leaderboard, isLoading: false});
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
				BarMessages.showError(error, this.toasterMsg);
				this.setLoading(false);
			});
		}
	}

	playerGoBack() {
		this.props.navigation.goBack(null);
	}

	hasTournamentBegan() {
		let today = new Date();
		let startDate = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.startDate);

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
				<Spinner visible={this.state.isLoading} animation='fade' />

				<Text style={[ViewStyle.tournamentName]}>{this.state.group.tournaments[this.state.tournamentIndex].tournament.name}</Text>

				<View style={[ViewStyle.headerView]}>
					<Text style={[ViewStyle.headerText, {flex: 7}]}>Players</Text>

					<Text style={[ViewStyle.headerText, {flex: 2}]}>Pick %</Text>

					<Text style={[ViewStyle.headerText, {flex: 2}]}>Select {this.state.position ? '1' : '5'}</Text>
				</View>
				
				<FlatList data={this.state.leaderboard} keyExtractor={item => item._id} extraData={this.state.selectCount} renderItem={({item}) => (
					<PlayerRow cross={item} count={this.state.selectCount} max={this.state.position ? 1 : 5} onPressItem={() => this.playerSelected(item)} />
				)} />

				{this.state.selectCount == (this.state.currentPosition ? 1 : 5) ?
					<View style={[ViewStyle.saveView]}>
						<TouchableOpacity onPress={this.save} style={[MainStyles.button, MainStyles.success, {width: '100%'}]}>
							<Text style={[MainStyles.buttonText]}>{this.hasTournamentBegan() ? 'Done' : 'Save'}</Text>
						</TouchableOpacity>
					</View>
				: null}

				<DropdownAlert ref={ref => this.toasterMsg = ref} />
			</View>
		);
	}
}