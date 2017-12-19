// React components:
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Text, View, FlatList, ActivityIndicator, TouchableHighlight, AsyncStorage, TouchableOpacity, Platform, Image } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { List, ListItem, SearchBar } from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import DropdownAlert from 'react-native-dropdownalert';
import Swipeable from 'react-native-swipeable';

// Third party components:
import { FontAwesome, Entypo } from '@expo/vector-icons';

// Shank components:
import BaseModel from '../../../core/BaseModel';
import GolfApiModel from '../../../core/GolfApiModel';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import * as Constants from '../../../core/Constants';
import * as BarMessages from '../../../core/BarMessages';

const DismissKeyboardView = Constants.DismissKeyboardHOC(View);

@connectActionSheet
export default class MainScreen extends Component {

    static propTypes = { navigation: PropTypes.object.isRequired };
    static navigationOptions = ({navigation}) => ({
        title: 'GROUPS',
        showIcon: true,
        headerTintColor: Constants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: Constants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: Constants.PRIMARY_COLOR },
        headerLeft: (
            <TouchableHighlight style={[MainStyles.headerIconButtonContainer]} onPress={() => (navigation.state.params.auth) ? navigation.dispatch({type: 'Group'}) : navigation.dispatch({type: 'Register'})}>
                <Entypo name='plus' style={[MainStyles.headerIconButton]} />
            </TouchableHighlight>
        ),
        headerRight: (
            <TouchableHighlight style={[MainStyles.headerIconButtonContainer]} onPress={() => (navigation.state.params.auth) ? navigation.dispatch({type: 'Settings'}) : navigation.dispatch({type: 'Register'})}>
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
        console.log(':::IT\'S ON MAIN SCREEN:::');
        this._collectGroupData = this._collectGroupData.bind(this);
        this.state = {
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            auth: null,
        };
    }
    componentDidMount() {
        AsyncStorage.getItem(Constants.AUTH_TOKEN).then(authToken => {
            this.props.navigation.setParams({
                auth: authToken,
                nav: this.props.navigation
            });
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
            {
                page: 1,
                seed: this.state.seed + 1,
                refreshing: true
            },
            () => {
                this._myGroupsAsyncRemoteRequest();
            }
        );
    };

    // Async calls:
    _myGroupsAsyncRemoteRequest = async(data) => {
        const {page} = this.state;
        this.setState({refreshing: true});
        await BaseModel.get('myGroups', data).then((group) => {
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
                        this.props.navigation.dispatch({type: 'Splash'})
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
    _collectGroupData = async(tournamentId, groupId, nav) => {
        this.setLoading(true);
        try {
            let data = {};
            GolfApiModel.get(`Leaderboard/${tournamentId}`).then(leaderboard => {
                data.leaderboard = leaderboard
            }).catch(error => {
                console.log('ERROR: ', error);
            });
            BaseModel.post('groupInformation', {_id: groupId}).then(group => {
                data.currentGroup = group;
                this.setLoading(false);
                nav.navigate('SingleGroup', {data: data, currentUser: JSON.parse(this.state.currentUser)})
            }).catch((error) => {
                this.setLoading(false);
            });
        } catch (error) {
            console.log('ERROR: ', error);
        }
    };

    render() {
        let navigation = this.props.navigation;
        let addPhoto = require('../../../../resources/add_edit_photo.png');
        let outUrl = '';
        if(navigation.state.params){
            if(navigation.state.params.url){
                outUrl = navigation.state.params.url
            }
        }
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
                                            onPress={() => this._collectGroupData(item.tournamentId, item._id, navigation)}
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
                <View style={[MainStyles.mainContainer]}>
                    <Spinner visible={this.state.loading} animation='fade' />
                    <TouchableOpacity style={[MainStyles.withoutGroupsButton]} activeOpacity={0.2} onPress={() => navigation.navigate('Register', {url:outUrl})}>
                        <View style={[LocalStyles.noneButtonView]}>
                            <TouchableOpacity onPress={() => (navigation.state.params.auth) ? navigation.dispatch({type: 'Group'}) : navigation.dispatch({type: 'Register'})}>
                                <Text style={[MainStyles.withoutGroups]}>
                                    Tap the {'"+"'} button to create{'\n'}
                                    or join a group
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    <DropdownAlert ref={ref => this.validationMessage = ref} />
                </View>
            );
        }
    }
}
