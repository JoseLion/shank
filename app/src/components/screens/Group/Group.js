// React components:
import React, { Component } from 'react';
import { Text, View, ScrollView, RefreshControl, TouchableHighlight, Image, FlatList, TouchableOpacity, ActionSheetIOS, Picker, Share, AsyncStorage, Animated, Easing, Alert } from 'react-native';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import Swipeable from 'react-native-swipeable';
import DropdownAlert from 'react-native-dropdownalert';
import ActionSheet from 'react-native-actionsheet';
import SortableList from 'react-native-sortable-list';
import { EventRegister } from 'react-native-event-listeners';

// Shank components:
import { BaseComponent, BaseModel, FileHost, MainStyles, AppConst, IsAndroid, Spinner } from '../BaseComponent';
import { ClientHost } from '../../../config/variables';
import handleError from 'Core/handleError';
import Style from 'ShankStyle';
import ViewStyle from './styles/groupStyle';

import DownCaretIcon from 'Res/down-caret-icon.png';
import SortBarsIcon from 'Res/sort-bars.png';
import Icon from 'react-native-vector-icons/Ionicons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { COLOR_WHITE } from 'Core/AppConst';

class RoasterRow extends Component {

	constructor(props) {
		super(props);
		this.animateCell = this.animateCell.bind(this);
		this.onPress = this.onPress.bind(this);
		this.onLongPress = this.onLongPress.bind(this);
		this.resetShadowStyle = this.resetShadowStyle.bind(this);
		this.state = {
			roaster: this.props.roaster,
			shadowStyle: null,
			separatorWith: 1,
			popLeft: new Animated.Value(0.0),
			popBottom: new Animated.Value(0.0)
		};
	}

	animateCell() {
		if (this.props.isEditable) {
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
	}

	onPress() {
		this.props.onPress();

		if (this.swipe != null) {
			this.swipe.recenter()
		}
	}

	onLongPress() {
		if (this.props.isEditable) {
			const separatorWith = 0;
			const shadowStyle = {
				elevation: Style.EM(0.25),
				marginLeft: this.state.popLeft,
				marginBottom: this.state.popBottom,
				shadowColor: AppConst.COLOR_GRAY,
				shadowOffset: {
					width: Style.EM(-0.5),
					height: Style.EM(-0.75)
				},
				shadowOpacity: 0.75,
				shadowRadius: Style.EM(0.25)
			};

			this.setState({ shadowStyle, separatorWith });
			
			Animated.timing(this.state.popLeft, {
				duration: 150,
				toValue: Style.EM(0.5)
			}).start();

			Animated.timing(this.state.popBottom, {
				duration: 150,
				toValue: Style.EM(0.75)
			}).start();
		}

		this.props.toggleRowActive();
	}

	resetShadowStyle() {
		this.state.popBottom.setValue(0);
		this.state.popLeft.setValue(0);
		this.setState({shadowStyle: null, separatorWith: 1});
	}

	componentDidMount() {
		this.resetShadowEvent = EventRegister.addEventListener('EVT_RESET_SHADOW_STYLE', this.resetShadowStyle);
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.resetShadowEvent);
	}

