// React components:
import React, {Component} from 'react';
import { Modal, Text, View, TextInput, TouchableHighlight, Image, FlatList, TouchableOpacity, ActionSheetIOS, Picker, ActivityIndicator, Alert, Platform, PickerIOS, Share, TouchableWithoutFeedback, KeyboardAvoidingView, AsyncStorage, Animated, Easing } from 'react-native';
import { Avatar, List, ListItem } from 'react-native-elements';
import SortableListView from 'react-native-sortable-listview'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import Swipeable from 'react-native-swipeable';
import DropdownAlert from 'react-native-dropdownalert';
import ActionSheet from 'react-native-actionsheet'

// Shank components:
import { BaseComponent, BaseModel, FileHost, GolfApiModel, MainStyles, AppConst, BarMessages, FontAwesome, Entypo, isAndroid, Spinner } from '../BaseComponent';
import ViewStyle from './styles/groupStyle';
import { ClienHost } from '../../../config/variables';

class RoasterRow extends BaseComponent {

	constructor(props) {
		super(props);
		this.addPlayer = this.addPlayer.bind(this);
		this.getCellBorderStyle = this.getCellBorderStyle.bind(this);
		this.animateCell = this.animateCell.bind(this);
	}

	addPlayer() {
		super.navigateToScreen('PlayerSelection', {
			currentRoaster: this.props.currentRoaster.filter(player => player.playerId != null),
			currentPosition: this.props.data.playerId ? Number.parseInt(this.props.rowId) + 1 : null,
			group: this.props.group,
			tournament: this.props.tournament,
			updateRoaster: this.props.updateRoaster
		});

		if (this.swipe != null) {
			this.swipe.recenter()
		}
	}

	animateCell() {
		const {pan} = this.swipe.state;

		this.setState({
			lastOffset: {x: 0, y: 0},
			leftActionActivated: false,
			leftButtonsActivated: false,
			leftButtonsOpen: false,
			rightActionActivated: false,
			rightButtonsActivated: false,
			rightButtonsOpen: false
		});

		pan.flattenOffset();

		Animated.timing(pan, {
			toValue: {x: -60, y: 0},
			duration: 250,
			easing: Easing.elastic(0.5)
		}).start(() => this.swipe.recenter());
	}
	
	getCellBorderStyle(index) {
		if (index == 0) {
			return {borderBottomWidth: 0.5};
		}

		return {borderTopWidth: 0.5, borderBottomWidth: 0.5};
	}

	render() {
		if (this.props.data != null && this.props.data._id > 0) {
			const changeButton = [
				<TouchableHighlight style={[ViewStyle.swipeButton]} onPress={this.addPlayer}>
					<Text style={[ViewStyle.swipeButtonText]}>Change</Text>
				</TouchableHighlight>
			];

			return (
				<Swipeable rightButtons={changeButton} rightButtonWidth={120} onRef={ref => this.swipe = ref}>
					<TouchableHighlight style={[ViewStyle.cellMainView]} underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={this.animateCell} {...this.props.sortHandlers}>
						<View style={[ViewStyle.cellSubview, this.getCellBorderStyle(this.props.rowId), {paddingVertical: '5%'}]}>
							<View style={{flex: 1}}>
								<Text style={[ViewStyle.roasterPosition]}>{Number.parseInt(this.props.rowId) + 1}</Text>
							</View>

							<View style={{flex: 2, marginRight: '2.5%'}}>
								<Avatar medium rounded source={{uri: this.props.data.photoUrl}} />
							</View>

							<View style={{flex: 6, flexDirection: 'column', justifyContent: 'center'}}>
								<View style={{flex: 1}}>
									<Text style={[ViewStyle.roasterName]}>{this.props.data.firstName} {this.props.data.lastName}</Text>
								</View>

								<View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
									<View style={{flex: 1}}>
										<Text style={[ViewStyle.roasterInfo]}>{`TR: ${this.props.data.tournamentPosition > 0 ? this.props.data.tournamentPosition : '-'}`}</Text>
									</View>

									<View style={{flex: 1}}>
										<Text style={[ViewStyle.roasterInfo]}>{`Pts: ${this.props.data.score == null ? '-' : this.props.data.score}`}</Text>
									</View>
								</View>
							</View>

							{!this.props.hideSortBars ?
								<View style={{flex: 1}}>
									<Image source={require('../../../../resources/sort-bars.png')} resizeMode={'contain'} style={[{height: 15}]}></Image>
								</View>
							: null}
						</View>
					</TouchableHighlight>
				</Swipeable>
			);
		} else {
			return (
				<TouchableHighlight style={[ViewStyle.cellMainView]} underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={this.addPlayer}>
					<View style={[ViewStyle.cellSubview, this.getCellBorderStyle(this.props.rowId)]}>
						<Text style={[ViewStyle.roasterPosition, {flex: 1}]}>{Number.parseInt(this.props.rowId) + 1}</Text>
						<Text style={[ViewStyle.roasterEmpty, {flex: 10}]}>Empty Slot</Text>
					</View>
				</TouchableHighlight>
			);
		}
	}
}

