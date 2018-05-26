// React components:
import React from 'react';
import { Text, TouchableHighlight, TouchableOpacity, View, TextInput, Image, FlatList } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';

// Shank components
import { BaseComponent, BaseModel, MainStyles, AppConst, BarMessages } from '../BaseComponent';
import handleError from "Core/handleError";
import ViewStyle from './styles/playerSelectionStyle';

// Images
import SearchIcon from 'Res/search-icon.png';
import CheckWhiteIcon from 'Res/check-white-icon.png';
import CheckGreenIcon from 'Res/check-green-icon.png';
import UserIcon from 'Res/user-icon.png';

class PlayerRow extends React.Component {
	
	constructor(props) {
		super(props);
		this.onPress = this.onPress.bind(this);
		this.state = {cross: this.props.cross};
	}

	async onPress() {
		if (this.props.count < this.props.max || this.state.cross.isSelected) {
			await this.setState(state => {
				const cross = Object.assign({}, state.cross);
				cross.isSelected = !state.cross.isSelected;
				return { cross };
			});

			this.props.onPressItem();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (this.state != nextState) {
			return true;
		}

		return false;
	}

	render() {
		return (
			<TouchableHighlight style={[ViewStyle.rowCell]} underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={this.onPress}>
				<View style={[ViewStyle.cellView]}>
					<View style={{flex: 1}}>
						<ImageLoad style={ViewStyle.playerImage} source={{uri: this.state.cross.player && this.state.cross.player.photoUrl}} resizeMode={'contain'} resizeMethod={'resize'}
						placeholderSource={UserIcon} placeholderStyle={ViewStyle.playerImage} />
					</View>

					<View style={{flex: 6}}>
						<Text style={[ViewStyle.playerName]}>{this.state.cross.player && (this.state.cross.player.firstName + ' ' + this.state.cross.player.lastName)}</Text>
					</View>

					<View style={{flex: 2}}>
						<Text style={[ViewStyle.pickRate]}>0%</Text>
					</View>

					<View style={{flex: 2, alignItems: 'center'}}>
						<View style={[ViewStyle.checkView, (this.state.cross.isSelected ? ViewStyle.selectedView : null)]}>
							{this.state.cross.isSelected ? 
								<Image source={CheckWhiteIcon} resizeMode={'contain'} resizeMethod={'resize'} style={ViewStyle.checkImage} />
							:
								<Image source={CheckGreenIcon} resizeMode={'contain'} resizeMethod={'resize'} style={ViewStyle.checkImage} />
							}
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
						<Image source={SearchIcon} resizeMode="contain" resizeMethod={'resize'} style={[ViewStyle.searchIcon]}></Image>
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
						<Image style={ViewStyle.searchButton} source={SearchIcon} resizeMode="contain" resizeMethod={'resize'} />
					</TouchableOpacity>
				)
			};
		}
	}

	constructor(props) {
		super(props);
		this.searchList = [];
		this.roaster = this.props.navigation.state.params.roaster ? this.props.navigation.state.params.roaster : [];
		this.playerSelected = this.playerSelected.bind(this);
		this.searchChanged = this.searchChanged.bind(this);
		this.done = this.done.bind(this);
		this.state = {
			selectCount: 0,
			position: this.props.navigation.state.params.position,
			group: this.props.navigation.state.params.group,
			tournamentIndex: this.props.navigation.state.params.tournamentIndex,
			currentUserIndex: this.props.navigation.state.params.currentUserIndex,
			leaderboard: []
		};
	}

	async playerSelected(cross) {
		const max = this.state.position != null ? 1 : 5;
		let selectCount = this.state.selectCount;

		if (selectCount < max || cross.isSelected) {
			await this.setState(state => {
				const leaderboard = [...state.leaderboard];

				leaderboard.forEach(leader => {
					if (cross._id == leader._id) {
						leader.isSelected = !leader.isSelected;
						return;
					}
				});

				return { leaderboard };
			});
		}


		if (this.state.position != null) {
			if (this.roaster[this.state.position] == cross) {
				selectCount = 0;
				this.roaster[this.state.position] = {};
			} else {
				selectCount = 1;
				this.roaster[this.state.position] = cross;
			}
		} else {
			let index = this.roaster.indexOf(cross);

			if (index > -1) {
				this.roaster.splice(index, 1);
				selectCount--;
			} else {
				this.roaster.push(cross);
				selectCount++;
			}
		}

		this.setState({ selectCount });
	}

	async searchChanged(name) {
		this.setState({
			leaderboard: this.searchList.filter((cross) => {
				let regex = new RegExp(".*" + name.toUpperCase() + ".*", "g");
				return regex.test(cross.player.firstName.toUpperCase() + " " + cross.player.lastName.toUpperCase());
			})
		});
	}

	async done() {
		if (this.hasTournamentBegan() && !this.state.group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].isRoasterEmpty) {
			this.props.navigation.state.params.managePlayersCallback(this.roaster, true);
			this.props.navigation.goBack();
		} else {
			global.setLoading(true);
			const tournamentId = this.state.group.tournaments[this.state.tournamentIndex].tournament._id;
			const group = await BaseModel.post(`group/updateMyRoaster/${this.state.group._id}/${tournamentId}`, {roaster: this.roaster}).catch(error => {
				if (error.status === 205) {
					EventRegister.emit(AppConst.EVENTS.reloadCurrentGroup);
				}

				handleError(error);
			});
			
			this.props.navigation.state.params.managePlayersCallback(group, false);
			global.setLoading(false);
			this.props.navigation.goBack();
		}
	}

	hasTournamentBegan() {
		const today = new Date();
		const startDate = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.startDate);

		if (today.getTime() >= startDate.getTime()) {
			return true;
		}

		return false;
	}

	async componentDidMount() {
		this.props.navigation.setParams({searchChanged: this.searchChanged});

		global.setLoading(true);
		let leaderboard = await BaseModel.get('leaderboard/findByTournament/' + this.state.group.tournaments[this.state.tournamentIndex].tournament._id).catch(handleError);
		leaderboard = leaderboard.filter(cross => {
			let isInRoaster = false;

			for (let i = 0; i < this.roaster.length; i++) {
				if (cross.player._id == this.roaster[i].player._id) {
					isInRoaster = true;
					break;
				}
			}

			return !isInRoaster;
		});

		this.setState({leaderboard: leaderboard});
		this.searchList = [...this.state.leaderboard];
		global.setLoading(false);
	}

	render() {
		return (
			<View style={[ViewStyle.mainContainer]}>
				<Text style={[ViewStyle.tournamentName]}>{this.state.group.tournaments[this.state.tournamentIndex].tournament.name}</Text>

				<View style={[ViewStyle.headerView]}>
					<Text style={[ViewStyle.headerText, {flex: 7}]}>Players</Text>

					<Text style={[ViewStyle.headerText, {flex: 2}]}>Pick %</Text>

					<Text style={[ViewStyle.headerText, {flex: 2}]}>Select {this.state.position != null ? '1' : '5'}</Text>
				</View>
				
				<FlatList data={this.state.leaderboard} keyExtractor={item => item._id} extraData={this.state.selectCount} renderItem={({item}) => (
					<PlayerRow cross={item} count={this.state.selectCount} max={this.state.position != null ? 1 : 5} onPressItem={() => this.playerSelected(item)} />
				)} />

				{this.state.selectCount == (this.state.position != null ? 1 : 5) ?
					<View style={[ViewStyle.saveView]}>
						<TouchableOpacity onPress={this.done} style={[MainStyles.button, MainStyles.success, {width: '100%'}]}>
							<Text style={[MainStyles.buttonText]}>{this.hasTournamentBegan() && !this.state.group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].isRoasterEmpty ? 'Done' : 'Save'}</Text>
						</TouchableOpacity>
					</View>
				: null}
			</View>
		);
	}
}