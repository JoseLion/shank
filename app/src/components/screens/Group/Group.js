// React components:
import React, {Component} from 'react';
import { Modal, Text, View, TextInput, TouchableHighlight, Image, FlatList, TouchableOpacity, Picker, ActivityIndicator, Alert, Platform, PickerIOS, Share, TouchableWithoutFeedback, KeyboardAvoidingView, AsyncStorage, Animated, Easing } from 'react-native';
import { Avatar, List, ListItem } from 'react-native-elements';
import SortableListView from 'react-native-sortable-listview'
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';
import Swipeable from 'react-native-swipeable';
import DropdownAlert from 'react-native-dropdownalert';
import ActionSheet from 'react-native-actionsheet'

// Shank components:
import { BaseComponent, BaseModel, GolfApiModel, MainStyles, ShankConstants, BarMessages, FontAwesome, Entypo, isAndroid, Spinner } from '../BaseComponent';
import ViewStyle from './styles/groupStyle';
import { ClienHost } from '../../../config/variables';

class RoasterRow extends BaseComponent {

	constructor(props) {
		super(props);
		this.addPlayer = this.addPlayer.bind(this);
		this.getCellBorderStyle = this.getCellBorderStyle.bind(this);
		this.getRoasterRightButtons = this.getRoasterRightButtons.bind(this);
		this.animateCell = this.animateCell.bind(this);
	}

