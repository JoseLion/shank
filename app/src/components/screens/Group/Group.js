// React components:
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Text, View, TextInput, TouchableHighlight, Image, FlatList, TouchableOpacity, Picker, ActivityIndicator, Platform, PickerIOS, ActionSheetIOS, Share, TouchableWithoutFeedback, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { List, ListItem } from 'react-native-elements';
import ActionSheet from 'react-native-actionsheet'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';

// Third party components:
import { FontAwesome, Ionicons, Entypo } from '@expo/vector-icons';
import { ImagePicker } from 'expo';

// Shank components:
import BaseModel from '../../../core/BaseModel';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'
import { ClienHost } from '../../../config/variables';
import * as Constants from '../../../core/Constants';
import * as BarMessages from '../../../core/BarMessages';

const isAndroid = Platform.OS == 'android' ? true : false;
const DismissKeyboardView = Constants.DismissKeyboardHOC(View);
export default class Group extends Component {

    static propTypes = { navigation: PropTypes.object.isRequired };
    static navigationOptions = ({navigation}) => ({
        title: 'CREATE GROUP',
        headerTintColor: Constants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: Constants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: Constants.PRIMARY_COLOR },
        headerLeft: (
            <TouchableHighlight onPress={() => navigation.dispatch({type: 'Main'})}>
                <FontAwesome name='chevron-left' style={MainStyles.headerIconButton} />
            </TouchableHighlight>
        ),
        headerRight: (
            <View></View>
        )
    });

    constructor(props) {
        super(props);
        this._handleNewGroupRegistry = this._handleNewGroupRegistry.bind(this);
        this._pickImage = this._pickImage.bind(this);
        this._shareTextWithTitle = this._shareTextWithTitle.bind(this);
        this._showResult = this._showResult.bind(this);
        this.handlePress = this.handlePress.bind(this);
        this.showActionSheet = this.showActionSheet.bind(this);

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
            assignUsers: [],
            tId: '',
            TName: 'Select a tournament',
            currentGroupToken: '',
            currentInvitationName: '',
            groupPhoto: null
        };
    }

    showActionSheet = function() { this.ActionSheet.show(); }

    componentDidMount() {
        this.setLoading(true);
        this._generateGroupToken(20)
        this.initialRequest('pga', '2018');
        this.props.navigation.setParams({
            actionSheet: this.showActionSheet
        });
    }

    setLoading(loading) { this.setState({loading: loading}); }

    _tournamentSelect(t) {
        this.setState({
            ...this.state,
            selectTournament: t
        });
    }

    handlePress(actionIndex) {
        switch (actionIndex) {
            case 0:
                this._pickImage();
                break;
            case 1:
                this._takePicture()
                break;
        }
    }

    initialRequest = async (tour, year) => {
        let tournamentsApi = `http://api.sportradar.us/golf-t2/schedule/${tour}/${year}/tournaments/schedule.json?api_key=${Constants.API_KEY_SPORT_RADAR}`;
        try {
            const response = await fetch(tournamentsApi)
            const JsonResponse = await response.json()
            this.setState({tournamentData: JsonResponse.tournaments});
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
    };

    _generateGroupToken(length) {
        this.setState({currentGroupToken: Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1)});
    }

    async _handleNewGroupRegistry() {

        console.log('INFORMATION: ', this.state.selectTournament);

        if (!this.state.name) {
            BarMessages.showError('Please enter a name for the group.', this.validationMessage);
            return;
        }

        if (!this.state.selectTournament) {
            BarMessages.showError('Please select a tournament.', this.validationMessage);
            return;
        }

        if (!this.state.prize) {
            BarMessages.showError('Please enter a bet.', this.validationMessage);
            return;
        }

        this.setLoading(true);
        let data = {
            name: this.state.name,
            tournament: this.state.selectTournament,
            prize: this.state.prize,
            users: this.state.assignUsers,
            groupToken: this.state.currentGroupToken,
        };
        if (this.state.groupPhoto) {
            let localUri = this.state.groupPhoto;
            let filename = localUri.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            data.photo = {path: localUri, name: filename, type: type};
        }

        BaseModel.create('createGroup', data).then((response) => {
            this.setLoading(false);
            this.props.navigation.dispatch({type: 'Main'})
        }).catch((error) => {
            this.setLoading(false);
            BarMessages.showError(error, this.validationMessage);
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

    _shareTextWithTitle() {
        Share.share({
            message: 'Shank Group Invitation : ' + 'http://' + ClienHost + 'invite/friend?tag=' + this.state.currentGroupToken + '&linkingUri=' + Constants.LINKING_URI,
            title: 'Shank Group Invitation',
            url: 'http://' +ClienHost + 'invite/friend?tag=' + this.state.currentGroupToken  + '&linkingUri=' + Constants.LINKING_URI
        }, {
            dialogTitle: 'Shank Group Invitation',
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter',
                'com.apple.uikit.activity.mail'
            ],
            tintColor: 'green'
        }).then(this._showResult).catch(err => console.log(err))
    }

    _showResult(result) {
        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                this.setState({result: 'shared with an activityType: ' + result.activityType});
            } else {
                let updatedInvitations = this.state.data.slice();
                updatedInvitations.push({name:this.state.currentInvitationName});
                this.setState({data:updatedInvitations, result: 'shared', currentInvitationName: ''});
            }
        } else if (result.action === Share.dismissedAction) {
            this.setState({result: 'dismissed'});
        }
    }

    render() {
        let { groupPhoto } = this.state;
        let navigation = this.props.navigation;
        let addPhoto = require('../../../../resources/add_edit_photo.png');
        let tournamentName = []
        let tournamentKeys = []

        let tournamentItems = this.state.tournamentData.map((s, i) => {
            tournamentName[i] = s.name
            tournamentKeys[i] = s.id
            return <Picker.Item style={[MainStyles.formPickerText]} key={i} value={s.id} label={s.name} />
        });
        tournamentName.push('Cancel');
        tournamentKeys.push('none');

        return (
            <View style={{flex: 1}}>
                <KeyboardAwareScrollView ref='scroll' enableOnAndroid={true} extraHeight={10} keyboardDismissMode='interactive' style={MainStyles.background}>
                    <View style={[MainStyles.container]} behavior="padding">
                        <Spinner visible={this.state.loading} animation="slide"/>
                        <ActionSheet
                            ref={o => this.ActionSheet = o}
                            options={[
                                'Open your gallery',
                                'Take a picture',
                                'Cancel']}
                            cancelButtonIndex={2}
                            onPress={this.handlePress} />

                        <View style={[LocalStyles.formContainer]}>

                            <TouchableOpacity style={[LocalStyles.addPhotoLogo, MainStyles.inputTopSeparation]} onPress={() => { navigation.state.params.actionSheet(); }}>
                                { groupPhoto && <Image source={{uri: groupPhoto}} style={LocalStyles.groupImage}/> }
                                {!groupPhoto && <Image style={LocalStyles.groupImage} source={addPhoto}></Image> }
                                <Text style={[MainStyles.centerText, MainStyles.greenMedShankFont]}>
                                    { !groupPhoto ? 'Add photo' : 'Change photo' }
                                </Text>
                            </TouchableOpacity>

                            <TextInput
                                returnKeyType={"next"}
                                underlineColorAndroid='transparent'
                                style={[MainStyles.formInput, MainStyles.noMargin]}
                                onChangeText={(name) => this.setState({name})}
                                value={this.state.name}
                                placeholder={'Group name'} />

                            { isAndroid
                                ?
                                    <View style={[MainStyles.formPicker, MainStyles.noMargin, MainStyles.noPadding, LocalStyles.pickerHeight]}>
                                        <Picker style={MainStyles.noMargin} selectedValue={this.state.selectTournament} onValueChange={(tValue, itemIndex) => this.setState({selectTournament: tValue})}>
                                            <Picker.Item style={[MainStyles.formPickerText]} color="#rgba(0, 0, 0, .2)" value='' label='Pick a tournament' />
                                            {tournamentItems}
                                        </Picker>
                                    </View>
                                :
                                    <TouchableOpacity style={[MainStyles.formPicker, MainStyles.noMargin]} onPress={() => {
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
                                        <Text style={[MainStyles.formPickerText, MainStyles.noMargin]} numberOfLines={1}>{this.state.TName}</Text>
                                    </TouchableOpacity>
                            }

                            <TextInput
                                returnKeyType={"next"}
                                underlineColorAndroid='transparent'
                                style={[MainStyles.formInput, MainStyles.noMargin]}
                                onChangeText={(prize) => this.setState({prize})}
                                value={this.state.prize}
                                multiline={true}
                                numberOfLines={3}
                                placeholder={'Bet'} />

                            <TouchableOpacity style={[MainStyles.button, MainStyles.success]} onPress={this._handleNewGroupRegistry}>
                                <Text style={MainStyles.buttonText}>Create a Group</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <DropdownAlert ref={ref => this.validationMessage = ref} />
            </View>
        );
    }

}