class RoundLabels extends React.Component {
	
	constructor(props) {
		super(props);
		this.getLabelColor = this.getLabelColor.bind(this);
	}

	getLabelColor(round) {
		const today = new Date();
		const day = new Date(round.day);

		if (today.getFullYear() == day.getFullYear() && today.getMonth() == day.getMonth() && today.getDate() == day.getDate()) {
			return {backgroundColor: '#252D3B', borderColor: '#252D3B'};
		}

		return {backgroundColor: '#B6B6B5', borderColor: '#B6B6B5'};
	}

	render() {
		if (this.props.tournament != null && this.props.tournament.rounds != null) {
			let labels = this.props.tournament.rounds.map((round) => {
				return (
					<View key={round._id} style={[ViewStyle.roundLabel, this.getLabelColor(round)]}>
						<Text style={[ViewStyle.roundLabelText]}>{round.number}</Text>
					</View>
				);
			});

			return (
				<View style={[ViewStyle.roundLabelsView]}>
					<Text style={[ViewStyle.roundsText]}>ROUND</Text>
					{labels}
				</View>
			);
		} else {
			return null;
		}			
	}
}

class GroupTabBar extends React.Component {
	
	constructor(props) {
		super(props);
	}

	render() {
		let tabs = this.props.tabs.map((name, page) => {
			const bgColor = this.props.activeTab === page ? AppConst.COLOR_HIGHLIGHT : AppConst.COLOR_WHITE;

			return (
				<TouchableOpacity key={name} style={[ViewStyle.tabButton, {backgroundColor: bgColor}]} onPress={() => {this.props.goToPage(page)}}>
					<Text style={[ViewStyle.groupNameText]}>{name}</Text>
				</TouchableOpacity>
			);
		});

		return (
			<View style={[ViewStyle.tabsView]}>
				{tabs}
				<Animated.View style={{backgroundColor: '#E6E7E8'}} />
			</View>
		);
	}
}

class LeaderboardRow extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			group: this.props.group,
			currentUser: this.props.currentUser,
			item: this.props.item
		}
	}

	getLeaderboardRow(item) {
		let nameFont = item.user ? 'century-gothic-bold' : 'century-gothic';
		return (
			<TouchableHighlight style={{flex: 1, paddingHorizontal: '10%'}} underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={() => { if (!item.user) this.props.inviteToJoin(); }}>
				<View style={[ViewStyle.leaderboardRow]}><View style={[ViewStyle.leaderboardRowView]}>
					<Text style={[ViewStyle.leaderboardRowText, {flex: 1}]}>{item.rank > 0 ? item.ranking : '-'}</Text>
					<Text style={[ViewStyle.leaderboardRowText, {flex: 6, fontFamily: nameFont}]}>{item.user ? item.user.fullName : 'Invite'}</Text>
					<Text style={[ViewStyle.leaderboardRowPts, {flex: 3}]}>Pts: {item.score ? item.score : '0'}</Text>
				</View></View>
			</TouchableHighlight>
		);
	}

	render() {
		if (this.state.item.user && this.state.group.owner == this.state.currentUser._id && this.state.group.owner != this.state.item.user._id) {
			const removeButton = [
				<TouchableHighlight style={[ViewStyle.swipeButton]} onPress={()=> this.props.onRemove(this.state.item)}>
					<Text style={[ViewStyle.swipeButtonText]}>Remove</Text>
				</TouchableHighlight>
			];

			return (
				<Swipeable rightButtons={removeButton} rightButtonWidth={120}>
					{this.getLeaderboardRow(this.state.item)}
				</Swipeable>
			);
		} else {
			return this.getLeaderboardRow(this.state.item);
		}
	}
}

