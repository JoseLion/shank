// React components:
import React from 'react';
import { Text, View, FlatList, TouchableHighlight, AsyncStorage, TouchableOpacity, Image } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { List, ListItem, SearchBar } from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import DropdownAlert from 'react-native-dropdownalert';
import Swipeable from 'react-native-swipeable';

// Shank components:
import { BaseComponent, BaseModel, GolfApiModel, MainStyles, Constants, BarMessages, FontAwesome, Entypo } from '../BaseComponent';
import LocalStyles from './styles/local';

@connectActionSheet
export default class MainScreen extends BaseComponent {

    static navigationOptions = ({navigation}) => ({
        title: 'GROUPS',
        showIcon: true,
        headerTintColor: Constants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: Constants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: Constants.PRIMARY_COLOR },
        headerLeft: (
            <TouchableHighlight style={[MainStyles.headerIconButtonContainer]} onPress={() => navigation.state.params.tapCenterButton('AddGroup')}>
                <Entypo name='plus' style={[MainStyles.headerIconButton]} />
            </TouchableHighlight>
        ),
        headerRight: (
            <TouchableHighlight style={[MainStyles.headerIconButtonContainer]} onPress={() => navigation.state.params.tapCenterButton('Settings')}>
                <Entypo name='user' style={[MainStyles.headerIconButton]} />
            </TouchableHighlight>
        ),
        tabBarIcon: ({tintColor}) => (
            <Entypo name='users' style={[MainStyles.tabBarIcon, {color: tintColor}]} />
        ),
        tabBarLabel: 'Groups'
    });

    constructor(props) {
        super(props);
        this.handleRefresh = this.handleRefresh.bind(this);
        this.tapCenterButton = this.tapCenterButton.bind(this);
        this._myGroupsAsyncRemoteRequest = this._myGroupsAsyncRemoteRequest.bind(this);
        this._collectGroupData = this._collectGroupData.bind(this);
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
        this.props.navigation.setParams({
            tapCenterButton: this.tapCenterButton
        });
        AsyncStorage.getItem(Constants.AUTH_TOKEN).then(authToken => {
            this.setState({auth: authToken});
            if (authToken) {
                AsyncStorage.getItem(Constants.USER_PROFILE).then(user => {
                    this.setState({currentUser: user})
                    this._myGroupsAsyncRemoteRequest();
                });
            }
        });
    }

    // Methods:
    setLoading(loading) { this.setState({loading: loading}); }
    handleRefresh = () => {
        this.setState(
            { page: 1, seed: this.state.seed + 1, refreshing: true },
            () => { this._myGroupsAsyncRemoteRequest(); }
        );
    };
    tapCenterButton(onLogin) {
        if(this.state.auth) {
            super.navigateDispatchToScreen(onLogin)
        } else {
            super.navigateDispatchToScreen('Login')
        }
    }

    // Async calls:
    _myGroupsAsyncRemoteRequest = async(data) => {
        const {page} = this.state;
        this.setState({refreshing: true, loading: true});
        await BaseModel.get('myGroups').then((group) => {
            this.setState({
                data: page === 1 ? group.results : [...this.state.data, ...group.results],
                error: group.error || null,
                loading: false,
                refreshing: false
            });
        }).catch((error) => {
            this.setLoading(false);
            if (error === 401) {
                try {
                    AsyncStorage.removeItem(Constants.AUTH_TOKEN).then(() => {
                        super.navigateDispatchToScreen('Splash');
                    });
                } catch (error) {
                    console.log('ERROR ON REMOVING TOKEN: ', error);
                }
            } else {
                console.log('ERROR: ', error);
                BarMessages.showError(error, this.validationMessage);
            }
        });
    };
    _collectGroupData = async(groupId) => {
        this.setLoading(true);
        try {
            let data = {};
            // GolfApiModel.get(`Leaderboard/${tournamentId}`).then(leaderboard => {
            //     data.leaderboard = leaderboard
            // }).catch(error => {
            //     console.log('ERROR: ', error);
            // });
            BaseModel.post('groupInformation', {_id: groupId}).then(group => {
                data.currentGroup = group;
                this.setLoading(false);
                super.navigateToScreen('SingleGroup', {data: data, currentUser: JSON.parse(this.state.currentUser)});
            }).catch((error) => {
                this.setLoading(false);
            });
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    render() {
        let addPhoto = require('../../../../resources/add_edit_photo.png');
        if (this.state.auth && this.state.data.length > 0) {
            return (
                <View style={[MainStyles.container]}>
                    <Spinner visible={this.state.loading} animation='fade'/>
                    <View style={{flex: 2, width: '100%', height: '92%'}}>
                        <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                            <FlatList
                                data={this.state.data}
                                renderItem={({item}) => (
                                    <Swipeable rightButtons={[
                                        (
                                            <TouchableHighlight style={[MainStyles.button, MainStyles.error, LocalStyles.trashButton]}>
                                                <FontAwesome name='trash-o' style={MainStyles.headerIconButton} />
                                            </TouchableHighlight>
                                        )
                                    ]}>
                                        <TouchableHighlight
                                            underlayColor='#c3c3c3'
                                            onPress={() => this._collectGroupData(item._id)}
                                            style={{
                                                flex: 1,
                                                padding: 20,
                                                backgroundColor: '#ffffff',
                                                borderBottomWidth: 1.5,
                                                borderColor: Constants.TERTIARY_COLOR_ALT,
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                            }}>
                                            <View style={{
                                                flex: 1,
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                            }}>
                                                <Image style={{height:50,width:50}} source={addPhoto}></Image>
                                                <Text numberOfLines={3} style={[LocalStyles.titleText]}>{item.name}{'\n'}
                                                    <Text style={[MainStyles.shankGreen, LocalStyles.subtitleText]} numberOfLines={1}>{item.tournamentName}</Text>{'\n'}
                                                    <Text style={[MainStyles.shankGreen, LocalStyles.subtitleText]}>{'Score: 0     Rank: 1/5'}</Text>
                                                </Text>
                                                <FontAwesome name='chevron-right' size={29} color={Constants.TERTIARY_COLOR_ALT} />
                                            </View>
                                        </TouchableHighlight>
                                    </Swipeable>
                                )}
                                keyExtractor={item => item._id}
                                onRefresh={this.handleRefresh}
                                refreshing={this.state.refreshing}
                                onEndReachedThreshold={1} />
                        </List>
                    </View>
                    <DropdownAlert ref={ref => this.validationMessage = ref} />
                </View>
            );
        } else {
            return (
                <View style={[MainStyles.mainContainer, LocalStyles.noneButtonView]}>
                    <Spinner visible={this.state.loading} animation='fade' />
                    <TouchableOpacity onPress={() => {this.tapCenterButton('AddGroup')}}>
                        <Text style={[MainStyles.withoutGroups]}>
                            Tap the {'"+"'} button to create{'\n'}
                            or join a group
                        </Text>
                    </TouchableOpacity>
                    <DropdownAlert ref={ref => this.validationMessage = ref} />
                </View>
            );
        }
    }
}
