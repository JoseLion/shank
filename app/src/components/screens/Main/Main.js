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
    AsyncStorage
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
            auth: null
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
        });
        this._myGroupsAsyncRemoteRequest().then((group) => {
            console.log('group')
            console.log(group)
        });
    }

    static navigationOptions = ({navigation}) => ({
        title: 'BETTING GROUPS',
        headerTitleStyle: {alignSelf: 'center', color: '#fff'},
        headerStyle: {
            backgroundColor: '#556E3E',

        },
        headerLeft: null,
        /*   headerRight: <Button title='+' onPress={()=> console.log("shit mate")}/>,*/
        showIcon: true,
        tabBarIcon: () => {
            return (
                <Image
                    source={require('../../../../resources/mainMenu/menuTaskBar/ios/Recurso9.png')}
                    style={MainStyles.iconXS}
                />
            )
        },
    });

    async _myGroupsAsyncRemoteRequest(data) {
        const {page, seed} = this.state;
        this.setState({refreshing: true});
        await BaseModel.get('myGroups', data).then((group) => {
            console.log("groupgroupgroup")
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
        return <SearchBar placeholder="Type Here..." lightTheme round/>;
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
                console.log("datadatadatadata")
                console.log(data)
            }
            this.setLoading(false);
            navigation.navigate('SingleGroup', {data:data})
        } catch (e) {
            console.log('error in initialRequest: SingleGroup.js')
            console.log(e)
        }
    };
//PORBLEM IN MAIN.JS WHEN MONGO CLEAN OUT AND USER STILL WITH TOKEN LOCAL ERR ON GROUP LISTING
    render() {
        let navigation = this.props.navigation;
        if (this.state.auth) {
            return (
                <View>
                    <Spinner visible={this.state.loading}/>
                    <TouchableHighlight style={LocalStyles.buttonStart} underlayColor="gray"
                                        onPress={() => navigation.dispatch({type: 'Group'})}>
                        <Text>+</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={LocalStyles.buttonStart} underlayColor="gray"
                                        onPress={this._removeStorage}>
                        <Text>LOGOUT</Text>
                    </TouchableHighlight>
                    <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0}}>
                        <FlatList
                            data={this.state.data}
                            renderItem={({item}) => (
                                <ListItem
                                    roundAvatar
                                    title={`${item.name}`}
                                    subtitle={item.tournament}
                                    avatar={{uri: item.photo.path}}
                                    underlayColor={"#b3b3b3"}
                                    containerStyle={{borderBottomWidth: 0, marginHorizontal: '8%'}}
                                    onPress={() => this.collectGroupData('pga', '2018', item.tournament, item._id, navigation)}
                                />
                            )}
                            keyExtractor={item => item._id}
                            ItemSeparatorComponent={this.renderSeparator}
                            ListHeaderComponent={this.renderHeader}
                            ListFooterComponent={this.renderFooter}
                            onRefresh={this.handleRefresh}
                            refreshing={this.state.refreshing}
                            onEndReachedThreshold={1}
                        />
                    </List>
                </View>
            )
        } else {
            return (
                <View style={MainStyles.mainContainer}>
                    <TouchableHighlight style={LocalStyles.buttonStart} underlayColor="gray"
                                        onPress={() => navigation.dispatch({type: 'Register'})}>
                        <Text>+</Text>
                    </TouchableHighlight>
                    <Text style={MainStyles.groupsNone}>
                        Tap on the "+" button to create {"\n"} or join a betting group
                    </Text>
                    <Text/>
                </View>
            )
        }
    }
}