export default class Group extends BaseComponent {
	
	static navigationOptions = ({navigation}) => ({
		title: 'GROUP',
		headerRight: navigation.state.params.isOwner ? (
			<TouchableHighlight onPress={() => navigation.navigate('EditGroup', navigation.state.params)}>
				<Entypo name='user' style={[MainStyles.headerIconButton]} />
			</TouchableHighlight> )
		: null
	});

	constructor(props) {
		super(props);
		this.getCurrentUserStat = this.getCurrentUserStat.bind(this);
		this.getDaysLeft = this.getDaysLeft.bind(this);
		this.showActionSheet = this.showActionSheet.bind(this);
		this.tournamentSelected = this.tournamentSelected.bind(this);
		this.removeUserFromGroup = this.removeUserFromGroup.bind(this);


		this.inviteToJoin = this.inviteToJoin.bind(this);
		this.optionSelectedPressed = this.optionSelectedPressed.bind(this);
		this.updatePlayerRankingList = this.updatePlayerRankingList.bind(this);
		this.onGroupAsync = this.onGroupAsync.bind(this);
		this.handleRefresh = this.handleRefresh.bind(this);
		this.onPlayerRankingSaveAsync = this.onPlayerRankingSaveAsync.bind(this);
		this.goToCheckout = this.goToCheckout.bind(this);
		this.roasterHasChanged = this.roasterHasChanged.bind(this);
		this.isSortingDisabled = this.isSortingDisabled.bind(this);
		this.updateRoaster = this.updateRoaster.bind(this);

		this.state = {
			isLoading: false,
			group: {},
			currentUser: {},
			sheetNames: ['Cancel'],
			tournamentIndex: 0,
			currentUserIndex: 0,


			currentGroup: {},
			groupPhoto: null,
			currentTournament: {},
			tournamentData: {},
			diffDays: 0,
			tournaments: [],
			tournamentsName: [],
			playersLeaderboard: [],
			usersLength: 1,
			score: 0,
			ranking: 0,
			playerRanking: [],
			order: [],
			originalRanking: '',
			showCheckout: false,
			movementsDone: 0,
			pricePerMovement: 0
		};
	}

	setGroupData(group) {
		const sheetNames = group.tournaments.map(cross => cross.tournament.name);
		sheetNames.push('Cancel');

		group.tournaments[this.state.tournamentIndex].leaderboard.forEach((cross, i) => {
			if (cross.roaster.length == 0) {
				for (let i = -1; i >= -5; i--) {
					cross.roaster.push({_id: i});
				}
			}

			if (cross.user._id == this.state.currentUser._id) {
				this.setState({currentUserIndex: i});
			}
		});

		group.tournaments[this.state.tournamentIndex].leaderboard.push({_id: -1});
		this.setState({ group, sheetNames });
	}

	getCurrentUserStat(key) {
		let stat = 0;

		if (this.state.group.tournaments) {
			this.state.group.tournaments[this.state.tournamentIndex].leaderboard.forEach(cross => {
				if (cross.user && cross.user._id == this.state.currentUser._id) {
					stat = cross[key];
					return;
				}
			});
		}

		return stat;
	}

	getDaysLeft() {
		let days = 0;

		if (this.state.group.tournaments) {
			let today = new Date();
			let startDate = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.startDate);
			let endDate = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.endDate);
			
			if (today.getTime() < startDate.getTime() || today.getTime() > endDate.getTime()) {
				return '-';
			}

