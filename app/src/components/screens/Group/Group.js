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
    Share
} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'
import Notifier from '../../../core/Notifier';
import BaseModel from '../../../core/BaseModel';
import NoAuthModel from '../../../core/NoAuthModel';
import * as Constants from '../../../core/Constans';
import Spinner from 'react-native-loading-spinner-overlay';
import {ImagePicker} from 'expo';
import {List, ListItem} from "react-native-elements";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const DropDown = require('react-native-dropdown');
const {
    Select,
    Option,
    OptionList,
    updatePosition
} = DropDown;

const isAndroid = Platform.OS == 'android' ? true : false;

export default class Group extends Component {

    state = {
        groupPhoto: null
    };

  setModalVisible(visible) {
  this.setState({modalVisible: visible});
  }

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
            modalVisible: false,
            error: null,
            refreshing: false,
            tournamentData: [],
            assignUsers: [],
            tId: ""
        };
    }
    componentDidMount() {
        //this.makeRemoteRequest();
        this.setLoading(true);
        this.initialRequest('pga', '2018').then((data) => {
         /*   updatePosition(this.refs['SELECT1']);
            updatePosition(this.refs['OPTIONLIST']);*/
            console.log('pgapga 20182018')
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

    _getOptionList() {
        return this.refs['OPTIONLIST'];
    }

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

        let tournamentItems = this.state.tournamentData.map((s, i) => {
            return <Picker.Item key={i} value={s.id} label={s.name}/>
        });
        let tournamentOptions = this.state.tournamentData.map((s, i) => {
            return <Option key={i} value={s.id} label={s.name}>{s.name}</Option>
        });
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
                                              {text: 'Open your gallery', onPress: () => this._pickImage()},
                                              {text: 'Take a picture', onPress: () => this._takePicture()},
                                              [
                                                  {
                                                      text: 'Cancel',
                                                      onPress: () => console.log('cancel Pressed'),
                                                      style: 'cancel'
                                                  },
                                              ],
                                              {cancelable: true}
                                          )
                                      }

                                      }>
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
                        style={[LocalStyles.createTInput, MainStyles.inputTopSeparation]}
                        onChangeText={(name) => this.setState({name})}
                        value={this.state.name}
                        placeholder={'Group name'}
                    />
                    {/*https://github.com/alinz/react-native-dropdown*/}
                    <View style={LocalStyles.tournamentPicker}>
                        <Select
                            width={100}
                            ref="SELECT1"
                            optionListRef={this._getOptionList.bind(this)}
                            defaultValue="Select a tornament ..."
                            onSelect={this._tournamentSelect.bind(this)}>
                            {tournamentOptions}
                        </Select>
                        <TextInput
                            underlineColorAndroid='transparent'
                            style={[LocalStyles.createTInput, MainStyles.inputTopSeparation]}
                            editable={false}
                            value={this.state.selectTournament}
                            placeholder="Choose a tournamnet"
                        />
                        <OptionList ref="OPTIONLIST"/>
                    </View>
                    <TextInput
                        underlineColorAndroid='transparent'
                        placeholder={'Prize'}
                        style={[LocalStyles.richCreateTInput, {paddingBottom: 5}]}
                        onChangeText={(prize) => this.setState({prize: prize})}
                        value={this.state.prize}
                    />
                    <View style={LocalStyles.participantsTxt}>
                        <Text style={MainStyles.greenMedShankFont}>
                            PARTICIPANTS
                        </Text>
                    </View>
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

                    <TouchableWithoutFeedback
                    onPress={() => this.setModalVisible(true)}
                    >
                    <View style={LocalStyles.addNewParticipant}>
                        <Text style={[LocalStyles.centerText, MainStyles.shankGray]}>
                            Add new participant
                        </Text>
                    </View>
                    </TouchableWithoutFeedback>
                    <TouchableHighlight
                        onPress={this._handleNewGroupRegistry}
                        style={[MainStyles.goldenShankButton, {marginBottom: '10%'}]}>
                        <Text style={LocalStyles.buttonText}>Create group</Text>
                    </TouchableHighlight>
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
            tournament: this.state.tId,
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
