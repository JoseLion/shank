// React components:
import React from 'react';
import { AsyncStorage, FlatList, Image, Text, TouchableHighlight, TouchableOpacity, View, Linking } from 'react-native';
import { Constants } from 'expo';
import { Avatar, List } from 'react-native-elements';
import Swipeable from 'react-native-swipeable';

// Shank components:
import { BarMessages, BaseComponent, BaseModel, FileHost, AppConst, DropdownAlert, Entypo, FontAwesome, GolfApiModel, MainStyles, Spinner } from '../BaseComponent';
import ViewStyle from './styles/mainScreenStyle';
import qs from 'qs';

import RightCaretIcon from '../../../../resources/right-caret-icon.png';

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
					<Image source={require('../../../../resources/plus-icon.png')} resizeMode={'contain'} style={[ViewStyle.navPlusIcon]}></Image>
				</TouchableOpacity>
			),
			headerRight: (
				<TouchableOpacity style={[ViewStyle.navButton]} onPress={() => goToScreen('Settings')}>
					<Image source={require('../../../../resources/user-icon.png')} resizeMode={'contain'} style={[ViewStyle.navUserIcon]}></Image>
				</TouchableOpacity>
			),
			showIcon: true,
			tabBarLabel: 'Groups',
			tabBarIcon: ({tintColor}) => (<Entypo name='users' style={[MainStyles.tabBarIcon, {color: tintColor}]} />)
		};
	};

	constructor(props) {
		super(props);
		this.getGroups = this.getGroups.bind(this);
		this.getOwnerStat = this.getOwnerStat.bind(this);
		this.getRemoveButton = this.getRemoveButton.bind(this);
		this.removeGroup = this.removeGroup.bind(this);
		this.goToGroup = this.goToGroup.bind(this);
		this.refreshGroups = this.refreshGroups.bind(this);
		this.handleError = this.handleError.bind(this);

		this.handleRefresh = this.handleRefresh.bind(this);
		this.removeGroup = this.removeGroup.bind(this);
		this.onListGroupAsync = this.onListGroupAsync.bind(this);
		this.getGroupList = this.getGroupList.bind(this);
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

	getOwnerStat(group, key) {
		let stat = 0;

		group.tournaments[0].leaderboard.forEach(cross => {
			if (cross.user == group.owner) {
				stat = cross[key];
				return;
			}
		});

		return stat;
	}

	getRemoveButton(group) {
		return [(
			<TouchableHighlight style={{backgroundColor: AppConst.COLOR_RED, height: '100%', justifyContent: 'center'}} underlayColor={AppConst.COLOR_HIGHLIGHT} onPress={() => this.removeGroup(group)}>
				<Text style={{fontFamily: 'century-gothic', fontSize: Style.FONT_17, color: AppConst.COLOR_WHITE, marginHorizontal: '5%'}}>Remove</Text>
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

	handleOpenURL(url) {
		let queryString = url.url.replace(Constants.linkingUri, '');

		if (queryString) {
			let data = qs.parse(queryString);
			
			if (data.group) {
				this.addToGroup(data);
			}
		}
	}

	async addToGroup(data) {
		this.setState({isLoading: true});
		const groups = await BaseModel.get(`group/addUserToGroup/${data.group}`).catch(this.handleError);
		this.setState({isLoading: false, groups: groups});
	}

	async refreshGroups() {
		this.setState({groupsRefreshing: true});
		const groups = await BaseModel.get('group/findMyGroups').catch(error => {
			this.setState({groupsRefreshing: false});
			this.toasterMsg = error
		});
		this.setState({groupsRefreshing: false, groups: groups});
	}

	handleError(error) {
		this.setState({isLoading: false});
		this.toasterMsg = error;
	}

	async componentDidMount() {
		const authToken = await AsyncStorage.getItem(AppConst.AUTH_TOKEN).catch(this.handleError);
		this.setState({auth: authToken});
		this.props.navigation.addListener('didFocus', payload => this.getGroups());

		if (authToken) {
			Linking.addEventListener('url', this.handleOpenURL);
			Linking.getInitialURL().then((url) => {
				if (url) {
					let queryString = url.replace(Constants.linkingUri, '');
					
					if (queryString) {
						let data = qs.parse(queryString);
						
						if (data.group) {
							this.addToGroup(data);
						}
					}
				}
			}).catch(err => console.error('An error occurred', err));
		}
	}

	componentWillUnmount() {
		Linking.removeEventListener('url', e => {});
	}






	async getGroupList() {
		let user = await AsyncStorage.getItem(AppConst.USER_PROFILE);
		this.setState({currentUser: JSON.parse(user)})
		this.onListGroupAsync();
	}

	setLoading(loading) {
		this.setState({isLoading: loading});
	}

	handleRefresh() {
		this.setState({
			page: 1,
			seed: this.state.seed + 1,
			refreshing: true
		}, () => {
			this.onListGroupAsync();
		});
	}

	async onListGroupAsync(data) {
		const { page, currentUser } = this.state;

		this.setState({refreshing: true, loading: true});
		BaseModel.get(`groups/myList/${currentUser._id}`).then(groups => {
			this.setState({
				data: groups,
				loading: false,
				refreshing: false
			});
		}).catch(error => {
			this.setLoading(false);

			if (error === 401) {
				try {
					AsyncStorage.removeItem(AppConst.AUTH_TOKEN);
				} catch (error) {
					console.log('ERROR ON REMOVING TOKEN: ', error);
				}
			} else {
				console.log('ERROR: ', error);
				BarMessages.showError(error, this.toasterMsg);
			}
		});
	}

	async onRemoveGroupAsync(data) {
		let endPoint;
		this.setLoading(true);
		
		if (data.isOwner) {
			endPoint = `groups/changeStatus/${data._id}/false`;
		} else {
			endPoint = `groups/removeUser/${data._id}/${this.state.currentUser._id}`;
		}

		BaseModel.delete(endPoint).then(() => {
			this.setLoading(false);
			this.handleRefresh();
		}).catch(error => {
			this.setLoading(false);
			console.log('ERROR! ', error);
			BarMessages.showError(error, this.toasterMsg);
		});
	}

	render() {
		if (this.state.groups.length > 0) {
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
													<Text style={ViewStyle.groupStatsValue}>{this.getOwnerStat(item, 'score')}</Text>
												</View>

												<View style={ViewStyle.groupStatsSubView}>
													<Text style={ViewStyle.groupStatsLabel}>Rank:</Text>
													<Text style={ViewStyle.groupStatsValue}>{this.getOwnerStat(item, 'rank')}/{item.tournaments[0].leaderboard.length}</Text>
												</View>
											</View>
										</View>

										<Image source={RightCaretIcon} resizeMode={'contain'} style={ViewStyle.caretIcon} />
									</View>
								</View>
							</TouchableHighlight>
						</Swipeable>
					)} refreshing={this.state.groupsRefreshing} onRefresh={this.refreshGroups} />

					<DropdownAlert ref={ref => this.toasterMsg = ref} />
				</View>
			);
		} else {
			return (
				<View style={ViewStyle.noDataContainer}>
					<Spinner visible={this.state.isLoading} animation='fade' />
					
					<Text style={ViewStyle.noDataText}>Tap the {'"+"'} button to create{'\n'}or join a group</Text>

					<DropdownAlert ref={ref => this.toasterMsg = ref} />
				</View>
			);
		}
	}
}