	addPlayer() {
		super.navigateToScreen('PlayerSelection', {
			currentRoaster: this.props.currentRoaster.filter(player => player.playerId != null),
			currentPosition: this.props.data.playerId ? Number.parseInt(this.props.rowId) + 1 : null,
			tournament: this.props.tournament,
			onPlayerRankingSaveAsync: this.props.onPlayerRankingSaveAsync




			/*actualPosition: Number.parseInt(this.props.rowId) + 1,
			isEmpty: this.props.data == null || this.props.data.playerId == null,
			groupId: this.props.groupId,
			tournament: this.props.tournament,
			playerRanking: this.props.playerRanking,
			onPlayerRankingSaveAsync: this.props.onPlayerRankingSaveAsync*/
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

	getRoasterRightButtons() {
		return [
			<TouchableHighlight style={[ViewStyle.swipeButton]} onPress={this.addPlayer}>
				<Text style={[ViewStyle.swipeButtonText]}>Change</Text>
			</TouchableHighlight>
		];
	}

	render() {
		console.log
		if (this.props.data != null && this.props.data.playerId) {
			return (
				<Swipeable rightButtons={this.getRoasterRightButtons()} rightButtonWidth={120} onRef={ref => this.swipe = ref}>
					<TouchableHighlight style={[ViewStyle.cellMainView]} underlayColor={ShankConstants.HIGHLIGHT_COLOR} onPress={this.animateCell} {...this.props.sortHandlers}>
						<View style={[ViewStyle.cellSubview, this.getCellBorderStyle(this.props.rowId), {paddingVertical: '5%'}]}>
							<View style={{flex: 1}}>
								<Text style={[ViewStyle.roasterPosition]}>{this.props.data.position}</Text>
							</View>

							<View style={{flex: 2, marginRight: '2.5%'}}>
								<Avatar medium rounded source={{uri: this.props.data.photoUrl}} />
							</View>

							<View style={{flex: 6, flexDirection: 'column', justifyContent: 'center'}}>
								<View style={{flex: 1}}>
									<Text style={[ViewStyle.roasterName]}>{this.props.data.fullName}</Text>
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
				<TouchableHighlight style={[ViewStyle.cellMainView]} underlayColor={ShankConstants.HIGHLIGHT_COLOR} onPress={this.addPlayer}>
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
			const bgColor = this.props.activeTab === page ? '#E6E7E8' : 'white';

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
		this.getLeaderboardRightButtons = this.getLeaderboardRightButtons.bind(this);
		this.getLeaderboardRow = this.getLeaderboardRow.bind(this);

		this.state = {
			currentGroup: this.props.currentGroup,
			item: this.props.item
		}
	}

	getLeaderboardRightButtons(item) {
		return [
			<TouchableHighlight style={[ViewStyle.swipeButton]} onPress={()=> this.onRemoveGroupAsync(item)}>
				<Text style={[ViewStyle.swipeButtonText]}>Remove</Text>
			</TouchableHighlight>
		];
	}

	getLeaderboardRow(item) {
		let nameFont = item.fullName == 'Invite' ? 'century-gothic' : 'century-gothic-bold';
		return (
			<TouchableHighlight style={{flex: 1, paddingHorizontal: '10%'}} underlayColor={ShankConstants.HIGHLIGHT_COLOR} onPress={() => { if (item._id < 0) this.props.inviteToJoin(); }}>
				<View style={[ViewStyle.leaderboardRow]}><View style={[ViewStyle.leaderboardRowView]}>
					<Text style={[ViewStyle.leaderboardRowText, {flex: 1}]}>{item.ranking == 0 || item.ranking == null ? '-' : item.ranking}</Text>
					<Text style={[ViewStyle.leaderboardRowText, {flex: 6, fontFamily: nameFont}]}>{item.fullName}</Text>
					<Text style={[ViewStyle.leaderboardRowPts, {flex: 3}]}>{`Pts: ${item.score || 0}`}</Text>
				</View></View>
			</TouchableHighlight>
		);
	}

	async onRemoveGroupAsync(data) {
		this.setLoading(true);
		let endPoint;

		await BaseModel.delete(`groups/removeUser/${this.state.currentGroup._id}/${data._id}`).then(() => {
			this.handleRefresh();
			this.setState({usersLength: this.state.usersLength - 1});
		}).catch((error) => {
			BarMessages.showError(error, this.validationMessage);
		}).finally(() => {
			this.setLoading(false);
		});
	};

	render() {
		if (this.state.currentGroup.isOwner && this.state.item._id > 0 && this.state.item._id != this.state.currentGroup.owner) {
			return (
				<Swipeable rightButtons={this.getLeaderboardRightButtons(this.state.item)} rightButtonWidth={120}>
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
		headerTintColor: ShankConstants.TERTIARY_COLOR,
		headerTitleStyle: {alignSelf: 'center', color: ShankConstants.TERTIARY_COLOR},
		headerStyle: { backgroundColor: ShankConstants.PRIMARY_COLOR },
		headerLeft: (
			<TouchableHighlight onPress={() => navigation.dispatch({type: 'Main'})}>
				<Entypo name='chevron-small-left' style={[MainStyles.headerIconButton]} />
			</TouchableHighlight>
		),
		headerRight: navigation.state.params.isOwner ? (
			<TouchableHighlight onPress={() => navigation.navigate('EditGroup', navigation.state.params)}>
				<Entypo name='user' style={[MainStyles.headerIconButton]} />
			</TouchableHighlight> )
		: null
	});

	constructor(props) {
		super(props);
		this.inviteToJoin = this.inviteToJoin.bind(this);
		this.showActionSheet = this.showActionSheet.bind(this);
		this.optionSelectedPressed = this.optionSelectedPressed.bind(this);
		this.updatePlayerRankingList = this.updatePlayerRankingList.bind(this);
		this.onGroupAsync = this.onGroupAsync.bind(this);
		this.handleRefresh = this.handleRefresh.bind(this);
		this.onPlayerRankingSaveAsync = this.onPlayerRankingSaveAsync.bind(this);
		this.goToCheckout = this.goToCheckout.bind(this);
		this.roasterHasChanged = this.roasterHasChanged.bind(this);
		this.isSortingDisabled = this.isSortingDisabled.bind(this);

		this.state = {
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

	componentDidMount() {
		this.props.navigation.setParams({ actionSheet: this.showActionSheet });
		AsyncStorage.getItem(ShankConstants.USER_PROFILE).then(user => { this.setState({currentUser: JSON.parse(user)}); });
		this.onGroupAsync(this.props.navigation.state.params.groupId);
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

	showActionSheet() {
		if (isAndroid) {
			this.ActionSheet.show();
		} else {
			this.props.showActionSheetWithOptions({
				options: this.state.tournamentsName,
				cancelButtonIndex: this.state.tournamentsName.length
			}, buttonIndex => this.optionSelectedPressed(buttonIndex));
		}
	}

	setLoading(loading) {
		this.setState({loading: loading});
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
		Share.share({
			message: `Join to our group '${this.state.currentGroup.name}' at http://${ClienHost}#/invite/${this.state.currentGroup.groupToken}`,
			title: 'Shank Group Invitation',
			url: `http://${ClienHost}#/invite/${this.state.currentGroup.groupToken}`
		}, {
			subject: 'Shank Group Invitation',
			dialogTitle: 'Shank Group Invitation',
			excludedActivityTypes: [
				'com.apple.UIKit.activity.PostToTwitter',
				'com.apple.uikit.activity.mail'
			],
			tintColor: 'green'
		}).then(this._showResult).catch(err => console.log(err));
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
				BarMessages.showError(error, this.validationMessage);
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
					BarMessages.showError(error, this.validationMessage);
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
			BarMessages.showError(error, this.validationMessage);
		});
	};

	render() {
		let addPhoto = require('../../../../resources/add_edit_photo.png');
		let navigation = this.props.navigation;

		return (
			<View style={[MainStyles.container]}>
				<Spinner visible={this.state.loading} animation='fade'></Spinner>
				<ActionSheet ref={o => this.ActionSheet = o} options={this.state.tournamentsName} cancelButtonIndex={this.state.tournamentsName.length - 1} onPress={this.optionSelectedPressed}></ActionSheet>

				<View style={[ViewStyle.groupInformation]}>
					<View>
						{this.state.groupPhoto != null && this.state.groupPhoto != '' ?
						<Avatar large rounded source={{uri: this.state.groupPhoto}}></Avatar>
						: <Avatar large rounded source={addPhoto}></Avatar>}
					</View>

					<View style={[ViewStyle.groupHeader]}>
						<View>
							<Text style={[ViewStyle.groupNameText]}>{this.state.currentGroup.name}</Text>
						</View>

						<View style={{flexDirection: 'row', alignItems: 'center'}}>
							<TouchableHighlight underlayColor={ShankConstants.HIGHLIGHT_COLOR} onPress={() => navigation.state.params.actionSheet()}>
								<Text style={[ViewStyle.tournamentNameText]}>{this.state.currentTournament.tournamentName ? this.state.currentTournament.tournamentName.toUpperCase() : null}</Text>
							</TouchableHighlight>
							<FontAwesome name="chevron-down"></FontAwesome>
						</View>
					</View>

					<View style={{flex:2}}>
						{this.state.currentGroup.isOwner ?
							<TouchableOpacity style={[MainStyles.button, MainStyles.success, MainStyles.buttonVerticalPadding]} onPress={this.inviteToJoin}>
								<Text style={MainStyles.buttonText}>Invite</Text>
							</TouchableOpacity>
						: null}
					</View>
				</View>

				<View style={[ViewStyle.prizeView]}>
					<View style={[ViewStyle.prizeSubView]}>
						<View><Text style={[ViewStyle.prizeText]}>PRIZE</Text></View>
						<View><Text style={[ViewStyle.prizeDescription]}>{this.state.currentGroup.bet}</Text></View>
					</View>
				</View>

				<View style={[ViewStyle.groupStats]}>
					<View style={[ViewStyle.statView]}>
						<View><Text style={[ViewStyle.statNumber]}>{this.state.currentTournament.myScore == 0 ? '-' : this.state.currentTournament.myScore}</Text></View>
						<View><Text style={[ViewStyle.statLabel]}>Points</Text></View>
					</View>
					
					<View style={[ViewStyle.statView]}>
						<View><Text style={[ViewStyle.statNumber]}>{this.state.currentTournament.myRanking == 0 ? '-' : this.state.currentTournament.myRanking}/{this.state.usersLength}</Text></View>
						<View><Text style={[ViewStyle.statLabel]}>Ranking</Text></View>
					</View>

					<View style={[ViewStyle.statView]}>
						<View><Text style={[ViewStyle.statNumber]}>{this.state.diffDays}</Text></View>
						<View><Text style={[ViewStyle.statLabel]}>Days Left</Text></View>
					</View>
				</View>

				<View style={{flex: 6, flexDirection: 'row'}}>
					{<ScrollableTabView initialPage={0} locked={true} tabBarActiveTextColor={ShankConstants.PRIMARY_COLOR} tabBarInactiveTextColor={ShankConstants.PRIMARY_COLOR} renderTabBar={() => <GroupTabBar />}>
						<View tabLabel='Leaderboard' style={[ViewStyle.tabViewContainer]}>
							<Text style={[ViewStyle.rankColumnText]}>Rank</Text>
							
							<List containerStyle={[ViewStyle.leaderboardList]}>
								<FlatList data={this.state.currentTournament.users} keyExtractor={item => item._id} renderItem={({item}) => (<LeaderboardRow currentGroup={this.state.currentGroup} item={item} inviteToJoin={this.inviteToJoin}/>)} />
							</List>
						</View>

						<View tabLabel='Roaster' style={[ViewStyle.tabViewContainer]}>
							<RoundLabels tournament={this.state.tournamentData}></RoundLabels>
							
							<SortableListView data={this.state.playerRanking} order={this.state.order} disableSorting={this.isSortingDisabled()} activeOpacity={1.0} onMoveStart={() => { lockScrollTabView = true; }}
							onMoveEnd={() => { lockScrollTabView = false; }} onRowMoved={e => {
								this.state.order.splice(e.to, 0, this.state.order.splice(e.from, 1)[0]);
								let playerRanking = [];
								Object.assign(playerRanking, this.state.playerRanking);
								playerRanking[e.from].position = (e.to + 1);
						
								if (e.to > e.from) {
									for (let idx = e.from + 1 ; idx > e.from && idx <= e.to ; idx++) {
										playerRanking[idx].position = playerRanking[idx].position - 1;
									}
								} else if (e.to < e.from) {
									for (let idx = e.to ; idx >= e.to && idx < e.from ; idx++) {
										playerRanking[idx].position = playerRanking[idx].position + 1;
									}
								}

								this.updatePlayerRankingList(playerRanking);
								this.forceUpdate();
							}} renderRow={(row, rowId, sectionId) => (
								<RoasterRow navigation={navigation} data={row} rowId={sectionId} groupId={this.state.currentGroup._id} tournament={this.state.currentTournament}
								currentRoaster={this.state.playerRanking} onPlayerRankingSaveAsync={this.onPlayerRankingSaveAsync} hideSortBars={this.isSortingDisabled()}></RoasterRow>
							)}></SortableListView>

							{this.roasterHasChanged() ?
								<View style={[ViewStyle.checkoutButtonView]}>
									<TouchableOpacity onPress={this.goToCheckout} style={[MainStyles.button, MainStyles.success]}>
										<Text style={MainStyles.buttonText}>Checkout</Text>
									</TouchableOpacity>
								</View>
							: null}
						</View>
					</ScrollableTabView>}
				</View>

				<DropdownAlert ref={ref => this.validationMessage = ref} />
			</View>
		);
	}
}