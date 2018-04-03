// React components:
import React, { Component } from 'react';
import { Text, View, TouchableHighlight, Image, FlatList, TouchableOpacity, ActionSheetIOS, Picker, Share, AsyncStorage, Animated, Easing, Alert } from 'react-native';
import SortableListView from 'react-native-sortable-listview'
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Swipeable from 'react-native-swipeable';
import DropdownAlert from 'react-native-dropdownalert';
import ActionSheet from 'react-native-actionsheet';
import SortableList from 'react-native-sortable-list';
import * as InAppBilling from 'react-native-billing';

// Shank components:
import { BaseComponent, BaseModel, FileHost, MainStyles, AppConst, FontAwesome, isAndroid, Spinner } from '../BaseComponent';
import { ClienHost } from '../../../config/variables';
import ViewStyle from './styles/groupStyle';

class RoasterRow extends Component {

	constructor(props) {
		super(props);
		this.animateCell = this.animateCell.bind(this);
		this.onPress = this.onPress.bind(this);
		this.state = {roaster: this.props.roaster};
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

	onPress() {
		this.props.onPress();

		if (this.swipe != null) {
			this.swipe.recenter()
		}
	}

	render() {
		if (this.state.roaster && this.state.roaster.playerTournamentID) {
			const changeButton = [
				<TouchableHighlight style={[ViewStyle.swipeButton]} onPress={this.onPress}>
					<Text style={[ViewStyle.swipeButtonText]}>Change</Text>
				</TouchableHighlight>
			];

			return (
				<Swipeable rightButtons={changeButton} rightButtonWidth={120} onRef={ref => this.swipe = ref}>
					<TouchableHighlight style={[ViewStyle.cellMainView]} underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={this.animateCell} onLongPress={this.props.toggleRowActive} {...this.props.sortHandlers}>
						<View style={[ViewStyle.cellSubview, {paddingVertical: '3%'}]}>
							<View style={{flex: 1}}>
								<Text style={[ViewStyle.roasterPosition]}>{Number.parseInt(this.props.rowId) + 1}</Text>
							</View>

							<View style={{flex: 2, marginRight: '2%'}}>
								<Image source={{uri: this.state.roaster.player.photoUrl}} resizeMode={'contain'} resizeMethod={'resize'} style={ViewStyle.roasterImage} />
							</View>

							<View style={{flex: 6, flexDirection: 'column', justifyContent: 'center'}}>
								<View style={{flex: 1}}>
									<Text style={[ViewStyle.roasterName]}>{this.state.roaster.player.firstName} {this.state.roaster.player.lastName}</Text>
								</View>

								<View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
									<View style={{flex: 1}}>
										<Text style={[ViewStyle.roasterInfo]}>{`TR: ${this.state.roaster.rank > 0 ? this.state.roaster.rank : '-'}`}</Text>
									</View>

									<View style={{flex: 1}}>
										<Text style={[ViewStyle.roasterInfo]}>{`Pts: ${this.state.roaster.totalScore == null ? '-' : this.state.roaster.totalScore}`}</Text>
									</View>
								</View>
							</View>

							{!this.props.hideSortBars ?
								<View style={{flex: 1}}>
									<Image source={require('../../../../resources/sort-bars.png')} resizeMode={'contain'} resizeMethod={'resize'} style={ViewStyle.sortImage} />
								</View>
							: null}
						</View>
					</TouchableHighlight>
				</Swipeable>
			);
		} else {
			return (
				<TouchableHighlight style={[ViewStyle.cellMainView]} underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={this.onPress} {...this.props.sortHandlers}>
					<View style={[ViewStyle.cellSubview]}>
						<Text style={[ViewStyle.roasterPosition, {flex: 1}]}>{Number.parseInt(this.props.rowId) + 1}</Text>
						<Text style={[ViewStyle.roasterEmpty, {flex: 10}]}>Empty Slot</Text>
					</View>
				</TouchableHighlight>
			);
		}
	}
}

class RoundLabels extends Component {
	
	constructor(props) {
		super(props);
		this.getLabelColor = this.getLabelColor.bind(this);
	}

