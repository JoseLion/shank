// React components:
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Text, View, FlatList, ActivityIndicator, TouchableHighlight, AsyncStorage, TouchableOpacity, Platform } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { List, ListItem, SearchBar } from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet';
import DropdownAlert from 'react-native-dropdownalert';

// Third party components:
import { FontAwesome } from '@expo/vector-icons';

// Shank components:
import BaseModel from '../../../core/BaseModel';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import * as Constants from '../../../core/Constants';
import * as BarMessages from '../../../core/BarMessages';

const DismissKeyboardView = Constants.DismissKeyboardHOC(View);
export default class MainScreen extends Component {

    static propTypes = { navigation: PropTypes.object.isRequired };
    static navigationOptions = ({navigation}) => ({
        title: 'GROUPS',
        showIcon: true,
        headerTintColor: Constants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: Constants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: Constants.PRIMARY_COLOR },
        headerLeft: (
            <TouchableHighlight onPress={() => navigation.dispatch({type: 'Group'})}>
                <FontAwesome name="plus" style={MainStyles.headerIconButton} />
            </TouchableHighlight>
        ),
        headerRight: (
            <TouchableHighlight onPress={() => (navigation.state.params.auth) ? navigation.state.params.actionSheet() : navigation.state.params.nav.dispatch({type: 'Register'})}>
                <FontAwesome name="user-o" style={MainStyles.headerIconButton} />
            </TouchableHighlight>
        ),
        tabBarIcon: (
            <FontAwesome name="group" style={MainStyles.headerIconButton} />
        )
    });

    constructor(props) {
        super(props);
        console.log(':::IT\'S ON MAIN GROUPS:::');

        this._removeStorage = this._removeStorage.bind(this);
        this.collectGroupData = this.collectGroupData.bind(this);

        this.handlePress = this.handlePress.bind(this);
        this.showActionSheet = this.showActionSheet.bind(this)
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
                actionSheet: this.showActionSheet,
                auth: authToken,
                nav: this.props.navigation
            });
            this.setState({
                auth: authToken
            });
            if (authToken) {
                AsyncStorage.getItem(Constants.USER_PROFILE).then(user => {
                    this.setState({currentUser: user})
                    this._myGroupsAsyncRemoteRequest();
                });
            }
        });
    }

    showActionSheet() {
        this.ActionSheet.show()
    }

    handlePress(actionIndex) {
        switch (actionIndex) {
            case 0:
                this.setLoading(true);
                AsyncStorage.getItem(Constants.USER_PROFILE).then(user => {
                    this.props.navigation.navigate('Profile', {currentUser: JSON.parse(user)})
                    this.setLoading(false);
                });
                break;
            case 4:
                this.setLoading(false);
                this._removeStorage();
                break;

        }
    }

    setLoading(loading) {
        this.setState({loading: loading});
    }



    async _removeStorage() {
        try {
            let token = await AsyncStorage.removeItem(Constants.AUTH_TOKEN);
            this.props.navigation.dispatch({type: 'Main'})
        } catch (error) {
            console.log('error on  :Token removed from disk.');
        }
    }



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
                if (error == 401) {
                    try {
                        AsyncStorage.removeItem(Constants.AUTH_TOKEN).then(() => {
                            this.props.navigation.dispatch({type: 'Splash'})
                        });
                    } catch (error) {
                        console.log('error on  :Token removed from disk.');
                    }
                } else {
                    BarMessages.showError(error, this.validationMessage);
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
                this._myGroupsAsyncRemoteRequest();
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


    async collectGroupData(tour, year, tId, groupId, nav) {
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

            BaseModel.post('groupInformation', {_id: groupId})
                .then(group => {
                    this.setLoading(false);
                    data.currentGroup = group
                    nav.navigate('SingleGroup', {data: data, currentUser: JSON.parse(this.state.currentUser)})
                }).catch((error) => {
                    this.setLoading(false);
                    BarMessages.showError(error, this.validationMessage);
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
        let outUrl = ""
        if(navigation.state.params){
            if(navigation.state.params.url){
                outUrl = navigation.state.params.url
            }
        }
        if (this.state.auth) {
            return (
                <View style={MainStyles.container}>
                    <Spinner visible={this.state.loading} animation="fade"/>
                    <ActionSheet
                        ref={o => this.ActionSheet = o}
                        options={[
                            'Edit Profile',
                            'Privacy Policy',
                            'Terms of Service',
                            'Rules',
                            <Text style={{color: Constants.ERROR_COLOR}}>Log Out</Text>,
                            'Cancel']}
                        cancelButtonIndex={5}
                        onPress={this.handlePress} />
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
                    </View>
                    <DropdownAlert ref={ref => this.validationMessage = ref} />
                </View>

            )
        } else {
            return (
                <View style={MainStyles.mainContainer}>
                    <TouchableOpacity
                        style={{backgroundColor: '#F5FCFF', height: '100%', width: '100%'}}
                        activeOpacity={0.2}
                        onPress={() => navigation.navigate('Register', {url:outUrl})}>
                        <View style={{
                            flex: 2,
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'center',
                        }}>
                            <TouchableOpacity onPress={() =>  navigation.navigate('Register', {url:outUrl})}>
                                <Text style={MainStyles.groupsNone}>
                                    Tap here to create or
                                </Text>
                                <Text style={MainStyles.groupsNone}>
                                    join a betting group
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                    <DropdownAlert ref={ref => this.validationMessage = ref} />
                </View>
            )
        }
    }
}
