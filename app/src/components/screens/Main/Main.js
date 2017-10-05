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

let Icon = require('react-native-vector-icons/Ionicons');

import LoginStatusMessage from './LoginStatusMessage';
import AuthButton from './AuthButton';
import BaseModel from '../../../core/BaseModel';
import Notifier from '../../../core/Notifier';

export default class MainScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        this._removeStorage = this._removeStorage.bind(this);
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
        this.setState({loading: true});
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

    render() {
        let navigation = this.props.navigation;
        if (this.state.auth) {
            return (
                <View>
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
                                    containerStyle={{borderBottomWidth: 0, marginHorizontal: '8%'}}
                                />
                            )}
                            keyExtractor={item => item.tournament}
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
                    <Text></Text>
                </View>
            )
        }
    }
}