/**
 * Created by MnMistake on 9/24/2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
    Modal,
    Text,
    View,
    TextInput,
    TouchableHighlight,
    TouchableWithoutFeedback,
    Image,
    FlatList,
    TouchableOpacity,
    Picker,
    ActivityIndicator,
    Alert,
    Platform,
<<<<<<< HEAD
    Share
=======
    PickerIOS,
    ActionSheetIOS,
    Share,
    TouchableWithoutFeedback,
    AsyncStorage
>>>>>>> a9a6bd7714ba94230066e6eaf3bdd0726b6d6011
} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'
import Notifier from '../../../core/Notifier';
import BaseModel from '../../../core/BaseModel';
import NoAuthModel from '../../../core/NoAuthModel';

import {ClienHost} from '../../../config/variables';
import * as Constants from '../../../core/Constans';
import Spinner from 'react-native-loading-spinner-overlay';
import {ImagePicker} from 'expo';
import {List, ListItem} from "react-native-elements";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const isAndroid = Platform.OS == 'android' ? true : false;

export default class Group extends Component {

    state = {
        groupPhoto: null
    };

<<<<<<< HEAD
  setModalVisible(visible) {
  this.setState({modalVisible: visible});
  }
=======
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
>>>>>>> a9a6bd7714ba94230066e6eaf3bdd0726b6d6011

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
        this._shareTextWithTitle = this._shareTextWithTitle.bind(this);
        this.state = {
            name: '',
            selectTournament: '',
            prize: '',
            loading: false,
            data: [],
            page: 1,
            seed: 1,
            modalVisible: false,
            error: null,
            refreshing: false,
            tournamentData: [],
            assignUsers: [],
            modalVisible: false,
            tId: "",
            TName: "Select a tournament",
            currentGroupToken: ""
        };
    }
    componentDidMount() {
        //this.makeRemoteRequest();
        this.setLoading(true);
        this._generateGroupToken(20)
        this.initialRequest('pga', '2018').then((data) => {
            console.log('pgapga 2018SS20ss18sss')
            console.log(data)
        });
    }

    setLoading(loading) {
        this.setState({loading: loading});
    }

    getUserList = (cb) => {
        try {
            BaseModel.get('users', cb).then((users) => {
                let userGroupUsers = users.map(function (user) {
                    return {
                        userId: user._id,
                        name: user.name,
                        score: 0,
                        currentRanking: 0,
                        currentDailyMovements: 0,
                        dailyMovementsDone: false,
                        playerRanking: [/*{
                         playerId: user.value,
                         TR: user.value,
                         Score: user.value,
                         currentPosition: user.value,
                         playerPhotoUrl: user.value,
                         } */
                        ]
                    }
                        ;
                });
                this.setState({data: users});
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


    _tournamentSelect(t) {
        this.setState({
            ...this.state,
            selectTournament: t
        });
    }

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
        let tournamentName = []
        let tournamentKeys = []

        let tournamentItems = this.state.tournamentData.map((s, i) => {
            tournamentName[i] = s.name
            tournamentKeys[i] = s.id
            return <Picker.Item key={i} value={s.id} label={s.name}/>
        });

        tournamentName.push('Cancel');
        tournamentKeys.push('none');
        /*  let tournamentItemsIos = this.state.tournamentData.map((s, i) => {
         return <PickerIOS.Item key={i} value={s.id} label={s.name}/>
         });*/
        return (
            <KeyboardAwareScrollView ref='scroll' enableOnAndroid={true} extraHeight={5}
                                     style={{backgroundColor: '#F5FCFF'}}>
                <View style={[MainStyles.container]} behavior="padding">
                    <Spinner visible={this.state.loading}/>
                    <TouchableOpacity style={[LocalStyles.addPhotoLogo, MainStyles.inputTopSeparation]}
                                      onPress={() => {
                                          Alert.alert(
                                              'RESPONSE',
                                              'Choose how to get your picture',
                                              [
                                                  {text: 'Open your gallery', onPress: () => this._pickImage()},
                                                  {text: 'Take a picture', onPress: () => this._takePicture()},
                                              ],
                                              {cancelable: true}
                                          )
                                      }
                                      }>
                        {groupPhoto &&
                        <Image source={{uri: groupPhoto}} style={LocalStyles.groupImage}/>
                        }
                        {!groupPhoto &&
                        <Image style={LocalStyles.groupImage}
                               source={addPhoto}>
                        </Image>
                        }
                        <Text style={[MainStyles.centerText, MainStyles.greenMedShankFont]}>
                            Add a photo
                        </Text>
                    </TouchableOpacity>

                    <TextInput
                        underlineColorAndroid='transparent'
                        style={[LocalStyles.createTInput, MainStyles.inputTopSeparation]}
                        onChangeText={(name) => this.setState({name})}
                        value={this.state.name}
                        placeholder={'Group name'}
                    />
                    {/*https://github.com/alinz/react-native-dropdown*/}

                    {isAndroid
                        ?
                        <View style={LocalStyles.tournamentPicker}>
                            <Picker
                                selectedValue={this.state.selectTournament}
                                onValueChange={(tValue, itemIndex) => this.setState({selectTournament: tValue})}>
                                <Picker.Item color="#rgba(0, 0, 0, .2)" value='' label='Select a tournament...'/>
                                {tournamentItems}
                            </Picker>
                        </View>
                        :
                        <TouchableOpacity style={[LocalStyles.tournamentPicker]} onPress={() => {
                            ActionSheetIOS.showActionSheetWithOptions({
                                    options: tournamentName,
                                    cancelButtonIndex: tournamentName.length - 1,
                                },
                                (buttonIndex) => {
                                    if (tournamentKeys[buttonIndex] != 'none') {
                                        this.setState({
                                            selectTournament: tournamentKeys[buttonIndex],
                                            TName: tournamentName[buttonIndex]
                                        })
                                    }
                                })
                        }}>
                            <Text style={LocalStyles.innerInput}>
                                {this.state.TName}
                            </Text>
                        </TouchableOpacity>
                    }

                    <TextInput
                        underlineColorAndroid='transparent'
                        placeholder={'Prize'}
                        style={[LocalStyles.richCreateTInput, {paddingBottom: 5}]}
                        onChangeText={(prize) => this.setState({prize: prize})}
                        value={this.state.prize}
                    />
                    <View style={LocalStyles.List}>
                        <List containerStyle={{borderTopWidth: 0, borderBottomWidth: 0,}}>
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
                                onRefresh={this.handleRefresh}
                                refreshing={this.state.refreshing}
                                onEndReachedThreshold={1}
                            />
                        </List>
                    </View>
<<<<<<< HEAD

                    <TouchableWithoutFeedback
                    onPress={() => this.setModalVisible(true)}
                    >
                    <View style={LocalStyles.addNewParticipant}>
                        <Text style={[LocalStyles.centerText, MainStyles.shankGray]}>
                            Add new participant
                        </Text>
                    </View>
=======
                    <TouchableWithoutFeedback
                        onPress={() => this.setModalVisible(true)}
                    >
                        <View style={LocalStyles.addNewParticipant}>
                            <Text style={[LocalStyles.centerText, MainStyles.shankGray]}>
                                Add new participant
                            </Text>
                        </View>
>>>>>>> a9a6bd7714ba94230066e6eaf3bdd0726b6d6011
                    </TouchableWithoutFeedback>
                    <TouchableHighlight
                        onPress={this._handleNewGroupRegistry}
                        style={[MainStyles.goldenShankButton, {marginBottom: '10%'}]}>
                        <Text style={LocalStyles.buttonText}>Create group</Text>
                    </TouchableHighlight>
<<<<<<< HEAD
                           <Modal
                             animationType="slide"
                             transparent={true}
                             visible={this.state.modalVisible}
                             onRequestClose={() => {alert("Modal has been closed.")}}
                             >
                             <View style={{
                                    marginTop: 150,
                                     justifyContent: 'center',
                                     alignItems: 'center'}}>
                               <View style={LocalStyles.modalhead}>
                               <Text style={LocalStyles.buttonText}>INVITE  TO GROUP</Text>
                               </View>
                              <View style={LocalStyles.modalbody}>
                               <TouchableHighlight
                                   onPress={this._shareTextWithTitle}
                                   style={[LocalStyles.goldenShankButton, {marginBottom: '10%'}]}>
                                   <Text style={LocalStyles.buttonText}>SEND INVITE</Text>
                               </TouchableHighlight>
                              </View>
                               <View style={LocalStyles.modalfooter}>
                               <TouchableHighlight onPress={() => {
                                 this.setModalVisible(!this.state.modalVisible)
                               }}>
                                 <Text>Hide Modal</Text>
                                 </TouchableHighlight>
                                 </View>

                            </View>
                           </Modal>
=======
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setModalVisible(!this.state.modalVisible)
                        }}>
                        <TouchableOpacity
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                height:'100%'
                            }}
                            activeOpacity={1}
                            onPressOut={() => {
                                this.setModalVisible(false)
                            }}
                        >
                            <View style={LocalStyles.modalhead}>
                                <Text style={LocalStyles.buttonText}>INVITE TO GROUP</Text>
                            </View>
                            <View style={LocalStyles.modalbody}>
                                <TouchableHighlight
                                    onPress={this._shareTextWithTitle}
                                    style={[LocalStyles.goldenShankButton, {marginBottom: '10%'}]}>
                                    <Text style={LocalStyles.buttonText}>SEND INVITE</Text>
                                </TouchableHighlight>
                            </View>
                            <View style={LocalStyles.modalfooter}>
                                <TouchableHighlight onPress={() => {
                                    this.setModalVisible(!this.state.modalVisible)
                                }}>
                                    <Text style={{fontSize: 6}}>Close</Text>
                                </TouchableHighlight>
                            </View>
                        </TouchableOpacity>
                    </Modal>

