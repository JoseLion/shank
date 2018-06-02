// React components:
import React from 'react';
import { AsyncStorage, FlatList, Image, Text, TouchableHighlight, TouchableOpacity, View, Linking, ScrollView, RefreshControl, Alert } from 'react-native';
import Swipeable from 'react-native-swipeable';
import { EventRegister } from 'react-native-event-listeners';

// Shank components:
import { BaseComponent, BaseModel, FileHost, AppConst, DropdownAlert, MainStyles } from '../BaseComponent';
import handleError from 'Core/handleError';
import ViewStyle from './styles/mainScreenStyle';
import qs from 'qs';
import PlusIcon from 'Res/plus-icon.png';
import UserIcon from 'Res/user-icon.png';
import GroupsTabOn from 'Res/groups-tab-on.png';
import GroupsTabOff from 'Res/groups-tab-off.png';
import RightCaretIcon from 'Res/right-caret-icon.png';

export default class MainScreen extends BaseComponent {

	static navigationOptions = ({navigation}) => {
		let goToScreen = async (screen) => {
			navigation.navigate(screen);
		}

		return {
			title: 'GROUPS',
			headerLeft: (
				<TouchableOpacity style={[ViewStyle.navButton]} onPress={() => goToScreen('AddGroup')}>
					<Image style={ViewStyle.navPlusIcon} source={PlusIcon} resizeMode={'contain'} resizeMethod={'resize'} />
				</TouchableOpacity>
			),
			headerRight: (
				<TouchableOpacity style={[ViewStyle.navButton]} onPress={() => goToScreen('Settings')}>
					<Image style={ViewStyle.navUserIcon} source={UserIcon} resizeMode={'contain'} resizeMethod={'resize'} />
				</TouchableOpacity>
			),
			tabBarLabel: 'Groups',
			tabBarIcon: ({tintColor}) => (<Image style={ViewStyle.tabIcon} source={tintColor == AppConst.COLOR_WHITE ? GroupsTabOn : GroupsTabOff} resizeMode={'contain'} resizeMethod={'resize'} />)
		};
	};

	constructor(props) {
		super(props);
		this.currentUser = {};
		this.getGroups = this.getGroups.bind(this);
		this.getGroupUserStat = this.getGroupUserStat.bind(this);
		this.getRemoveButton = this.getRemoveButton.bind(this);
		this.removeGroup = this.removeGroup.bind(this);
		this.goToGroup = this.goToGroup.bind(this);
		this.refreshGroups = this.refreshGroups.bind(this);
		this.handleUrlEvent = this.handleUrlEvent.bind(this);
		this.state = {
			groupsRefreshing: false,
			groups: [],
			auth: null
		};
	}

	async getGroups() {
        return await BaseModel.get('group/findMyGroups').catch(handleError);
	}

	getGroupUserStat(group, key) {
		let stat = 0;

		group.tournaments[0].leaderboard.forEach(cross => {
			if (cross.user == this.currentUser._id) {
				stat = cross[key];
				return;
			}
		});

		return stat;
	}

	getRemoveButton(group) {
		return [(
			<TouchableHighlight style={{backgroundColor: AppConst.COLOR_RED, height: '100%', justifyContent: 'center'}} underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={() => this.removeGroup(group)}>
				<Text style={{fontFamily: Style.CENTURY_GOTHIC, fontSize: Style.FONT_17, color: AppConst.COLOR_WHITE, marginHorizontal: '5%'}}>{group.owner == this.currentUser._id ? 'Remove' : 'Exit Group'}</Text>
			</TouchableHighlight>
		)];
	}

	removeGroup(group) {
        const isOwner = group.owner == this.currentUser._id;
        const message = isOwner ? "You will permanently remove this group. All invited users will leave the group automatically" : "You will permanently leave the group. You cannot re-enter without an invitation";

        if (this.swipe) {
			this.swipe.recenter();
        }
        
        Alert.alert("Are you sure?", message, [
            {text: "Cancel", style: 'cancel'},
            {text: isOwner ? 'Remove' : 'Exit Group', style: 'destructive', onPress: async () => {
                global.setLoading(true);
                const response = await BaseModel.delete(`group/${isOwner ? 'delete' : 'exit'}/${group._id}`).catch(handleError);
                
                if (response) {
                    const index = this.state.groups.indexOf(group);
                    const groups = [...this.state.groups];
                    groups.splice(index, 1);

                    this.setState({ groups });
                }
                
                global.setLoading(false);
            }}
        ]);
	}