	getLabelColor(round) {
		const today = new Date();
		const day = new Date(round.day);

		if (today.getFullYear() == day.getFullYear() && today.getMonth() == day.getMonth() && today.getDate() == day.getDate()) {
			return {backgroundColor: AppConst.COLOR_BLUE};
		}

		return {backgroundColor: AppConst.COLOR_GRAY};
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

class GroupTabBar extends Component {
	
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

class LeaderboardRow extends Component {
	
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
		title: 'GROUP'/*,
		headerRight: (
			<TouchableOpacity style={ViewStyle.editButton} onPress={navigation.state.params.editGroup}>
				<Text style={ViewStyle.editButtonText}>Edit</Text>
			</TouchableOpacity>
		)*/
	});

	constructor(props) {
		super(props);
		this.getCurrentUserStat = this.getCurrentUserStat.bind(this);
		this.getDaysObj = this.getDaysObj.bind(this);
		this.showActionSheet = this.showActionSheet.bind(this);
		this.tournamentSelected = this.tournamentSelected.bind(this);
		this.inviteToJoin = this.inviteToJoin.bind(this);
		this.removeUserFromGroup = this.removeUserFromGroup.bind(this);
		this.managePlayers = this.managePlayers.bind(this);
		this.managePlayersCallback = this.managePlayersCallback.bind(this);
		this.shouldShowCheckout = this.shouldShowCheckout.bind(this);
		this.goToCheckout = this.goToCheckout.bind(this);
		this.isOnCourse = this.isOnCourse.bind(this);
		this.handleError = this.handleError.bind(this);
		this.state = {
			isLoading: false,
			group: {},
			currentUser: {},
			sheetNames: ['Cancel'],
			tournamentIndex: 0,
			currentUserIndex: 0
		};
	}

	setGroupData(group) {
		try {
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
			const userRoaster = group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].roaster;
			this.setState({ group, sheetNames, userRoaster });
		} catch(error) {
			this.handleError(error);
		}
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

	getDaysObj() {
		if (this.state.group.tournaments) {
			let today = new Date();
			let startDate = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.startDate);
			let endDate = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.endDate);
			
			if (today.getTime() < startDate.getTime()) {
				return {
					days: Math.ceil((startDate.getTime() - today.getTime()) / 1000.0 / 60.0 / 60.0 / 24.0),
					label: 'Days to begin'
				};
			}

			if (today.getTime() > endDate.getTime()) {
				return {days: '-', labal: 'Days left'};
			}

			return {
				days: Math.ceil((endDate.getTime() - today.getTime()) / 1000.0 / 60.0 / 60.0 / 24.0),
				label: 'Days left'
			};
		}

		return {};
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

	inviteToJoin() {
		const url = `http://${ClienHost}#/invite/${this.state.group._id}`;

		Share.share({
			message: `Join to our group '${this.state.group.name}' at ${url}`,
			title: 'Shank Group Invitation',
			url: url,
		}, {
			subject: 'Shank Group Invitation',
			dialogTitle: 'Shank Group Invitation',
			excludedActivityTypes: [
				'com.apple.UIKit.activity.PostToTwitter',
				'com.apple.uikit.activity.mail'
			],
			tintColor: AppConst.COLOR_GREEN
		}).catch(this.handleError);
	}

	async removeUserFromGroup(cross) {
		this.setState({isLoading: true});
		const group = await BaseModel.delete(`group/removeUserFromGroup/${this.state.item.user._id}/${this.state.group._id}`).catch(this.handleError);
		this.setGroupData(group);
		this.setState({isLoading: false});
	}

	managePlayers(row, index) {
		this.props.navigation.navigate('PlayerSelection', {
			roaster: this.state.group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].roaster.filter(cross => cross.player != null),
			position: row.player ? index : null,
			group: this.state.group,
			tournamentIndex: this.state.tournamentIndex,
			currentUserIndex: this.state.currentUserIndex,
			onPlayesrsManaged: this.onPlayesrsManaged,
			managePlayersCallback: this.managePlayersCallback
		});
	}