	render() {
		if (this.state.roaster && this.state.roaster.playerTournamentID) {
			const changeButton = [
				<TouchableHighlight style={[ViewStyle.swipeButton]} onPress={this.onPress}>
					<Text style={[ViewStyle.swipeButtonText]}>Change</Text>
				</TouchableHighlight>
			];

			const row = (
				<Animated.View style={[{backgroundColor: AppConst.COLOR_WHITE, flex: 1}, this.state.shadowStyle]}>
					<TouchableHighlight style={ViewStyle.cellMainView} underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={this.animateCell} onLongPress={this.onLongPress} {...this.props.sortHandlers}>
						<View style={[ViewStyle.cellSubview, {paddingVertical: '3%', borderBottomWidth: this.state.separatorWith}]}>
							<View style={{flex: 1}}>
								<Text style={[ViewStyle.roasterPosition]}>{Number.parseInt(this.props.rowId) + 1}</Text>
							</View>

							<View style={{flex: 2, marginRight: '2%'}}>
								<Image source={{uri: this.state.roaster.player.photoUrl}} resizeMode={'contain'} resizeMethod={'resize'} style={ViewStyle.roasterImage} />
							</View>

							<View style={{flex: 6, flexDirection: 'column', justifyContent: 'center'}}>
								<View style={{flex: 1, justifyContent: 'center'}}>
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

							{this.props.isEditable ?
								<View style={{flex: 1}}>
									<Image source={SortBarsIcon} resizeMode={'contain'} resizeMethod={'resize'} style={ViewStyle.sortImage} />
								</View>
							: null}
						</View>
					</TouchableHighlight>
				</Animated.View>
			);

			if (this.props.isEditable) {
				return (
					<Swipeable rightButtons={changeButton} rightButtonWidth={120} onRef={ref => this.swipe = ref}>
						{row}
					</Swipeable>
				);
			} else {
				return (
					<View>{row}</View>
				);
			}
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
        this.getLeaderboardRow = this.getLeaderboardRow.bind(this);
        this.onRemovePressed = this.onRemovePressed.bind(this);
		this.state = {
			group: this.props.group,
			currentUser: this.props.currentUser,
			item: this.props.item
		}
	}

	getLeaderboardRow(item) {
		let nameFont = item.user ? Style.CENTURY_GOTHIC_BOLD : Style.CENTURY_GOTHIC;
		return (
			<TouchableHighlight style={{flex: 1, paddingHorizontal: '10%'}} underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={() => { if (!item.user) this.props.inviteToJoin(); }}>
				<View style={[ViewStyle.leaderboardRow]}>
					<View style={[ViewStyle.leaderboardRowView]}>
						<Text style={[ViewStyle.leaderboardRowText, {flex: 1}]}>{item.rank > 0 ? item.rank : '-'}</Text>
						<Text style={[ViewStyle.leaderboardRowText, {flex: 6, fontFamily: nameFont}]}>{item.user ? item.user.fullName : 'Invite'}</Text>
						<Text style={[ViewStyle.leaderboardRowPts, {flex: 3}]}>Pts: {item.score ? item.score : '0'}</Text>
					</View>
				</View>
			</TouchableHighlight>
		);
    }
    
    onRemovePressed() {
        if (this.swipe) {
            this.swipe.recenter();
        }

        this.props.onRemove(this.state.item);
    }

	render() {
		if (this.state.item.user && this.state.group.owner == this.state.currentUser._id && this.state.group.owner != this.state.item.user._id) {
			const removeButton = [
				<TouchableHighlight style={[ViewStyle.swipeButton, {backgroundColor: AppConst.COLOR_RED}]} onPress={this.onRemovePressed}>
					<Text style={[ViewStyle.swipeButtonText]}>Remove</Text>
				</TouchableHighlight>
			];

			return (
				<Swipeable onRef={ref => this.swipe = ref} rightButtons={removeButton} rightButtonWidth={120}>
					{this.getLeaderboardRow(this.state.item)}
				</Swipeable>
			);
		} else {
			return this.getLeaderboardRow(this.state.item);
		}
	}
}

export default class Group extends BaseComponent {
	
	static navigationOptions = ({navigation}) => {
		return {
			title: 'GROUP',
			headerRight: (
				<View>
					{navigation.state.params.displayGroupOptions?
						<View style={[MainStyles.inRow, ViewStyle.editButton]}>
							<TouchableOpacity style={ViewStyle.editButton} onPress={navigation.state.params.addTournament}>
								<Icon name="md-add" size={30} color="#fff" />
							</TouchableOpacity>

							<View style={{width: 5}}/>

							<TouchableOpacity style={ViewStyle.editButton} onPress={navigation.state.params.editGroup}>
								<IconFontAwesome name="pencil" size={25} color="#fff" />
							</TouchableOpacity>
						</View>
						:
						null
					}
				</View>
			)
		}
	};
	
	constructor(props) {
		super(props);
        this.getCurrentUserStat = this.getCurrentUserStat.bind(this);
        this.getLeaderboardLength =this.getLeaderboardLength.bind(this);
		this.getDaysObj = this.getDaysObj.bind(this);
		this.showActionSheet = this.showActionSheet.bind(this);
		this.tournamentSelected = this.tournamentSelected.bind(this);
		this.inviteToJoin = this.inviteToJoin.bind(this);
		this.removeUserFromGroup = this.removeUserFromGroup.bind(this);
		this.managePlayers = this.managePlayers.bind(this);
		this.managePlayersCallback = this.managePlayersCallback.bind(this);
		this.shouldShowCheckout = this.shouldShowCheckout.bind(this);
		this.shouldShowSave = this.shouldShowSave.bind(this);
		this.goToCheckout = this.goToCheckout.bind(this);
		this.isBeforeEndDate = this.isBeforeEndDate.bind(this);
		this.isRoundOnCourse = this.isRoundOnCourse.bind(this);
		this.updateRoaster = this.updateRoaster.bind(this);
        this.loadGroupData = this.loadGroupData.bind(this);
        this.refreshGroup = this.refreshGroup.bind(this);
		this.state = {
            isRefreshing: false,
			group: {},
			currentUser: {},
			sheetNames: [],
			tournamentIndex: 0,
			currentUserIndex: 0,
			displayGroupOptions: false
		};
	}

