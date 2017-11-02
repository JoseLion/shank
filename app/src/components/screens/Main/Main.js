import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    ActivityIndicator,
    TouchableHighlight,
    AsyncStorage,
    TouchableOpacity,
    ActionSheetIOS,
    Platform,
    Picker
} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import {List, ListItem, SearchBar} from "react-native-elements";
import * as Constants from '../../../core/Constans';

import LoginStatusMessage from './LoginStatusMessage';
import AuthButton from './AuthButton';
import BaseModel from '../../../core/BaseModel';
import Notifier from '../../../core/Notifier';
import Spinner from 'react-native-loading-spinner-overlay';
import {Entypo, FontAwesome} from '@expo/vector-icons';
import ModalDropdown from 'react-native-modal-dropdown';

const isAndroid = Platform.OS == 'android' ? true : false;

ACTION_BUTTONS = [
    'Profile',
    'Logout',
    'Cancel',
];

const DEMO_OPTIONS_1 = ['option 1', 'option 2', 'option 3', 'option 4', 'option 5', 'option 6', 'option 7', 'option 8', 'option 9'];

export default class MainScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this._removeStorage = this._removeStorage.bind(this);
        this.collectGroupData = this.collectGroupData.bind(this);
        this.state = {
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            auth: null,
            clicked: false,
            actionSelected: ''
        };
    }

    setLoading(loading) {
        this.setState({loading: loading});
    }

    componentDidMount() {
        AsyncStorage.getItem(Constants.AUTH_TOKEN).then(authToken => {
            this.setState({
                auth: authToken
            })
            if (authToken) {
                this._myGroupsAsyncRemoteRequest().then((group) => {
                    console.log('group')
                    console.log(group)
                });
            }
        });
    }

    static showAndroidPicker = () => {
        return (
            <Picker
                selectedValue={this.state.actionSelected}
                onValueChange={(tValue, itemIndex) => this.setState({actionSelected: tValue})}>
                <Picker.Item color="#rgba(0, 0, 0, .2)" key={0} value={0} label={'Profile'}/>
                <Picker.Item color="#rgba(0, 0, 0, .2)" key={2} value={1} label={'LogOut'}/>
            </Picker>)
    };

    async _removeStorage() {
        try {
            let token = await AsyncStorage.removeItem(Constants.AUTH_TOKEN);
            if (!token) {
                this.props.navigation.dispatch({type: 'Splash'})
            } else {
                this.props.navigation.dispatch({type: 'Main'})
            }
            console.log('Token removed from.');
        } catch (error) {
            console.log('error on  :Token removed from disk.');
        }
    }

    static navigationOptions = ({navigation}) => ({
        title: 'BETTING GROUPS',
        showIcon: true,
        headerTitleStyle: {alignSelf: 'center', color: '#fff'},
        headerStyle: {
            backgroundColor: '#556E3E',
            paddingHorizontal: '3%'
        },
        headerLeft: null,
        headerRight: <Entypo name="user" size={25} color="white"
                             onPress={() => isAndroid ? console.log("asdasds") :
                                 ActionSheetIOS.showActionSheetWithOptions({
                                         options: ACTION_BUTTONS,
                                         cancelButtonIndex: 2,
                                     },
                                     (buttonIndex) => {
                                         if (buttonIndex) {

                                         } else {
                                           /* AsyncStorage.getItem(Constants.USER_PROFILE).then(user => {
                                                this.setLoading(false);
                                                navigation.navigate('Profile', {currentUser: JSON.parse(user)})
                                            });*/
                                         }
                                     })
                             }/>,
        tabBarIcon: ({focused, tintColor}) => {
            return (
                <FontAwesome name="group" size={29} color="white"/>
            )
        },
    });

    async _myGroupsAsyncRemoteRequest(data) {
        const {page, seed} = this.state;
        this.setState({refreshing: true});
        await BaseModel.get('myGroups', data).then((group) => {
            console.log("groupgroupgssroup")
            console.log(group)
            this.setState({
                data: page === 1 ? group.results : [...this.state.data, ...group.results],
                error: group.error || null,
                loading: false,
                refreshing: false
            });
        })
            .catch((error) => {
                this.setLoading(false);
                setTimeout(() => {
                    Notifier.message({title: 'ERROR', message: error});
                }, Constants.TIME_OUT_NOTIFIER);
            });
    }

    handleRefresh = () => {
        this.setState(
            {
                page: 1,
                seed: this.state.seed + 1,
                refreshing: true
            },
            () => {
                this._myGroupsAsyncRemoteRequest().then((res) => {
                    console.log(res)
                });
            }
        );
    };

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "76%",
                    backgroundColor: "#CED0CE",
                    marginBottom: "5%",
                    marginHorizontal: '10%'
                }}
            />
        );
    };

    renderHeader = () => {
        if (!this.state.refreshing) return null;
        return <View
            style={{
                height: 100
            }}
        />;
    };

    renderFooter = () => {
        if (!this.state.loading) return null;

        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE",
                }}
            >
                <ActivityIndicator animating size="large"/>
            </View>
        );
    };

    collectGroupData = async (tour, year, tId, groupId, navigation, cb) => {
        this.setLoading(true);
        let tournamentsSummaryApi = `http://api.sportradar.us/golf-t2/summary/${tour}/${year}/tournaments/${tId}/summary.json?api_key=${Constants.API_KEY_SPORT_RADAR}`;
        let data = {}
        try {
            const response = await fetch(tournamentsSummaryApi)
            const JsonResponse = await response.json()
            data.players = []
            if (JsonResponse.field) {
                data.players = JsonResponse.field
            }
            if (JsonResponse.name) {
                data.tName = JsonResponse.name
                data.tStartingDate = JsonResponse.start_date
                data.tEndDate = JsonResponse.end_date
            }
            const currentGroup = await BaseModel.get(`groups/${groupId}`, cb)
            if (currentGroup) {
                data.currentGroup = currentGroup
            }
            AsyncStorage.getItem(Constants.USER_PROFILE).then(user => {
                this.setLoading(false);
                navigation.navigate('SingleGroup', {data: data, currentUser: JSON.parse(user)})
            });
        } catch (e) {
            console.log('error in initialRequest: SingleGroup.js')
            console.log(e)
        }
    };

    //PORBLEM IN MAIN.JS WHEN MONGO CLEAN OUT AND USER STILL WITH TOKEN LOCAL ERR ON GROUP LISTING
    render() {
        let navigation = this.props.navigation;
        let showPlus = this.state.data.length > 0
        if (this.state.auth) {
            return (
                <View style={LocalStyles.containerMain}>
                    <Spinner visible={this.state.loading}/>
                    <TouchableHighlight style={LocalStyles.buttonStart} underlayColor="gray"
                                        onPress={this._removeStorage}>
                        <Text>LOGOUT</Text>
                    </TouchableHighlight>
                    <View style={{flex: 2, width: '100%', height: '92%'}}>
                        <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                            <FlatList
                                data={this.state.data}
                                renderItem={({item}) => (
                                    <ListItem
                                        roundAvatar
                                        /* avatarStyle={LocalStyles.avatarList}*/
                                        avatar={{uri: item.photo.path}}
                                        avatarStyle={LocalStyles.roundAvatar}
                                        avatarContainerStyle={LocalStyles.containerRoundAvatar}
                                        avatarOverlayContainerStyle={LocalStyles.overlayRoundAvatar}
                                        title={`${item.name}`}
                                        titleStyle={LocalStyles.titleMainList}
                                        titleContainerStyle={{marginVertical: '5%', marginHorizontal: '10%'}}
                                        /*  subtitleNumberOfLines={2}
                                         subtitle={<Text style={LocalStyles.subTitleMainList}>{item.tournament}{"\n"}
                                         Score: - Rank: - </Text>}*/
                                        underlayColor={"#b3b3b3"}
                                        containerStyle={[LocalStyles.containerList, {
                                            borderBottomWidth: 0,
                                            marginHorizontal: '9%'
                                        }]}
                                        onPress={() => this.collectGroupData('pga', '2018', item.tournament, item._id, navigation)}
                                    />
                                )}
                                keyExtractor={item => item._id}
                                ItemSeparatorComponent={this.renderSeparator}
                                ListFooterComponent={this.renderFooter}
                                onRefresh={this.handleRefresh}
                                refreshing={this.state.refreshing}
                                ListHeaderComponent={this.renderHeader}
                                onEndReachedThreshold={1}
                            />
                        </List>
                        <View style={{
                            flex: 3,
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}>
                            <TouchableHighlight
                                style={[{position: 'absolute', bottom: '4%'}, MainStyles.goldenShankAddGroupButton]}
                                underlayColor="gray"
                                onPress={() => navigation.dispatch({type: 'Group'})}>
                                <Text style={{color: 'white'}}>ADD GROUP</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={MainStyles.mainContainer}>
                    <TouchableHighlight style={LocalStyles.buttonStart} underlayColor="gray"
                                        onPress={() => navigation.dispatch({type: 'Register'})}>
                        <Text>+</Text>
                    </TouchableHighlight>
                    <View style={{
                        flex: 2,
                        alignItems: 'center',
                        flexDirection: 'column',
                        justifyContent: 'center',
                    }}>
                        <TouchableOpacity onPress={() => navigation.dispatch({type: 'Login'})}>
                            <Text style={MainStyles.groupsNone}>
                                Tap on the "+" button to create {"\n"} or join a betting group
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text/>
                </View>
            )
        }
    }
}