	managePlayersCallback(data, shouldCheckout) {
		if (shouldCheckout) {
			let group = Object.assign({}, this.state.group);
			group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].roaster = data;
			this.setState({ group });
		} else {
			this.setGroupData(data);
		}
	}

	shouldShowCheckout() {
		let hasChanged = false;

		if (this.state.group.tournaments) {
			const today = new Date();
			const startDate = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.startDate);
			const endDate = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.endDate);

			if (today.getTime() > startDate.getTime() && today.getTime() < endDate.getTime()) {
				for (let i = 0; i < this.state.userRoaster.length; i++) {
					if (this.state.userRoaster[i]._id != this.state.group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].roaster[i]._id) {
						hasChanged = true;
						break;
					}
				}
			}
		}

		return hasChanged;
	}

	goToCheckout() {
		let today = new Date();
		let round = 0;

		for (let i = 0; i < this.state.group.tournaments[this.state.tournamentIndex].tournament.rounds.length; i++) {
			let day = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.rounds[i].day);

			if (today.getFullYear() == day.getFullYear() && today.getMonth() == day.getMonth() && today.getDate() == day.getDate()) {
				round = i + 1;
				break;
			}
		}

		this.props.navigation.navigate('Checkout', {
			groupId: this.state.group._id,
			tournamentId: this.state.group.tournaments[this.state.tournamentIndex].tournament._id,
			originalRoaster: this.state.userRoaster,
			roaster: this.state.group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].roaster,
			round: round,
			managePlayersCallback: this.managePlayersCallback
		});
	}

	isOnCourse() {
		if (this.state.group && this.state.group.tournaments) {
			const today = new Date();
			const startDate = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.startDate);
			const endDate = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.endDate);

			if (today.getTime() >= startDate.getTime() && today.getTime() <= endDate.getTime()) {
				return true;
			}
		}

		return false;
	}
	
	handleError(error) {
		this.setState({isLoading: false});
		this.toasterMsg = error;
	}

	async componentDidMount() {
		//const InAppBillingBridge = require("react-native").NativeModules.InAppBillingBridge;
		//console.log("InAppBilling.open(): ", InAppBilling.open());
		/*Alert.alert('Initializing', 'Starting InAppBilling...', [{text: 'OK', style: 'cancel', onPress: () => {
			let billing = InAppBilling.open().then(() => InAppBilling.purchase('android.test.purchased')).then(details => {
				Alert.alert('InAppBilling:', `Purchase details -> ${details}`, [{text: 'OK', style: 'cancel'}]);
				return InAppBilling.close();
			}).catch(this.handleError);
		}}]);*/

		this.setState({isLoading: true});

		const group = await BaseModel.get("group/findOne/" + this.props.navigation.state.params.groupId).catch(this.handleError);
		const currentUser = await AsyncStorage.getItem(AppConst.USER_PROFILE).catch(this.handleError);
		this.setState({currentUser: JSON.parse(currentUser)});
		this.setGroupData(group);
		this.props.navigation.setParams({editGroup: () => {
			this.props.navigation.navigate('AddGroup', {group: this.state.group});
		}});

		this.setState({isLoading: false});
	}

	render() {
		return (
			<View style={{width: '100%', height: '100%', backgroundColor: AppConst.COLOR_WHITE}}>
				<Spinner visible={this.state.isLoading} animation='fade'></Spinner>
				<ActionSheet ref={sheet => this.actionSheet = sheet} options={this.state.sheetNames} cancelButtonIndex={this.state.sheetNames.length} onPress={this.tournamentSelected} />

				<View style={[ViewStyle.groupInformation]}>
					<Image source={{uri: FileHost + this.state.group.photo}} resizeMode={'contain'} resizeMethod={'resize'} style={ViewStyle.groupImage} />

					<View style={[ViewStyle.groupHeader]}>
						<View>
							<Text style={[ViewStyle.groupNameText]}>{this.state.group.name}</Text>
						</View>

						
						<TouchableOpacity underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={() => this.showActionSheet()}>
							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								<Text style={[ViewStyle.tournamentNameText]} numberOfLines={1}>{this.state.group.tournaments && this.state.group.tournaments[this.state.tournamentIndex].tournament.name}</Text>
								<FontAwesome name="chevron-down" />
							</View>
						</TouchableOpacity>
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
						<View><Text style={[ViewStyle.statNumber]}>{this.getCurrentUserStat('score')}</Text></View>
						<View><Text style={[ViewStyle.statLabel]}>Points</Text></View>
					</View>
					
					<View style={[ViewStyle.statView]}>
						<View><Text style={[ViewStyle.statNumber]}>{this.getCurrentUserStat('rank')}/{this.state.group.tournaments && this.state.group.tournaments[this.state.tournamentIndex].leaderboard.length - 1}</Text></View>
						<View><Text style={[ViewStyle.statLabel]}>Ranking</Text></View>
					</View>

					<View style={[ViewStyle.statView]}>
						<View><Text style={[ViewStyle.statNumber]}>{this.getDaysObj().days}</Text></View>
						<View><Text style={[ViewStyle.statLabel]}>{this.getDaysObj().label}</Text></View>
					</View>
				</View>

				<View style={{flex: 6, flexDirection: 'row'}}>
					<ScrollableTabView initialPage={0} locked={true} tabBarActiveTextColor={AppConst.COLOR_BLUE} tabBarInactiveTextColor={AppConst.COLOR_BLUE} renderTabBar={() => <GroupTabBar />}>
						<View tabLabel='Leaderboard' style={[ViewStyle.tabViewContainer]}>
							<Text style={[ViewStyle.rankColumnText]}>Rank</Text>
							
							<FlatList data={this.state.group.tournaments && this.state.group.tournaments[this.state.tournamentIndex].leaderboard} keyExtractor={item => item._id} renderItem={({item}) => (<LeaderboardRow item={item} group={this.state.group} currentUser={this.state.currentUser} inviteToJoin={this.inviteToJoin} onRemove={this.removeUserFromGroup} />)} />
						</View>

						<View tabLabel='Roaster' style={[ViewStyle.tabViewContainer]}>
							<RoundLabels tournament={this.state.group.tournaments && this.state.group.tournaments[this.state.tournamentIndex].tournament} />

							<SortableList style={{flex: 1}} sortingEnabled={this.isOnCourse()} manuallyActivateRows={true} data={this.state.group.tournaments ? this.state.group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].roaster : []} renderRow={({data, index}) => (
								<RoasterRow roaster={data} rowId={index} hideSortBars={!this.isOnCourse()} onPress={() => this.managePlayers(data, index)} />
							)} onChangeOrder={nextOrder => this.nextOrder = nextOrder} onReleaseRow={key => {
								if (this.nextOrder) {
									let roaster = [];
									this.nextOrder.forEach(order => {
										roaster.push(this.state.group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].roaster[order]);
									});

									let group = Object.assign({}, this.state.group);
									group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].roaster = roaster;
									this.setState({ group });
								}
							}} />

							{this.shouldShowCheckout() ?
								<View style={ViewStyle.checkoutButtonView}>
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