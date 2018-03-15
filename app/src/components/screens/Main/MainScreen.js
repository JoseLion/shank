// React components:
import React from 'react';
import { AsyncStorage, FlatList, Image, Text, TouchableHighlight, TouchableOpacity, View, Linking } from 'react-native';
import { Constants } from 'expo';
import { Avatar, List } from 'react-native-elements';
import Swipeable from 'react-native-swipeable';

// Shank components:
import { BarMessages, BaseComponent, BaseModel, ShankConstants, DropdownAlert, Entypo, FontAwesome, GolfApiModel, MainStyles, Spinner } from '../BaseComponent';
import ViewStyle from './styles/mainScreenStyle';
import qs from 'qs';

export default class MainScreen extends BaseComponent {

	static navigationOptions = ({navigation}) => {
		let goToScreen = async (screen) => {
			if (await AsyncStorage.getItem(ShankConstants.AUTH_TOKEN)) {
				navigation.dispatch({type: screen});
			} else {
				navigation.dispatch({type: 'Login'});
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
		this.handleRefresh = this.handleRefresh.bind(this);
		this.tapCenterButton = this.tapCenterButton.bind(this);
		this.removeGroup = this.removeGroup.bind(this);
		this.onListGroupAsync = this.onListGroupAsync.bind(this);
		this.getGroupList = this.getGroupList.bind(this);
		this.state = {
			loading: false,
			data: [],
			page: 1,
			seed: 1,
			error: null,
			refreshing: false,
			auth: null
		};
	}

	componentDidMount() {
		this.props.navigation.setParams({tapCenterButton: this.tapCenterButton});

		AsyncStorage.getItem(ShankConstants.AUTH_TOKEN).then(authToken => {
			this.setState({auth: authToken});
			//this.getGroupList();

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
		});
	}

	componentWillUnmount() {tapCenterButton
		Linking.removeEventListener('url', e => {});
	}

	async getGroupList() {
		let user = await AsyncStorage.getItem(ShankConstants.USER_PROFILE);
		this.setState({currentUser: JSON.parse(user)})
		this.onListGroupAsync();
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
		AsyncStorage.getItem(ShankConstants.USER_PROFILE).then(profile => {
			profile = JSON.parse(profile);
			this.setLoading(true);

			BaseModel.put(`groups/addUser/${data.group}/${profile._id}`).then((groups) => {
				this.getGroupList();
			}).catch(error => {
				this.setLoading(false);
				BarMessages.showError(error, this.validationMessage);
			});
		});
	}

	setLoading(loading) {
		this.setState({loading: loading});
	};

	tapCenterButton(onLogin) {
		if (this.state.auth) {
			super.navigateToScreen(onLogin);
		} else {
			super.navigateToScreen('Login');
		}
	}

	removeGroup(item) {
		this.onRemoveGroupAsync(item);
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
					AsyncStorage.removeItem(ShankConstants.AUTH_TOKEN);
				} catch (error) {
					console.log('ERROR ON REMOVING TOKEN: ', error);
				}
			} else {
				console.log('ERROR: ', error);
				BarMessages.showError(error, this.validationMessage);
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
			BarMessages.showError(error, this.validationMessage);
		});
	}

	render() {
		let addPhoto = require('../../../../resources/add_edit_photo.png');

		if (this.state.auth && this.state.data.length > 0) {
			return (
				<View style={[MainStyles.container]}>
					<Spinner visible={this.state.loading} animation='fade'/>
					
					<View style={[MainStyles.viewFlexItems]}>
						<List containerStyle={[MainStyles.noBorder, {height:'100%'}]}>
							<FlatList data={this.state.data} renderItem={({item}) => (
								<Swipeable rightButtons={[(
									<TouchableHighlight style={[MainStyles.button, MainStyles.error, ViewStyle.trashButton]} onPress={() => this.removeGroup(item)}>
										<FontAwesome name='trash-o' style={MainStyles.headerIconButton} />
									</TouchableHighlight>
								)]}>

									<TouchableHighlight style={[MainStyles.listItem]} underlayColor={ShankConstants.HIGHLIGHT_COLOR} onPress={() => super.navigateToScreen('Group', {groupId: item._id, isOwner: item.isOwner})}>
										<View style={[MainStyles.viewFlexItemsR]}>
											<View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart]}>
												{item.photo != null ?
													<Avatar medium rounded source={{uri: item.photo.path}} />
												:
													<Avatar medium rounded source={addPhoto} />
												}
											</View>

											<View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart, {flex:3}]}>
												<Text numberOfLines={1} style={[ViewStyle.titleText]}>{item.name}</Text>
												<Text numberOfLines={1} style={[MainStyles.shankGreen, ViewStyle.subtitleText]}>{item.myTournament}</Text>
												<Text numberOfLines={1} style={[MainStyles.shankGreen, ViewStyle.subtitleText]}>
													{`Score: ${item.myScore}     Rank: ${item.myRanking}/${item.users.length}`}
												</Text>
											</View>

											<View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsEnd]}>
												<FontAwesome name='chevron-right' size={29} color={ShankConstants.TERTIARY_COLOR_ALT}/>
											</View>

										</View>
									</TouchableHighlight>
								</Swipeable>
							)} keyExtractor={item => item._id} onRefresh={this.handleRefresh} refreshing={this.state.refreshing} onEndReachedThreshold={1} />
						</List>
					</View>

					<DropdownAlert ref={ref => this.validationMessage = ref} />
				</View>
			);
		} else {
			return (
				<View style={[MainStyles.mainContainer, ViewStyle.noneButtonView]}>
					<Spinner visible={this.state.loading} animation='fade' />
					
					<TouchableOpacity onPress={() => {this.tapCenterButton('AddGroup')}}>
						<Text style={[MainStyles.withoutGroups]}>Tap the {'"+"'} button to create{'\n'}or join a group</Text>
					</TouchableOpacity>
					<DropdownAlert ref={ref => this.validationMessage = ref} />
				</View>
			);
		}
	}
}