>>>>>>> a9a6bd7714ba94230066e6eaf3bdd0726b6d6011
                </View>
            </KeyboardAwareScrollView>
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
            const value = await AsyncStorage.getItem(Constants.USER_PROFILE);
            if (value !== null) {
                let jsonData = JSON.parse(value)
                let groupUser = [{
                    userId: jsonData._id,
                    name: jsonData.name,
                    score: 0,
                    currentRanking: 0,
                    currentDailyMovements: 0,
                    dailyMovementsDone: false,
                    playerRanking: []
                }]
                this.setState({assignUsers: groupUser});
            }
        } catch (e) {
            console.log(e)
        }
        this.setLoading(false);
        // this.setState({tournamentData: response});
    };

    _generateGroupToken(length) {
        this.setState({currentGroupToken: Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1)});
    }

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
            groupToken: this.state.currentGroupToken,
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
        if (!result.cancelled) {
            this.setState({groupPhoto: result.uri});
        }
    };

    _takePicture = async () => {
        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        if (!result.cancelled) {
            this.setState({groupPhoto: result.uri});
        }
    };
<<<<<<< HEAD
    _shareTextWithTitle () {
    Share.share({
      message: 'Invite you : http://codingmiles.com',
      title: 'Invite you',
      url: 'http://codingmiles.com'
    }, {
      dialogTitle: 'This is share dialog title',
      excludedActivityTypes: [
        'com.apple.UIKit.activity.PostToTwitter',
        'com.apple.uikit.activity.mail'
      ],
      tintColor: 'green'
    })
    .then(this._showResult)
    .catch(err => console.log(err))
  }

}
=======

    _shareTextWithTitle() {
        Share.share({
            message: 'Shank Group Invitation : ' + ClienHost + 'invite/friend?tag=' + this.state.currentGroupToken,
            title: 'Shank Group Invitation',
            url: ClienHost + 'invite/friend?tag=' + this.state.currentGroupToken
        }, {
            dialogTitle: 'Shank Group Invitation',
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter',
                'com.apple.uikit.activity.mail'
            ],
            tintColor: 'green'
        })
            .then(this._showResult)
            .catch(err => console.log(err))
    }
}
>>>>>>> a9a6bd7714ba94230066e6eaf3bdd0726b6d6011
