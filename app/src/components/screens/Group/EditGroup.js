// React components:
import React from 'react';
import { ActionSheetIOS, AsyncStorage, FlatList, Image, Picker, Share, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import ActionSheet from 'react-native-actionsheet'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';
import { ImagePicker } from 'expo';
import { List } from 'react-native-elements';
import Swipeable from 'react-native-swipeable';
import { connectActionSheet } from '@expo/react-native-action-sheet';

// Shank components:
import { BaseComponent, BaseModel, GolfApiModel, MainStyles, Constants, BarMessages, FontAwesome, Entypo, isAndroid } from '../BaseComponent';
import LocalStyles from './styles/local'
import { ClienHost } from '../../../config/variables';

@connectActionSheet
export default class EditGroup extends BaseComponent {

    static navigationOptions = ({navigation}) => ({
        title: 'EDIT GROUP',
        headerTintColor: Constants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: Constants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: Constants.PRIMARY_COLOR },
        headerLeft: (
            <TouchableHighlight onPress={() => navigation.navigate('Group', navigation.state.params)}>
                <Entypo name='chevron-small-left' style={[MainStyles.headerIconButton]} />
            </TouchableHighlight>
        ),
        headerRight: (<View></View>)
    });

    constructor(props) {
        super(props);
        this.onCreateGroupPressed = this.onCreateGroupPressed.bind(this);
        this.optionSelectedPressed = this.optionSelectedPressed.bind(this);
        this.showActionSheet = this.showActionSheet.bind(this);
        this.inviteToJoin = this.inviteToJoin.bind(this);
        this.setTournamentSelection = this.setTournamentSelection.bind(this);
        this.state = {
            currentGroup: {},
            bet: '',
            name: '',
            groupPhoto: null,
            tournaments: [],
            tournamentData: [],
            tName: 'Pick a tournament',
            loading: false,
        };
    }
    componentDidMount() {
        this.setLoading(true);
        this.initialRequest();
        this.props.navigation.setParams({
            actionSheet: this.showActionSheet
        });
        let currentGroup = this.props.navigation.state.params.currentGroup;
        let tournaments = currentGroup.tournaments.filter(function(tournament) {return tournament.status; });
        while(tournaments.length < 3) {
            tournaments.push({tournamentName: this.state.tName, _id: (Math.random() * -1000)});
        }

        this.setState({
            currentGroup: currentGroup,
            name: currentGroup.name,
            bet: currentGroup.bet,
            tournaments: tournaments
        });
    }

    setLoading(loading) { this.setState({loading: loading}); }
    optionSelectedPressed(actionIndex) { this.pictureSelection(actionIndex); }
    showActionSheet() {
        if(isAndroid) {
            this.ActionSheet.show();
        } else {
            this.props.showActionSheetWithOptions(
                {
                    options: [ 'Open your gallery', 'Take a picture', 'Cancel' ],
                    cancelButtonIndex: 2
                },
                buttonIndex => this.optionSelectedPressed(buttonIndex)
            );
        }
    }
    onCreateGroupPressed() {
        if (!this.state.groupPhoto && !this.state.currentGroup.photo) { BarMessages.showError('Please enter a photo for the group.', this.validationMessage); return; }

        if (!this.state.name) { BarMessages.showError('Please enter a name for the group.', this.validationMessage); return; }
        this.state.currentGroup.name = this.state.name;

        if (!this.state.bet) { BarMessages.showError('Please enter a bet.', this.validationMessage); return; }
        this.state.currentGroup.bet = this.state.bet;

        this.setLoading(true);
        let formData = new FormData();
        delete this.state.currentGroup.isOwner;
        delete this.state.currentGroup.myScore;
        delete this.state.currentGroup.myRanking;
        this.state.currentGroup.users = this.state.currentGroup.users.filter(function(user) { return user._id > 0; });
        this.state.currentGroup.tournaments = this.state.currentGroup.tournaments.filter(function(tournament) { return isNaN(tournament._id) || tournament._id > 0; });
        formData.append('groupInformation', JSON.stringify(this.state.currentGroup));

        if (this.state.groupPhoto) {
            let filename = this.state.groupPhoto;
            filename = filename.split('/').pop();
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
            formData.append('groupPhoto', {uri: this.state.groupPhoto, type: type, name: filename});
        }

        this.onCreateGroupPressedAsync(formData);
    }
    inviteToJoin() {
        Share.share({
            message: `Shank Group Invitation: http://${ClienHost}invite/${this.state.currentGroup.groupToken}`,
            title: 'Shank Group Invitation',
            url: `http://${ClienHost}invite/${this.state.currentGroup.groupToken}`
        }, {
            dialogTitle: 'Shank Group Invitation',
            excludedActivityTypes: [
                'com.apple.UIKit.activity.PostToTwitter',
                'com.apple.uikit.activity.mail'
            ],
            tintColor: 'green'
        }).then(this._showResult).catch(err => console.log(err))
    }
    setTournamentSelection(t, tournamentSelected) {
        let currentGroup = this.state.currentGroup;
        currentGroup.tournaments.forEach(function(tournament) {
            if(tournament._id == t._id) {
                tournament = {
                    tournamentName: tournamentSelected.Name,
                    tournamentId: tournamentSelected.TournamentID
                };
                // t = tournament;
                return;
            }
        })
        this.setState({currentGroup: this.state.currentGroup});
    }

    // Async methods:
    initialRequest = async () => {
        this.setLoading(true);
        try {
//             this.setState({tournamentData: [
//     {
//         "TournamentID": 284,
//         "Name": "Ryder Cup",
//         "StartDate": "2018-09-28T00:00:00",
//         "EndDate": "2018-09-30T00:00:00",
//         "IsOver": false,
//         "IsInProgress": false,
//         "Venue": "Le Golf National",
//         "Location": "Saint-Quentin-en-Yvelines, Fra",
//         "Par": null,
//         "Yards": null,
//         "Purse": null,
//         "StartDateTime": null,
//         "Canceled": false,
//         "Covered": true,
//         "City": "Saint-Quentin-en-Yvelines",
//         "State": null,
//         "ZipCode": null,
//         "Country": "FRA",
//         "TimeZone": "America/Chicago",
//         "Format": "Stroke",
//         "Rounds": [
//             {
//                 "RoundID": 1056,
//                 "Number": 1,
//                 "Day": "2018-09-28T00:00:00"
//             },
//             {
//                 "RoundID": 1057,
//                 "Number": 2,
//                 "Day": "2018-09-29T00:00:00"
//             },
//             {
//                 "RoundID": 1058,
//                 "Number": 3,
//                 "Day": "2018-09-30T00:00:00"
//             }
//         ]
//     },
//     {
//         "TournamentID": 238,
//         "Name": "TOUR Championship",
//         "StartDate": "2018-09-20T00:00:00",
//         "EndDate": "2018-09-23T00:00:00",
//         "IsOver": false,
//         "IsInProgress": false,
//         "Venue": "East Lake GC",
//         "Location": "Atlanta, GA",
//         "Par": null,
//         "Yards": null,
//         "Purse": 9000000,
//         "StartDateTime": null,
//         "Canceled": false,
//         "Covered": true,
//         "City": "Atlanta",
//         "State": "GA",
//         "ZipCode": null,
//         "Country": "USA",
//         "TimeZone": "America/New York",
//         "Format": "Stroke",
//         "Rounds": [
//             {
//                 "RoundID": 866,
//                 "Number": 1,
//                 "Day": "2018-09-20T00:00:00"
//             },
//             {
//                 "RoundID": 867,
//                 "Number": 2,
//                 "Day": "2018-09-21T00:00:00"
//             },
//             {
//                 "RoundID": 868,
//                 "Number": 3,
//                 "Day": "2018-09-22T00:00:00"
//             },
//             {
//                 "RoundID": 869,
//                 "Number": 4,
//                 "Day": "2018-09-23T00:00:00"
//             }
//         ]
//     },
//     {
//         "TournamentID": 237,
//         "Name": "BMW Championship",
//         "StartDate": "2018-09-06T00:00:00",
//         "EndDate": "2018-09-09T00:00:00",
//         "IsOver": false,
//         "IsInProgress": false,
//         "Venue": "Aronimink GC",
//         "Location": "Newtown Square, PA",
//         "Par": null,
//         "Yards": null,
//         "Purse": 9000000,
//         "StartDateTime": null,
//         "Canceled": false,
//         "Covered": true,
//         "City": "Newtown Square",
//         "State": "PA",
//         "ZipCode": null,
//         "Country": "USA",
//         "TimeZone": "America/Chicago",
//         "Format": "Stroke",
//         "Rounds": [
//             {
//                 "RoundID": 862,
//                 "Number": 1,
//                 "Day": "2018-09-06T00:00:00"
//             },
//             {
//                 "RoundID": 863,
//                 "Number": 2,
//                 "Day": "2018-09-07T00:00:00"
//             },
//             {
//                 "RoundID": 864,
//                 "Number": 3,
//                 "Day": "2018-09-08T00:00:00"
//             },
//             {
//                 "RoundID": 865,
//                 "Number": 4,
//                 "Day": "2018-09-09T00:00:00"
//             }
//         ]
//     },
//     {
//         "TournamentID": 281,
//         "Name": "Dell Technologies Championship",
//         "StartDate": "2018-08-31T00:00:00",
//         "EndDate": "2018-09-03T00:00:00",
//         "IsOver": false,
//         "IsInProgress": false,
//         "Venue": "TPC Boston",
//         "Location": "Norton, MA",
//         "Par": null,
//         "Yards": null,
//         "Purse": 9000000,
//         "StartDateTime": null,
//         "Canceled": false,
//         "Covered": true,
//         "City": "Norton",
//         "State": "MA",
//         "ZipCode": null,
//         "Country": "USA",
//         "TimeZone": "America/New York",
//         "Format": "Stroke",
//         "Rounds": [
//             {
//                 "RoundID": 1043,
//                 "Number": 1,
//                 "Day": "2018-08-30T00:00:00"
//             },
//             {
//                 "RoundID": 1044,
//                 "Number": 2,
//                 "Day": "2018-08-31T00:00:00"
//             },
//             {
//                 "RoundID": 1045,
//                 "Number": 3,
//                 "Day": "2018-09-01T00:00:00"
//             },
//             {
//                 "RoundID": 1046,
//                 "Number": 4,
//                 "Day": "2018-09-02T00:00:00"
//             },
//             {
//                 "RoundID": 1073,
//                 "Number": 5,
//                 "Day": "2018-09-03T00:00:00"
//             }
//         ]
//     }
// ]});
            GolfApiModel.get('Tournaments').then((tournaments) => {
                this.setState({tournamentData: tournaments});
            }).catch(error => {
                console.log('ERROR! ', error);
            }).finally(() => {
                this.setLoading(false);
            });
        } catch (error) {
            console.log('ERROR! ', error);
            this.setLoading(false);
        }
    };
    onCreateGroupPressedAsync = async(data) => {
        await BaseModel.multipart('groups/edit', data)
            .then((response) => {
                this.setLoading(false);
                super.navigateToScreen('Group', {groupId: response._id, isOwner: true});
            }).catch((error) => {
                this.setLoading(false);
                BarMessages.showError(error, this.validationMessage);
            });
    };
    pictureSelection = async(option) => {
        let settings = {
            allowsEditing: true,
            aspect: [4, 4],
        };
        let result;
        switch (option) {
            case 0: result = await ImagePicker.launchImageLibraryAsync(settings); break;
            case 1: result = await ImagePicker.launchCameraAsync(settings); break;
        }
        if (result != null && !result.cancelled) {
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
                            onPress={this.optionSelectedPressed} />

                        <View style={[LocalStyles.formContainer]}>

                            <TouchableOpacity style={[LocalStyles.addPhotoLogo, MainStyles.inputTopSeparation]} onPress={() => { navigation.state.params.actionSheet(); }}>
                                { this.state.currentGroup.photo != null && !groupPhoto
                                    ? <Image source={{uri: this.state.currentGroup.photo.path}} style={LocalStyles.groupImage} />
                                    : groupPhoto
                                            ? <Image source={{uri: groupPhoto}} style={LocalStyles.groupImage} />
                                            : <Image style={LocalStyles.groupImage} source={addPhoto} />
                                }
                                <Text style={[MainStyles.centerText, MainStyles.placeholderText]}>{ !groupPhoto ? 'Add photo' : 'Change photo' }</Text>
                            </TouchableOpacity>

                            <TextInput
                                returnKeyType={'next'}
                                underlineColorAndroid='transparent'
                                style={[MainStyles.formInput, MainStyles.noMargin]}
                                onChangeText={(name) => this.setState({name})}
                                value={this.state.name}
                                placeholder={'Group name'}
                                maxLength={25} />

                            <TextInput
                                returnKeyType={'next'}
                                underlineColorAndroid='transparent'
                                style={[MainStyles.formInput, MainStyles.noMargin]}
                                onChangeText={(bet) => this.setState({bet})}
                                value={this.state.bet}
                                multiline={true}
                                numberOfLines={3}
                                placeholder={'Bet'}
                                maxLength={50} />

                            <Text style={[MainStyles.centerText, {marginTop: 15}]}>Tournaments</Text>
                            <List containerStyle={[MainStyles.noBorder]}>
                                <FlatList data={this.state.tournaments} renderItem={({item}) => (
                                        <View>
                                            { isAndroid
                                                ?
                                                    <View style={[MainStyles.formPicker, MainStyles.noMargin, MainStyles.noPadding, LocalStyles.pickerHeight]}>
                                                        <Picker style={MainStyles.noMargin} selectedValue={item.selectTournament} onValueChange={(tValue) => this.setTournamentSelection(item, tValue)} enabled={item.tournamentId == null}>
                                                            <Picker.Item style={[MainStyles.formPickerText]} color={Constants.TERTIARY_COLOR_ALT} value='' label={item.tournamentName} />
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
                                                                    this.setState({selectTournament: tournamentKeys[buttonIndex]})
                                                                }
                                                            })
                                                    }}>
                                                        <Text style={[MainStyles.formPickerText, MainStyles.noMargin]} numberOfLines={1}>{this.state.tName}</Text>
                                                    </TouchableOpacity>
                                            }
                                        </View>
                                    )}
                                    keyExtractor={item => item._id} />
                            </List>

                            <Text style={[MainStyles.centerText, {marginTop: 15}]}>Users</Text>
                            <List containerStyle={[MainStyles.noBorder]}>
                                <FlatList data={this.state.currentGroup.users} renderItem={({item}) => (
                                        <Swipeable rightButtons={[
                                            (item._id > 0 && item._id != this.state.currentGroup.owner)
                                            ? ( <TouchableHighlight style={[MainStyles.button, MainStyles.error, LocalStyles.trashButton]}>
                                                    <FontAwesome name='trash-o' style={MainStyles.headerIconButton} />
                                                </TouchableHighlight> )
                                            : ( <View></View> ) ]}
                                            rightButtonWidth={(item._id < 0 || item._id == this.state.currentGroup.owner) ? 0 : 75}>
                                            <TouchableHighlight style={[MainStyles.listItem]} underlayColor={Constants.HIGHLIGHT_COLOR}
                                                onPress={ () => {if(item._id < 0) this.inviteToJoin()} }>
                                                <View style={[MainStyles.viewFlexItemsR]}>
                                                    <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart]}>
                                                        { item.photo != null
                                                            ? <Image style={{height:50,width:50}} source={{uri: item.photo.path}}></Image>
                                                            : <Image style={{height:50,width:50}} source={addPhoto}></Image>
                                                        }
                                                    </View>
                                                    <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart, {flex:4}]}>
                                                        <Text numberOfLines={1} style={[LocalStyles.titleText]}>{item.fullName}</Text>
                                                    </View>
                                                </View>
                                            </TouchableHighlight>
                                        </Swipeable>
                                    )}
                                    keyExtractor={item => item._id}
                                    onEndReachedThreshold={1} />
                            </List>

                            <TouchableOpacity style={[MainStyles.button, MainStyles.success]} onPress={this.onCreateGroupPressed}>
                                <Text style={MainStyles.buttonText}>Edit Group</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <DropdownAlert ref={ref => this.validationMessage = ref} />
            </View>
        );
    }

}