	setGroupData(group) {
		try {
			const sheetNames = group.tournaments.map(cross => cross.tournament.name);
            sheetNames.push('Cancel');
            
            group.tournaments.forEach(tournamentCross => {
                tournamentCross.leaderboard.forEach((cross, i) => {
                    if (cross.roaster.length == 0) {
                        cross.isRoasterEmpty = true;

                        for (let i = -1; i >= -5; i--) {
                            cross.roaster.push({_id: i});
                        }
                    }
                });

                if (group.owner == this.state.currentUser._id) {
                    tournamentCross.leaderboard.push({_id: -1});
                }
            });
            
			group.tournaments[this.state.tournamentIndex].leaderboard.forEach((cross, i) => {
				if (cross.user && cross.user._id == this.state.currentUser._id) {
                    this.setState({currentUserIndex: i});
                    return;
				}
			});
			
			const userRoaster = group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].roaster;
			this.setState({ group, sheetNames, userRoaster });
		} catch(error) {
			handleError(error);
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
    
    getLeaderboardLength() {
        let length;

        if (this.state.group.tournaments) {
            length = this.state.group.tournaments[this.state.tournamentIndex].leaderboard.length;

            if (this.state.group.owner == this.state.currentUser._id) {
                length--;
            }
        }

        return length;
    }

	getDaysObj() {
		if (this.state.group.tournaments) {
			const today = new Date();
			const startDate = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.startDate);
			const endDate = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.endDate);
			
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
			if (IsAndroid) {
				this.actionSheet.show();
			} else {
				ActionSheetIOS.showActionSheetWithOptions({options: this.state.sheetNames, cancelButtonIndex: this.state.sheetNames.length}, this.tournamentSelected);
			}
		}
	}

	tournamentSelected(index) {
		if (index >= 0 && index < this.state.sheetNames.length - 1) {
			this.setState({tournamentIndex: index});
		}
	}