	goToGroup(group) {
		this.props.navigation.navigate('Group', {groupId: group._id});

		if (this.swipe) {
			this.swipe.recenter();
		}
	}

	async refreshGroups() {
		this.setState({groupsRefreshing: true});
		const groups = await BaseModel.get('group/findMyGroups').catch(handleError);
		this.setState({groupsRefreshing: false, groups: groups});
	}

	async handleUrlEvent(event) {
		if (event) {
			try {
				const url = event.url != null ? event.url : event;
				const split = url.split('://');
				
				if (split.length > 1) {
					let data = qs.parse(split[split.length - 1]);
							
					if (data.group) {
						const groups = await BaseModel.get(`group/addUserToGroup/${data.group}`).catch(handleError);
						this.setState({ groups });
					}
				}
			} catch (error) {
				handleError(error);
			}
		}
    }

	async componentDidMount() {
		try {
			const auth = await AsyncStorage.getItem(AppConst.AUTH_TOKEN).catch(handleError);

			if (auth) {
				Linking.addEventListener('url', this.handleUrlEvent);
				Linking.getInitialURL().then(this.handleUrlEvent).catch(handleError);
				this.realoadGroupsEvent = EventRegister.addEventListener(AppConst.EVENTS.realoadGroups, async () => {
                    const groups = await this.getGroups();
                    this.setState({ groups });
                });
				
				const currentUserJson = await AsyncStorage.getItem(AppConst.USER_PROFILE).catch(handleError);
                this.currentUser = JSON.parse(currentUserJson);
                
                global.setLoading(true);
                const groups = await this.getGroups();
                this.setState({ groups });
                global.setLoading(false);
			}
		} catch (error) {
			handleError(error);
		}
	}

	componentWillUnmount() {
		Linking.removeEventListener('url', e => {});
		EventRegister.removeEventListener(this.realoadGroupsEvent);
	}

	render() {
		if (this.state.groups && this.state.groups.length > 0) {
			return (
				<View style={ViewStyle.mainContainer}>
					<FlatList data={this.state.groups} keyExtractor={item => item._id} scrollEnabled={!this.state.isSwiping} renderItem={({item}) => (
						<Swipeable rightButtons={this.getRemoveButton(item)} rightButtonWidth={120} onRef={ref => this.swipe = ref} onSwipeStart={() => this.setState({isSwiping: true})} onSwipeRelease={() => this.setState({isSwiping: false})}>
							<TouchableHighlight style={ViewStyle.rowButton} underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={() => this.goToGroup(item)}>
								<View style={ViewStyle.rowContainer}>
									<View style={ViewStyle.rowSubView}>
										<View style={{flex: 2}}>
											<Image source={{uri: FileHost + item.photo}} resizeMode={'contain'} resizeMethod={'resize'} style={ViewStyle.groupImage} />
										</View>

										<View style={ViewStyle.grupInfoView}>
											<Text style={ViewStyle.groupName} numberOfLines={1}>{item.name.toUpperCase()}</Text>
											<Text style={ViewStyle.groupTournament} numberOfLines={1}>{item.tournaments[0].tournament.name}</Text>
											<View style={ViewStyle.groupStatsView}>
												<View style={ViewStyle.groupStatsSubView}>
													<Text style={ViewStyle.groupStatsLabel}>Score:</Text>
													<Text style={ViewStyle.groupStatsValue}>{this.getGroupUserStat(item, 'score')}</Text>
												</View>

												<View style={ViewStyle.groupStatsSubView}>
													<Text style={ViewStyle.groupStatsLabel}>Rank:</Text>
													<Text style={ViewStyle.groupStatsValue}>{this.getGroupUserStat(item, 'rank')}/{item.tournaments[0].leaderboard.length}</Text>
												</View>
											</View>
										</View>

										<Image source={RightCaretIcon} resizeMode={'contain'} style={ViewStyle.caretIcon} />
									</View>
								</View>
							</TouchableHighlight>
						</Swipeable>
					)} refreshing={this.state.groupsRefreshing} onRefresh={this.refreshGroups} />

					<DropdownAlert ref={ref => this.dropDown = ref} />
				</View>
			);
		} else {
			return (
				<ScrollView contentContainerStyle={ViewStyle.noDataContainer} refreshControl={<RefreshControl refreshing={this.state.groupsRefreshing} onRefresh={this.refreshGroups} />}>
					<Text style={ViewStyle.noDataText}>Tap the {'"+"'} button to create{'\n'}or join a group</Text>
					<DropdownAlert ref={ref => this.dropDown = ref} />
				</ScrollView>
			);
		}
	}
}