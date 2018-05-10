// React components:
import React from 'react';
import { AsyncStorage, FlatList, Image, Text, TouchableHighlight, TouchableOpacity, View, Linking } from 'react-native';
import Swipeable from 'react-native-swipeable';

// Shank components:
import { BaseComponent, BaseModel, FileHost, AppConst, DropdownAlert, MainStyles, Spinner } from '../BaseComponent';
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
			if (await AsyncStorage.getItem(AppConst.AUTH_TOKEN)) {
				navigation.navigate(screen);
			} else {
				navigation.navigate('Login');
			}
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
		this.handleError = this.handleError.bind(this);
		this.state = {
			isLoading: false,
			groupsRefreshing: false,
			groups: [],


			data: [],
			page: 1,
			seed: 1,
			error: null,
			refreshing: false,
			auth: null
		};
	}

	async getGroups() {
		this.setState({isLoading: true});
		const groups = await BaseModel.get('group/findMyGroups').catch(this.handleError);
		this.setState({isLoading: false, groups: groups});
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
				<Text style={{fontFamily: Style.CENTURY_GOTHIC, fontSize: Style.FONT_17, color: AppConst.COLOR_WHITE, marginHorizontal: '5%'}}>Remove</Text>
			</TouchableHighlight>
		)];
	}

	async removeGroup(group) {
		if (this.swipe) {
			this.swipe.recenter();
		}

		this.setState({isLoading: true});
		await BaseModel.delete('group/delete/' + group._id).catch(this.handleError);

		let index = this.state.groups.indexOf(group);
		let groups = [...this.state.groups];
		groups.splice(index, 1);

		this.setState({groups: groups, isLoading: false});
	}

	goToGroup(group) {
		this.props.navigation.navigate('Group', {groupId: group._id});

		if (this.swipe) {
			this.swipe.recenter();
		}
	}

	async refreshGroups() {
		this.setState({groupsRefreshing: true});
		const groups = await BaseModel.get('group/findMyGroups').catch(this.handleError);
		this.setState({groupsRefreshing: false, groups: groups});
	}

	async handleUrlEvent(event) {
		if (event) {
			const url = event.url != null ? event.url : event;
			const split = url.split('://');
			console.log("split: ", split);
			
			if (split.length > 1) {
				let data = qs.parse(split[split.length - 1]);
						
				if (data.group) {
					this.setState({isLoading: true});
					const groups = await BaseModel.get(`group/addUserToGroup/${data.group}`).catch(this.handleError);
					this.setState({isLoading: false, groups: groups});
				}
			}
		}
	}

	handleError(error) {
		this.setState({isLoading: false});
		this.dropDown.alertWithType('error', "Error", error);
	}

	async componentDidMount() {
		const auth = await AsyncStorage.getItem(AppConst.AUTH_TOKEN).catch(this.handleError);
		this.setState({ auth });
		
		this.didFocusListener = this.props.navigation.addListener('didFocus', async payload => {
			if (this.state.auth) {
				this.getGroups();
			} else {
				const auth = await AsyncStorage.getItem(AppConst.AUTH_TOKEN).catch(this.handleError);
				this.setState({ auth });

				if (this.state.auth) {
					this.getGroups();
				} else {
					this.props.navigation.navigate('Login');
				}
			}
		});

		if (this.state.auth) {
			const currentUserJson = await AsyncStorage.getItem(AppConst.USER_PROFILE).catch(this.handleError);
			this.currentUser = JSON.parse(currentUserJson);

			this.getGroups();
			this.setState({isLoading: false});

			let self = this;

			Linking.addEventListener('url', this.handleUrlEvent);
			Linking.getInitialURL().then(this.handleUrlEvent).catch(err => console.log('An error occurred', err));
		} else {
			this.props.navigation.navigate('Login');
		}
	}

	componentWillUnmount() {
		Linking.removeEventListener('url', e => {});
		this.didFocusListener.remove();
	}

	render() {
		if (this.state.groups && this.state.groups.length > 0) {
			return (
				<View style={ViewStyle.mainContainer}>
					<Spinner visible={this.state.isLoading} animation='fade' />

					<FlatList data={this.state.groups} keyExtractor={item => item._id} renderItem={({item}) => (
						<Swipeable rightButtons={this.getRemoveButton(item)} rightButtonWidth={120} onRef={ref => this.swipe = ref}>
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
				<View style={ViewStyle.noDataContainer}>
					<Spinner visible={this.state.isLoading} animation='fade' />
					
					<Text style={ViewStyle.noDataText}>Tap the {'"+"'} button to create{'\n'}or join a group</Text>

					<DropdownAlert ref={ref => this.dropDown = ref} />
				</View>
			);
		}
	}
}