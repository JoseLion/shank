/**
 * Created by MnMistake on 9/24/2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    Image,
    FlatList,
    TouchableOpacity,
    Picker,
    ActivityIndicator
} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'
import Notifier from '../../../core/Notifier';
import BaseModel from '../../../core/BaseModel';
import NoAuthModel from '../../../core/NoAuthModel';
import * as Constants from '../../../core/Constans';
import Spinner from 'react-native-loading-spinner-overlay';
import {ImagePicker} from 'expo';
import {List, ListItem, SearchBar} from "react-native-elements";

export default class Group extends Component {

    state = {
        groupPhoto: null,
    };

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'Create Group',
        headerTintColor: 'white',
        headerTitleStyle: {alignSelf: 'center', color: '#fff'},
        headerStyle: {
            backgroundColor: '#556E3E'
        },
    };

    constructor(props) {
        super(props);
        this._handleNewGroupRegistry = this._handleNewGroupRegistry.bind(this);
        this._pickImage = this._pickImage.bind(this);
        this.getUserList = this.getUserList.bind(this);
        this.state = {
            name: '',
            selectTournament: '',
            prize: '',
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            error: null,
            refreshing: false,
            tournamentData: [],
            assignUsers:[]
        };

    }

    componentDidMount() {
        //this.makeRemoteRequest();
        this.setLoading(true);
        this.initialRequest('pga', '2018').then((data) => {
            console.log(data)
        });
    }

    setLoading(loading) {
        this.setState({loading: loading});
    }

    getUserList = (cb) => {
        try {
            BaseModel.get('users', cb).then((users) => {
                let userGroupUsers = users.map(function(user) {
                    return {
                        userId:user._id,
                        name: user.name,
                        score:0,
                        currentRanking:0,
                        currentDailyMovements:0,
                        dailyMovementsDone:false,
                        playerRanking: [/*{
                            playerId:user.value,
                            TR:user.value,
                            Score:user.value,
                            currentPosition:user.value,
                            playerPhotoUrl:user.value,
                        }*/]
                    };
                });
                this.setState({data: users, assignUsers: userGroupUsers});
            });
        } catch (e) {
            console.log('error in getUserList: Group.js')
            console.log(e)
        }
    };

    handleRefresh = () => {
        this.setState(
            {
                page: 1,
                seed: this.state.seed + 1,
                refreshing: true
            },
            () => {
                this.getUserList();
            }
        );
    };

    handleLoadMore = () => {
        this.setState(
            {
                page: this.state.page + 1
            },
            () => {
                this.getUserList();
            }
        );
    };

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: "86%",
                    backgroundColor: "#CED0CE",
                    marginLeft: "14%"
                }}
            />
        );
    };

    /*renderHeader = () => {
     return <SearchBar placeholder="Type Here..." lightTheme round/>;
     };*/

    renderFooter = () => {
        if (!this.state.loading) return null;

        return (
            <View
                style={{
                    paddingVertical: 20,
                    borderTopWidth: 1,
                    borderColor: "#CED0CE"
                }}
            >
                <ActivityIndicator animating size="large"/>
            </View>
        );
    };

    render() {
        let {groupPhoto} = this.state;
        let navigation = this.props.navigation;
        let addPhoto = require('../../../../resources/createGroup/ios/Recurso13.png');

        let tournamentItems = this.state.tournamentData.map((s, i) => {
            return <Picker.Item key={i} value={s.id} label={s.name}/>
        });

        return (
            <View style={MainStyles.container}>
                <Spinner visible={this.state.loading}/>

                <TouchableOpacity style={LocalStyles.addPhotoLogo} onPress={this._pickImage}>
                    {groupPhoto &&
                    <Image source={{uri: groupPhoto}} style={LocalStyles.groupImage}/>
                    }
                    {!groupPhoto &&
                    <Image
                        source={addPhoto}>
                    </Image>
                    }
                    <Text style={[MainStyles.centerText, MainStyles.greenMedShankFont]}>
                        Add a photo
                    </Text>
                </TouchableOpacity>

                <TextInput
                    underlineColorAndroid='transparent'
                    style={LocalStyles.createTInput}
                    onChangeText={(name) => this.setState({name})}
                    value={this.state.name}
                    placeholder={'Group name'}
                />
                <View style={LocalStyles.tournamentPicker}>
                    <Picker
                        selectedValue={this.state.selectTournament}
                        onValueChange={(tValue, itemIndex) => this.setState({selectTournament: tValue})}>
                        <Picker.Item color="#rgba(0, 0, 0, .2)" value='' label='Select a tournament...'/>
                        {tournamentItems}
                    </Picker>
                </View>
                <TextInput
                    underlineColorAndroid='transparent'
                    placeholder={'Prize'}
                    style={[LocalStyles.createTInput, {paddingBottom: 5}]}
                    onChangeText={(prize) => this.setState({prize: prize})}
                    value={this.state.prize}
                />
                <View style={LocalStyles.participantsTxt}>
                    <Text style={MainStyles.greenMedShankFont}>
                        PARTICIPANTS
                    </Text>
                </View>
                <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0, width: '100%'}}>
                    <FlatList
                        data={this.state.data}
                        renderItem={({item}) => (
                            <ListItem
                                roundAvatar
                                title={`${item.name}`}
                                containerStyle={{borderBottomWidth: 0}}
                            />
                        )}
                        keyExtractor={item => item.name}
                        ItemSeparatorComponent={this.renderSeparator}
                        ListFooterComponent={this.renderFooter}
                        onRefresh={this.handleRefresh}
                        refreshing={this.state.refreshing}
                        onEndReachedThreshold={1}
                    />
                </List>
                <View style={LocalStyles.addNewParticipant}>
                    <Text style={[LocalStyles.centerText, MainStyles.shankGray]}>
                        Add new participant
                    </Text>
                </View>
                <TouchableHighlight
                    onPress={this._handleNewGroupRegistry}
                    style={[MainStyles.goldenShankButton, {marginBottom: '10%'}]}>
                    <Text style={LocalStyles.buttonText}>Create group</Text>
                </TouchableHighlight>
            </View>
        );
    }

    //GET TOURNAMENTS AND FRIENDS

    initialRequest = async (tour, year) => {
        let tournamentsApi = `http://api.sportradar.us/golf-t2/schedule/${tour}/${year}/tournaments/schedule.json?api_key=${Constants.API_KEY_SPORT_RADAR}`;
        try {
            const response = await fetch(tournamentsApi)
            const JsonResponse = await response.json()
            this.setState({tournamentData: JsonResponse.tournaments});
            this.getUserList()
        } catch (e) {
            console.log(e)
        }
        this.setLoading(false);
        // this.setState({tournamentData: response});
    };

    async _handleNewGroupRegistry() {

        if (!this.state.name) {
            Notifier.message({title: 'NEW GROUP', message: 'Please enter a name for the group'});
            return;
        }

        if (!this.state.selectTournament) {
            Notifier.message({title: 'NEW GROUP', message: 'Please select a tournament'});
            return;
        }

        if (!this.state.prize) {
            Notifier.message({title: 'NEW GROUP', message: 'Please enter a prize'});
            return;
        }

        if (!this.state.groupPhoto) {
            Notifier.message({title: 'NEW GROUP', message: 'Please select a group photo (tap on the empty image)'});
            return;
        }

        this.setLoading(true);
        // ImagePicker saves the taken photo to disk and returns a local URI to it
        let localUri = this.state.groupPhoto;
        let filename = localUri.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        let data = {
            name: this.state.name,
            tournament: this.state.selectTournament,
            prize: this.state.prize,
            photo: {path: localUri, name: filename, type: type},
            users: this.state.assignUsers,
        };

        BaseModel.create('createGroup', data).then((response) => {
            this.setLoading(false);
            this.props.navigation.dispatch({type: 'Main'})
        })
            .catch((error) => {
                this.setLoading(false);
                setTimeout(() => {
                    Notifier.message({title: 'ERROR', message: error});
                }, Constants.TIME_OUT_NOTIFIER);
            });
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        console.log(result);
        if (!result.cancelled) {
            this.setState({groupPhoto: result.uri});
        }
    };
}