			return Math.ceil((endDate.getTime() - today.getTime()) / 1000.0 / 60.0 / 60.0 / 24.0);

		}
	}

	showActionSheet() {
		if (this.state.group.tournaments) {
			if (isAndroid) {
				this.actionSheet.show();
			} else {
				ActionSheetIOS.showActionSheetWithOptions({options: this.state.sheetNames, cancelButtonIndex: this.state.sheetNames.length}, this.tournamentSelected);
			}
		}
	}

	tournamentSelected(index) {
		if (index != this.state.sheetNames.length - 1) {
			this.setState({tournamentIndex: index});
		}
	}

	async removeUserFromGroup(cross) {
		this.setState({isLoading: true});
		const group = await BaseModel.delete(`group/removeUserFromGroup/${this.state.item.user._id}/${this.state.group._id}`).catch(error => this.toasterMsg = error);
		this.setGroupData(group);
		this.setState({isLoading: false});
	}

	async componentDidMount() {
		this.setState({isLoading: true});

		const group = await BaseModel.get("group/findOne/" + this.props.navigation.state.params.groupId).catch(error => this.toasterMsg = error);
		const currentUser = await AsyncStorage.getItem(AppConst.USER_PROFILE).catch(error => this.toasterMsg = error);
		this.setState({currentUser: JSON.parse(currentUser)});
		this.setGroupData(group);

		this.setState({isLoading: false});
	}









	optionSelectedPressed(actionIndex) {
		if (actionIndex == (this.state.tournamentsName.length - 1)) {
			return;
		}

		this.setState({currentTournament: this.state.currentGroup.tournaments[actionIndex], showCheckout: false, loading: true});
		this.state.currentGroup.tournaments[actionIndex].users.forEach((user) => {
			if (user._id == this.state.currentUser._id) {
				let playerRanking = (user.playerRanking == null || user.playerRanking.length == 0) ? [
					{position: 1},
					{position: 2},
					{position: 3},
					{position: 4},
					{position: 5}
				] : user.playerRanking;
				this.setState({originalRanking: JSON.stringify(playerRanking)});
				this.updatePlayerRankingList(playerRanking);
				return;
			}
		});

		BaseModel.get(`tournaments/getTournament/${this.state.currentGroup.tournaments[actionIndex].tournamentId}`).then((tournamentData) => {
			let nowDate = new Date();
			nowDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
			let diff = new Date(tournamentData.endDate).getTime() - nowDate.getTime();

			if (diff > 0) {
				diff = Math.ceil(diff / (1000*3600*24));
			} else {
				diff = 0;
			}

			this.setState({
				tournamentData: tournamentData,
				playersLeaderboard: [],
				diffDays: diff
			});
			this.setLoading(false);
		}).catch((error) => {
			this.setLoading(false);
		});
	}

	setLoading(loading) {
		this.setState({isLoading: loading});
	}

	updatePlayerRankingList(playerRanking) {
		playerRanking = playerRanking.sort(function(a, b) { return a.position - b.position; });
		let order = Object.keys(playerRanking);
		this.setState({playerRanking: playerRanking, order: order});
	}

	handleRefresh() {
		this.setState({ refreshing: true }, () => { this.onGroupAsync(this.state.currentGroup._id); });
	};

	inviteToJoin() {
		const url = `http://${ClienHost}#/invite/${this.state.group._id}`;
		Share.share({
			message: `Join to our group '${this.state.currentGroup.name}' at ${url}`,
			title: 'Shank Group Invitation',
			url: `${url}`
		}, {
			subject: 'Shank Group Invitation',
			dialogTitle: 'Shank Group Invitation',
			excludedActivityTypes: [
				'com.apple.UIKit.activity.PostToTwitter',
				'com.apple.uikit.activity.mail'
			],
			tintColor: AppConst.COLOR_GREEN
		}).catch(err => console.log(err));
	}

	goToCheckout() {
		let today = new Date();
		let round = 0;

		for (let i = 0; i < this.state.tournamentData.rounds.length; i++) {
			let day = new Date(this.state.tournamentData.rounds[i].day);

			if (today.getFullYear() == day.getFullYear() && today.getMonth() == day.getMonth() && today.getDate() == day.getDate()) {
				round = i + 1;
				break;
			}
		}

		let params = {
			groupId: this.state.currentGroup._id,
			isOwner: this.props.navigation.state.params.isOwner,
			tournamentId: this.state.currentTournament._id,
			originalRanking: JSON.parse(this.state.originalRanking),
			playerRanking: this.state.playerRanking,
			round: round
		};
		this.props.navigation.navigate('Checkout', params);
	}

	roasterHasChanged() {
		let hasChanged = false;
		let today = new Date();
		let startDate = new Date(this.state.tournamentData.startDate);
		let endDate = new Date(this.state.tournamentData.endDate);

		if (today.getTime() > startDate.getTime() && today.getTime() < endDate.getTime()) {
			const originalRoaster = this.state.originalRanking == '' ? [] : JSON.parse(this.state.originalRanking);

			if (this.state.playerRanking != null && this.state.playerRanking.length == originalRoaster.length) {
				for (let i = 0; i < originalRoaster.length; i++) {
					if (originalRoaster[i]._id !== this.state.playerRanking[i]._id) {
						hasChanged = true;
						break;
					}
				}
			}
		}

		return hasChanged;
	}

	isSortingDisabled() {
		let today = new Date();
		let endDate = new Date(this.state.tournamentData.endDate);

		if (today.getTime() >= endDate.getTime()) {
			return true;
		}

		return false;
	}

	updateRoaster(roaster) {
		if (roaster.length < 5) {
			for (let i = roaster.length; i < 5; i++) {
				roaster.push({position: i + 1});
			}
		}

		this.setState({playerRanking: roaster});
	}

	async initialRequest() {
		try {
			if (this.props.navigation.state.params.isOwner) {
				do {
					this.state.currentTournament.users.push({fullName: 'Invite', _id: (Math.random() * -1000)});
				} while (this.state.currentTournament.users.length < 5);

				this.state.currentGroup.users.push({fullName: 'Invite', _id: (Math.random() * -1000)});
			}
		} catch (error) {
			console.log('ERROR! ', error);
		}
		this.getPricePerMovement();
	};

	async getPricePerMovement() {
		await BaseModel.get('appSettings/findByCode/PPM').then((setting) => {
			this.state.pricePerMovement = JSON.parse(setting.value);
		}).catch((error) => {
			this.setLoading(false);
		});
	}

	async onPlayerRankingSaveAsync(data, method) {
		/*let tournamentData = this.state.currentTournament;
		let nowDate = new Date();
		nowDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
		let tournamentDate = new Date(new Date(tournamentData.startDate).getFullYear(), new Date(tournamentData.startDate).getMonth(), new Date(tournamentData.startDate).getDate());
		let diff = tournamentDate.getTime() - nowDate.getTime();
		diff = Math.ceil(diff / (1000*3600*24));*/

		if (this.state.diffDays > 0) {
			this.setLoading(true);

			await BaseModel.put(`groups/editMyPlayers/${this.state.currentGroup._id}/${this.state.currentTournament._id}`, {players: data}).then((response) => {
				this.setLoading(false);
				this.updatePlayerRankingList(data);
				this.setState({originalRanking: JSON.stringify(data)});
				
				if (method != null) {
					method();
				}
			}).catch((error) => {
				console.log("error: ", error);
				BarMessages.showError(error, this.toasterMsg);
				this.setLoading(false);
			});
		} else {
			let original = JSON.parse(this.state.originalRanking);
			let updated = false;
			let showCheckout = false;
			
			for (let i=0 ; i<original.length ; i++) {
				let dataChanged = data.filter(ranking => { return ranking.position == original[i].position})[0];
				
				if (original[i].playerId == null && dataChanged.playerId != null) {
					original[i] = dataChanged;
					updated = true;
				} else if (original[i].playerId != dataChanged.playerId) {
					showCheckout = true;
				}
			}

			if (updated) {
				await BaseModel.put(`groups/editMyPlayers/${this.state.currentGroup._id}/${this.state.currentTournament._id}`, {players: original}).then((response) => {
					this.setLoading(false);
					this.updatePlayerRankingList(original);
					this.setState({originalRanking: JSON.stringify(original)});
					
					if (method != null) {
						method();
					}
				}).catch((error) => {
					console.log("error: ", error);
					BarMessages.showError(error, this.toasterMsg);
					this.setLoading(false);
				});
			} else {
				this.setState({showCheckout: showCheckout});
				this.updatePlayerRankingList(data);
				
				if (method != null) {
					method();
				}
			}
		}
	};

	async onGroupAsync(data) {
		let self = this;
		this.setState({loading: true});

		await BaseModel.get(`groups/group/${data}`).then((currentGroup) => {
			let tournaments = [];
			let tournamentsName = [];

			currentGroup.tournaments.forEach(function(tournament) {
				tournaments.push(tournament);
				tournamentsName.push(tournament.tournamentName);
			});

			tournamentsName.push('Cancel');
			this.setState({
				currentGroup: currentGroup,
				groupPhoto: currentGroup.photo.path,
				currentTournament: currentGroup.tournaments[0],
				tournaments: tournaments,
				tournamentsName: tournamentsName,
				usersLength: currentGroup.users.length,
				loading: false
			});

			currentGroup.tournaments[0].users.forEach(function(user) {
				if (user._id == self.state.currentUser._id) {
					let playerRanking = (user.playerRanking == null || user.playerRanking.length == 0) ? [
						{position: 1},
						{position: 2},
						{position: 3},
						{position: 4},
						{position: 5}
					] : user.playerRanking;
					let showCheckout = false;

					if (self.state.originalRanking != '') {
						let original = JSON.parse(self.state.originalRanking);

						for (let i=0; i < original.length; i++) {
							let dataChanged = self.state.playerRanking.filter(ranking => { return ranking.position == original[i].position; })[0];
							
							if (original[i].playerId != dataChanged.playerId) {
								showCheckout = true;
							}
						}
					}

					self.setState({originalRanking: JSON.stringify(playerRanking), showCheckout: showCheckout});
					self.updatePlayerRankingList(playerRanking);
					return;
				}
			});

			this.props.navigation.setParams({currentGroup: currentGroup});
			BaseModel.get(`tournaments/getTournament/${currentGroup.tournaments[0].tournamentId}`).then((tournamentData) => {
				let nowDate = new Date();
				nowDate = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
				let diff = new Date(tournamentData.endDate).getTime() - nowDate.getTime();
				
				if (diff > 0) {
					diff = Math.ceil(diff / (1000*3600*24));
				} else {
					diff = 0;
				}

				this.setState({
					tournamentData: tournamentData,
					playersLeaderboard: [],
					diffDays: diff
				});
				this.setLoading(false);
			}).catch((error) => {
				this.setLoading(false);
			});
			this.initialRequest();
		}).catch((error) => {
			this.setLoading(false);
			BarMessages.showError(error, this.toasterMsg);
		});
	};

	render() {
		let addPhoto = require('../../../../resources/add_edit_photo.png');
		let navigation = this.props.navigation;

		return (
			<View style={{width: '100%', height: '100%', backgroundColor: AppConst.COLOR_WHITE}}>
				<Spinner visible={this.state.isLoading} animation='fade'></Spinner>
				<ActionSheet ref={sheet => this.actionSheet = sheet} options={this.state.sheetNames} cancelButtonIndex={this.state.sheetNames.length} onPress={this.tournamentSelected} />

				<View style={[ViewStyle.groupInformation]}>
					<View>
						<Avatar large rounded source={{uri: FileHost + this.state.group.photo}}></Avatar>
					</View>

					<View style={[ViewStyle.groupHeader]}>
						<View>
							<Text style={[ViewStyle.groupNameText]}>{this.state.group.name}</Text>
						</View>

						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<TouchableHighlight underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={() => this.showActionSheet()}>
								<Text style={[ViewStyle.tournamentNameText]}>{this.state.group.tournaments && this.state.group.tournaments[this.state.tournamentIndex].tournament.name}</Text>
							</TouchableHighlight>
							<FontAwesome name="chevron-down"></FontAwesome>
						</View>
					</View>

					<View style={{flex:2}}>
						{this.state.group.owner == this.state.currentUser._id ?
							<TouchableOpacity style={[MainStyles.button, MainStyles.success, MainStyles.buttonVerticalPadding]} onPress={this.inviteToJoin}>
								<Text style={MainStyles.buttonText}>Invite</Text>
							</TouchableOpacity>
						: null}
					</View>
				</View>

				<View style={[ViewStyle.prizeView]}>
					<View style={[ViewStyle.prizeSubView]}>
						<View><Text style={[ViewStyle.prizeText]}>PRIZE</Text></View>
						<View><Text style={[ViewStyle.prizeDescription]}>{this.state.group.bet}</Text></View>
					</View>
				</View>

				<View style={[ViewStyle.groupStats]}>
					<View style={[ViewStyle.statView]}>
						<View><Text style={[ViewStyle.statNumber]}>{this.getCurrentUserStat('score') == 0 ? '-' : this.getCurrentUserStat('score')}</Text></View>
						<View><Text style={[ViewStyle.statLabel]}>Points</Text></View>
					</View>
					
					<View style={[ViewStyle.statView]}>
						<View><Text style={[ViewStyle.statNumber]}>{this.getCurrentUserStat('rank') == 0 ? '-' : this.getCurrentUserStat('rank')}/{this.state.group.tournaments && this.state.group.tournaments[this.state.tournamentIndex].leaderboard.length - 1}</Text></View>
						<View><Text style={[ViewStyle.statLabel]}>Ranking</Text></View>
					</View>

					<View style={[ViewStyle.statView]}>
						<View><Text style={[ViewStyle.statNumber]}>{this.getDaysLeft()}</Text></View>
						<View><Text style={[ViewStyle.statLabel]}>Days Left</Text></View>
					</View>
				</View>

				<View style={{flex: 6, flexDirection: 'row'}}>
					<ScrollableTabView initialPage={0} locked={true} tabBarActiveTextColor={AppConst.COLOR_BLUE} tabBarInactiveTextColor={AppConst.COLOR_BLUE} renderTabBar={() => <GroupTabBar />}>
						<View tabLabel='Leaderboard' style={[ViewStyle.tabViewContainer]}>
							<Text style={[ViewStyle.rankColumnText]}>Rank</Text>
							
							<List containerStyle={[ViewStyle.leaderboardList]}>
								<FlatList data={this.state.group.tournaments && this.state.group.tournaments[this.state.tournamentIndex].leaderboard} keyExtractor={item => item._id} renderItem={({item}) => (<LeaderboardRow item={item} group={this.state.group} currentUser={this.state.currentUser} inviteToJoin={this.inviteToJoin} onRemove={this.removeUserFromGroup} />)} />
							</List>
						</View>

						<View tabLabel='Roaster' style={[ViewStyle.tabViewContainer]}>
							<RoundLabels tournament={this.state.tournamentData}></RoundLabels>
							
							<SortableListView data={this.state.group.tournaments && this.state.group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].roaster} disableSorting={this.isSortingDisabled()} activeOpacity={1.0} onMoveStart={() => lockScrollTabView = true} renderRow={(row, rowId, sectionId) => (
								<RoasterRow navigation={navigation} data={row} rowId={sectionId} group={this.state.group} tournament={this.state.currentTournament} currentRoaster={this.state.playerRanking} updateRoaster={this.updateRoaster}/>
							)} />

							{this.roasterHasChanged() ?
								<View style={[ViewStyle.checkoutButtonView]}>
									<TouchableOpacity onPress={this.goToCheckout} style={[MainStyles.button, MainStyles.success]}>
										<Text style={MainStyles.buttonText}>Checkout</Text>
									</TouchableOpacity>
								</View>
							: null}
						</View>
					</ScrollableTabView>
				</View>

				<DropdownAlert ref={ref => this.toasterMsg = ref} />
			</View>
		);
	}
}