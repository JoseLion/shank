import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableHighlight,
    AsyncStorage,
    TouchableOpacity,
    Platform
} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import {List, ListItem, SearchBar} from "react-native-elements";
import * as Constants from '../../../core/Constans';

import BaseModel from '../../../core/BaseModel';
import Notifier from '../../../core/Notifier';
import Spinner from 'react-native-loading-spinner-overlay';
import {Entypo, FontAwesome} from '@expo/vector-icons';
import ActionSheet from 'react-native-actionsheet'

const isAndroid = Platform.OS == 'android' ? true : false;

export default class MainScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this._removeStorage = this._removeStorage.bind(this);
        this.collectGroupData = this.collectGroupData.bind(this);

        this.handlePress = this.handlePress.bind(this)
        this.showActionSheet = this.showActionSheet.bind(this)
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

    showActionSheet() {
        this.ActionSheet.show()
    }

    handlePress(actionIndex) {
        if (actionIndex == 0) {
            this.setLoading(true);
            AsyncStorage.getItem(Constants.USER_PROFILE).then(user => {
                this.props.navigation.navigate('Profile', {currentUser: JSON.parse(user)})
                this.setLoading(false);
            });
        }
        if (actionIndex == 1) {
            this._removeStorage().then(() => {
                console.log('LOGOUT')
            })
        }
    }

    setLoading(loading) {
        this.setState({loading: loading});
    }

    componentDidMount() {
        AsyncStorage.getItem(Constants.AUTH_TOKEN).then(authToken => {
            this.props.navigation.setParams({
                actionSheet: this.showActionSheet,
                auth: authToken,
                nav: this.props.navigation
            });
            this.setState({
                auth: authToken
            });
            if (authToken) {
                this._myGroupsAsyncRemoteRequest().then((group) => {
                });
            }
        });
    }

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
            backgroundColor: '#556E3E'
        },
        headerLeft: null,
        headerRight: (
            <TouchableOpacity
                activeOpacity={0.2}
                onPress={() => (navigation.state.params.auth) ? navigation.state.params.actionSheet() : navigation.state.params.nav.dispatch({type: 'Register'})}>
                <View style={LocalStyles.touchableUserIcon}>
                    <Entypo name="user" size={25} color="white"
                            onPress={() => (navigation.state.params.auth) ? navigation.state.params.actionSheet() : navigation.state.params.nav.dispatch({type: 'Register'})}/>
                </View>
            </TouchableOpacity>
        ),
        tabBarIcon: ({focused, tintColor}) => {
            return (
                <FontAwesome name="group" size={29} color="white"/>
            )
        },
    });

    async _myGroupsAsyncRemoteRequest(data) {
        const {page} = this.state;
        this.setState({refreshing: true});
        await BaseModel.get('myGroups', data).then((group) => {
            this.setState({
                data: page === 1 ? group.results : [...this.state.data, ...group.results],
                error: group.error || null,
                loading: false,
                refreshing: false
            });
        })
            .catch((error) => {
                this.setLoading(false);
                if (error == 401){
                    try {
                        AsyncStorage.removeItem(Constants.AUTH_TOKEN).then(() =>{
                            this.props.navigation.dispatch({type: 'Splash'})
                        });
                    } catch (error) {
                        console.log('error on  :Token removed from disk.');
                    }
                }else{
                    Notifier.message({title: 'ERROR', message: error});
                }
            })
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
                    console.log("fuck=")
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
                navigation.navigate('SingleGroup', {data: data, currentUser: JSON.parse(user)})
                this.setLoading(false);
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
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        title={'Please select an action to perform'}
                        options={['Profile', 'Logout', 'Cancel']}
                        cancelButtonIndex={2}
                        onPress={this.handlePress}
                    />
                    <Spinner visible={this.state.loading} animation="fade"/>
                    <View style={{flex: 2, width: '100%', height: '92%'}}>
                        <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                            <FlatList
                                data={this.state.data}
                                renderItem={({item}) => (
                                    <ListItem
                                        roundAvatar
                                        avatar={{uri: item.photo.path}}
                                        avatarStyle={LocalStyles.roundAvatar}
                                        avatarContainerStyle={LocalStyles.containerRoundAvatar}
                                        avatarOverlayContainerStyle={LocalStyles.overlayRoundAvatar}
                                        title={`${item.name}`}
                                        titleStyle={LocalStyles.titleMainList}
                                        titleContainerStyle={{marginVertical: '5%', marginHorizontal: '10%'}}
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
                    <TouchableOpacity
                        style={{backgroundColor: '#F5FCFF', height: '100%', width: '100%'}}
                        activeOpacity={0.2}
                        onPress={() => navigation.dispatch({type: 'Register'})}>
                        <View style={{
                            flex: 2,
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}>
                            <TouchableOpacity onPress={() => navigation.dispatch({type: 'Register'})}>
                                <Text style={MainStyles.groupsNone}>
                                    Tap here to create or
                                </Text>
                                <Text style={MainStyles.groupsNone}>
                                    join a betting group
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
    }
}