	inviteToJoin() {
		const url = `http://${ClientHost}/#/invitation?group=${this.state.group._id}`;

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
		}).catch(handleError);
	}

	removeUserFromGroup(cross) {
        Alert.alert("Are you sure?", "The user will be permanently removed from the group", [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Remove', style: 'destructive', onPress: async () => {
                global.setLoading(true);
                const response = await BaseModel.post(`group/removeUser`, {groupId: this.state.group._id, userId: cross.user._id}).catch(handleError);
                
                if (response) {
                    let index = -1;
                    this.state.group.tournaments[this.state.tournamentIndex].leaderboard.forEach((leaderboardCross, i) => {
                        if (leaderboardCross.user && leaderboardCross.user._id == cross.user._id) {
                            index = i;
                            return;
                        }
                    });

                    if (index > -1) {
                        let group = Object.assign({}, this.state.group);
                        group.tournaments[this.state.tournamentIndex].leaderboard.splice(index, 1);
                        this.setState({ group });
                    }
                    
                    
                }

                global.setLoading(false);
            }}
        ]);
	}

	managePlayers(row, index) {
		if (this.isBeforeEndDate() && !this.isRoundOnCourse()) {
			this.props.navigation.navigate('PlayerSelection', {
				roaster: this.state.group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].roaster.filter(cross => cross.player != null),
				position: row.player ? index : null,
				group: this.state.group,
				tournamentIndex: this.state.tournamentIndex,
				currentUserIndex: this.state.currentUserIndex,
				onPlayesrsManaged: this.onPlayesrsManaged,
				managePlayersCallback: this.managePlayersCallback
			});
		} else {
			this.dropDownRef.alertWithType('info', 'Opps!', 'You cannot edit your roaster during the round');
		}
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

			if (today.getTime() > startDate.getTime() && today.getTime() < endDate.getTime() && !this.state.group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].isRoasterEmpty) {
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

	shouldShowSave() {
		let hasChanged = false;

		if (this.state.group.tournaments) {
			const today = new Date();
			const startDate = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.startDate);

			if (today.getTime() <= startDate.getTime() && !this.state.group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].isRoasterEmpty) {
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

	isBeforeEndDate() {
		if (this.state.group && this.state.group.tournaments) {
			const today = new Date();
			const endDate = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.endDate);

			if (today.getTime() <= endDate.getTime()) {
				return true;
			}
		}

		return false;
	}

	isRoundOnCourse() {
		if (this.state.group && this.state.group.tournaments) {
			const today = new Date();
			const startDate = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.startDate);
			const endDate = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.endDate);
			const time = (today.getHours() * 60 * 60) + (today.getMinutes() * 60) + today.getSeconds;
			const startTime = (startDate.getHours() * 60 * 60) + (startDate.getMinutes() * 60) + startDate.getSeconds;
			const endTime = (endDate.getHours() * 60 * 60) + (endDate.getMinutes() * 60) + endDate.getSeconds;

			if (today.getTime() >= startDate.getTime() && today.getTime() <= endDate.getTime() && time >= startTime && time <= endTime) {
				return true;
			}
		}

		return false;
	}

	async updateRoaster() {
        global.setLoading(true);
        
        const today = new Date();
		let round = 0;

		for (let i = 0; i < this.state.group.tournaments[this.state.tournamentIndex].tournament.rounds.length; i++) {
			let day = new Date(this.state.group.tournaments[this.state.tournamentIndex].tournament.rounds[i].day);

			if (today.getFullYear() == day.getFullYear() && today.getMonth() == day.getMonth() && today.getDate() == day.getDate()) {
				round = i + 1;
				break;
			}
		}

		const body = {
			originalRoaster: [],
			roaster: this.state.group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].roaster,
			round: round
		};
		const group = await BaseModel.post(`group/updateMyRoaster/${this.state.group._id}/${this.state.group.tournaments[this.state.tournamentIndex].tournament._id}`, body).catch(error => {
			if (error.status === AppConst.VALIDATION_ERROR_CODE) {
				EventRegister.emit(AppConst.EVENTS.realoadGroups);
			}

			handleError(error);
		});

		if (group) {
            const userRoaster = group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].roaster;
			this.setState({ group, userRoaster });
            global.setLoading(false);
            this.dropDownRef.alertWithType('success', 'Success!', 'Roaster was sucessfully updated');
		}
	}

	async loadGroupData() {
		const group = await BaseModel.get("group/findOne/" + this.props.navigation.state.params.groupId).catch(error => {
			if (error.status === AppConst.VALIDATION_ERROR_CODE) {
                EventRegister.emit(AppConst.EVENTS.realoadGroups);
                this.setState({errorMessage: error.message});
			}

			handleError(error);
		});
		
		if (group) {
			this.setGroupData(group);
		} else {
            this.setState({noGroupData: true});
        }
    }
    
    async refreshGroup() {
        this.setState({isRefreshing: true});
        await this.loadGroupData();
        this.setState({isRefreshing: false});
    }

	async componentDidMount() {
		global.setLoading(true);

		const currentUser = await AsyncStorage.getItem(AppConst.USER_PROFILE).catch(handleError);
		this.setState({currentUser: JSON.parse(currentUser)});
		await this.loadGroupData();

		if (this.state.group.owner == this.state.currentUser._id) {
			this.setState({displayGroupOptions: true});
		}
		
		this.props.navigation.setParams({
			editGroup: () => {
				this.props.navigation.navigate('EditGroup', {group: this.state.group});
			},
			addTournament: () => {
				this.props.navigation.navigate('AddTournament', {group: this.state.group});
			},
			displayGroupOptions: this.state.displayGroupOptions
		});

		this.reloadEvent = EventRegister.addEventListener(AppConst.EVENTS.reloadCurrentGroup, this.loadGroupData);

		global.setLoading(false);
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.reloadEvent);
	}

	render() {
		if (this.state.noGroupData) {
			return (
				<View style={ViewStyle.noDataView}>
					<Text style={ViewStyle.noDataMessage}>{this.state.errorMessage}</Text>
				</View>
			);
		}

		return (
			<ScrollView contentContainerStyle={{width: '100%', height: '100%', backgroundColor: AppConst.COLOR_WHITE}} refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.refreshGroup} />}>
				<ActionSheet ref={sheet => this.actionSheet = sheet} title={'Select a tournament'} options={this.state.sheetNames} onPress={this.tournamentSelected} />

				<View style={{flex: 7}}>
					<View style={[ViewStyle.groupInformation]}>
						<Image source={{uri: FileHost + this.state.group.photo}} style={ViewStyle.groupImage} />

						<View style={ViewStyle.groupHeader}>
							<View>
								<Text style={[ViewStyle.groupNameText]}>{this.state.group.name}</Text>
							</View>

							
							<TouchableOpacity underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={() => this.showActionSheet()}>
								<View style={{flexDirection: 'row', alignItems: 'center'}}>
									<Text style={[ViewStyle.tournamentNameText]} numberOfLines={1}>{this.state.group.tournaments && this.state.group.tournaments[this.state.tournamentIndex].tournament.name}</Text>
									<Image style={ViewStyle.caretDown} source={DownCaretIcon} resizeMode={'contain'} resizeMethod={'resize'} />
								</View>
							</TouchableOpacity>
						</View>

						    
                        {this.state.displayGroupOptions ?
                            <View style={{flex: 2}}>
                                <TouchableOpacity style={[MainStyles.button, MainStyles.success, MainStyles.buttonVerticalPadding]} onPress={this.inviteToJoin}>
                                    <Text style={MainStyles.buttonText}>Invite</Text>
                                </TouchableOpacity>
                            </View>
                        :
                            null
                        }
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
							<View><Text style={[ViewStyle.statNumber]}>{this.getCurrentUserStat('rank')}/{this.getLeaderboardLength()}</Text></View>
							<View><Text style={[ViewStyle.statLabel]}>Ranking</Text></View>
						</View>

						<View style={[ViewStyle.statView]}>
							<View><Text style={[ViewStyle.statNumber]}>{this.getDaysObj().days}</Text></View>
							<View><Text style={[ViewStyle.statLabel]}>{this.getDaysObj().label}</Text></View>
						</View>
					</View>
				</View>

				<View style={{flex: 10}}>
					<ScrollableTabView initialPage={0} locked={true} tabBarActiveTextColor={AppConst.COLOR_BLUE} tabBarInactiveTextColor={AppConst.COLOR_BLUE} renderTabBar={() => <GroupTabBar />}>
						<View tabLabel='Leaderboard' style={[ViewStyle.tabViewContainer]}>
							<Text style={[ViewStyle.rankColumnText]}>Rank</Text>
							
							<FlatList data={this.state.group.tournaments && this.state.group.tournaments[this.state.tournamentIndex].leaderboard} keyExtractor={item => "key_" + item._id} renderItem={({item}) => (<LeaderboardRow item={item} group={this.state.group} currentUser={this.state.currentUser} inviteToJoin={this.inviteToJoin} onRemove={this.removeUserFromGroup} />)} />
						</View>

						<View tabLabel='Roaster' style={[ViewStyle.tabViewContainer]}>
							<RoundLabels tournament={this.state.group.tournaments && this.state.group.tournaments[this.state.tournamentIndex].tournament} />

							<SortableList style={{flex: 1}} sortingEnabled={this.isBeforeEndDate() && !this.isRoundOnCourse()} manuallyActivateRows={true}
								data={this.state.group.tournaments ? this.state.group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].roaster : []}
								renderRow={({data, index}) => (
									<RoasterRow roaster={data} rowId={index} isEditable={this.isBeforeEndDate() && !this.isRoundOnCourse()} onPress={() => this.managePlayers(data, index)} />
								)} onChangeOrder={nextOrder => this.nextOrder = nextOrder} onReleaseRow={key => {
									EventRegister.emit('EVT_RESET_SHADOW_STYLE');

									if (this.nextOrder) {
										let roaster = [];
										this.nextOrder.forEach(order => {
											roaster.push(this.state.group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].roaster[order]);
										});

										let group = Object.assign({}, this.state.group);
										group.tournaments[this.state.tournamentIndex].leaderboard[this.state.currentUserIndex].roaster = roaster;
										this.setState({ group });
									}
								}}
							/>
						</View>
					</ScrollableTabView>
				</View>

				{this.shouldShowCheckout() ?
					<View style={[ViewStyle.checkoutButtonView, {flex: 2}]}>
						<TouchableOpacity onPress={this.goToCheckout} style={[MainStyles.button, MainStyles.success]}>
							<Text style={MainStyles.buttonText}>Checkout</Text>
						</TouchableOpacity>
					</View>
				: null}

				{this.shouldShowSave() ?
					<View style={[ViewStyle.checkoutButtonView, {flex: 2}]}>
						<TouchableOpacity onPress={this.updateRoaster} style={[MainStyles.button, MainStyles.success]}>
							<Text style={MainStyles.buttonText}>Save</Text>
						</TouchableOpacity>
					</View>
				: null}

				<DropdownAlert ref={ref => this.dropDownRef = ref} />
			</ScrollView>
		);
	}
}