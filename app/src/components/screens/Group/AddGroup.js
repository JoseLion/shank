// React components:
import React from 'react';
import { Text, View, TextInput, TouchableHighlight, Image, TouchableOpacity, Picker, ActionSheetIOS, Share, AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import ActionSheet from 'react-native-actionsheet'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';
import { ImagePicker } from 'expo';

// Shank components:
import { BaseComponent, BaseModel, GolfApiModel, MainStyles, Constants, BarMessages, FontAwesome, Entypo, isAndroid } from '../BaseComponent';
import LocalStyles from './styles/local'
import { ClienHost } from '../../../config/variables';

export default class AddGroup extends BaseComponent {

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
        this.handlePress = this.handlePress.bind(this);
        this.showActionSheet = this.showActionSheet.bind(this);
        this._collectGroupData = this._collectGroupData.bind(this);

        this.state = {
            name: '',
            selectTournament: '',
            bet: '',
            groupPhoto: null,
            assignUsers: [],

            tournamentData: [],
            tName: 'Select a tournament',
            currentGroupToken: '',

            loading: false,
        };
    }

    showActionSheet() {
        if(isAndroid) {
            this.ActionSheet.show();
        } else {
            this.props.showActionSheetWithOptions(
                {
                    options: [ 'Open your gallery', 'Take a picture', 'Cancel' ],
                    cancelButtonIndex: 2
                },
                buttonIndex => this.handlePress(buttonIndex)
            );
        }
    }

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
        this.setLoading(true);
        try {
            GolfApiModel.get('Tournaments').then(tournaments => {
                this.setState({tournamentData: tournaments});
                this.setLoading(false);
            }).catch(error => {
                console.log('ERROR: ', error);
                this.setLoading(false);
            });

            let userInformation = await AsyncStorage.getItem(Constants.USER_PROFILE);
            userInformation = JSON.parse(userInformation);
            let groupUser = [
                {
                    userId: userInformation._id,
                    name: userInformation.name,
                    playerRanking: []
                }
            ];
            this.setState({assignUsers: groupUser});
        } catch (error) {
            console.log('ERROR! ', error);
        }
    };

    _generateGroupToken(length) {
        this.setState({currentGroupToken: Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1)});
    }

    async _handleNewGroupRegistry() {

        console.log('PATH: ', this.state.groupPhoto)

        if (!this.state.name) {
            BarMessages.showError('Please enter a name for the group.', this.validationMessage);
            return;
        }

        if (!this.state.selectTournament) {
            BarMessages.showError('Please select a tournament.', this.validationMessage);
            return;
        }

        if (!this.state.bet) {
            BarMessages.showError('Please enter a bet.', this.validationMessage);
            return;
        }

        this.setLoading(true);
        let data = {
            name: this.state.name,
            bet: this.state.bet,
            tournamentId: this.state.selectTournament.TournamentID,
            tournamentName: this.state.selectTournament.Name,
            users: this.state.assignUsers,
            groupToken: this.state.currentGroupToken,
        };
        console.log(data);
        // if (this.state.groupPhoto) {
        //     let localUri = this.state.groupPhoto;
        //     let filename = localUri.split('/').pop();
        //     let match = /\.(\w+)$/.exec(filename);
        //     let type = match ? `image/${match[1]}` : `image`;
        //     data.photo = {path: localUri, name: filename, type: type};
        // }

        BaseModel.create('/groups/createGroup', data).then((response) => {
            this.setLoading(false);
            this._collectGroupData(response._id);
        }).catch((error) => {
            this.setLoading(false);
            BarMessages.showError(error, this.validationMessage);
        });
    }

    _collectGroupData = async(groupId) => {
        this.setLoading(true);
        try {
            let data = {};
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

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 4],
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

    render() {
        let { groupPhoto } = this.state;
        let navigation = this.props.navigation;
        let addPhoto = require('../../../../resources/add_edit_photo.png');
        let tournamentName = []
        let tournamentKeys = []

        let tournamentItems = this.state.tournamentData.map((s, i) => {
            tournamentName[i] = s.Name
            tournamentKeys[i] = s.TournamentID
            return <Picker.Item style={[MainStyles.formPickerText]} key={i} value={s} label={s.Name} />
        });
        tournamentName.push('Cancel');
        tournamentKeys.push('none');

        return (
            <View style={{flex: 1}}>
                <KeyboardAwareScrollView ref='scroll' enableOnAndroid={true} extraHeight={10} keyboardDismissMode='interactive' style={MainStyles.background}>
                    <View style={[MainStyles.container]} behavior='padding'>
                        <Spinner visible={this.state.loading} animation='slide'/>
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
                                <Text style={[MainStyles.centerText, MainStyles.placeholderText]}>
                                    { !groupPhoto ? 'Add photo' : 'Change photo' }
                                </Text>
                            </TouchableOpacity>

                            <TextInput
                                returnKeyType={'next'}
                                underlineColorAndroid='transparent'
                                style={[MainStyles.formInput, MainStyles.noMargin]}
                                onChangeText={(name) => this.setState({name})}
                                value={this.state.name}
                                placeholder={'Group name'} />

                            { isAndroid
                                ?
                                    <View style={[MainStyles.formPicker, MainStyles.noMargin, MainStyles.noPadding, LocalStyles.pickerHeight]}>
                                        <Picker style={MainStyles.noMargin} selectedValue={this.state.selectTournament} onValueChange={(tValue, itemIndex) => this.setState({selectTournament: tValue})}>
                                            <Picker.Item style={[MainStyles.formPickerText]} color={Constants.TERTIARY_COLOR_ALT} value='' label='Pick a tournament' />
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
                                                        tName: tournamentName[buttonIndex]
                                                    })
                                                }
                                            })
                                    }}>
                                        <Text style={[MainStyles.formPickerText, MainStyles.noMargin]} numberOfLines={1}>{this.state.tName}</Text>
                                    </TouchableOpacity>
                            }

                            <TextInput
                                returnKeyType={'next'}
                                underlineColorAndroid='transparent'
                                style={[MainStyles.formInput, MainStyles.noMargin]}
                                onChangeText={(bet) => this.setState({bet})}
                                value={this.state.bet}
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
