// React components:
import React from 'react';
import { Text, View, TextInput, TouchableHighlight, Image, TouchableOpacity, Picker, ActionSheetIOS, AsyncStorage, FlatList } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import ActionSheet from 'react-native-actionsheet'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';
import { ImagePicker } from 'expo';
import { List } from 'react-native-elements';
import Swipeable from 'react-native-swipeable';


// Shank components:
import { BaseComponent, BaseModel, GolfApiModel, MainStyles, Constants, BarMessages, FontAwesome, Entypo, isAndroid } from '../BaseComponent';
import LocalStyles from './styles/local'

export default class EditGroup extends BaseComponent {

    static navigationOptions = ({navigation}) => ({
        title: 'EDIT GROUP',
        headerTintColor: Constants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: Constants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: Constants.PRIMARY_COLOR },
        headerLeft: (
            <TouchableHighlight onPress={() => navigation.dispatch({type: 'Main'})}>
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
        this.state = {
            currentGroup: {},

            name: '',
            bet: '',
            groupPhoto: null,

            tournaments: [],

            tournamentData: [],
            tName: 'Pick a tournament',
            loading: false,
        };
    }

    componentDidMount() {
        this.setLoading(true);
        this.initialRequest('pga', '2018');
        this.props.navigation.setParams({
            actionSheet: this.showActionSheet
        });
        let currentGroup = this.props.navigation.state.params;
        let tournaments = currentGroup.tournaments;
        while(tournaments.length < 3) {
            tournaments.push({tournamentName: this.state.tName, _id: (Math.random() * -1000)});
        }

        this.setState({
            currentGroup: currentGroup,
            groupPhoto: currentGroup.photo == null ? null : currentGroup.photo.path,
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
        if (!this.state.groupPhoto) {
            BarMessages.showError('Please enter a photo for the group.', this.validationMessage);
            return;
        }

        if (!this.state.name) {
            BarMessages.showError('Please enter a name for the group.', this.validationMessage);
            return;
        }
        this.state.currentGroup.name = this.state.name;

        if (!this.state.bet) {
            BarMessages.showError('Please enter a bet.', this.validationMessage);
            return;
        }
        this.state.currentGroup.bet = this.state.bet;

        this.setLoading(true);
        let formData = new FormData();
        delete this.state.currentGroup.isOwner;
        delete this.state.currentGroup.myScore;
        delete this.state.currentGroup.myRanking;
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

    // Async methods:
    initialRequest = async (tour, year) => {
        this.setLoading(true);
        try {
            // GolfApiModel.get('Tournaments').then((tournaments) => {
            //     this.setState({tournamentData: tournaments});
            //     this.setLoading(false);
            // }).catch(error => {
            //     console.log('ERROR! ', error);
                this.setLoading(false);
            // });
        } catch (error) {
            console.log('ERROR! ', error);
        }
    };
    onCreateGroupPressedAsync = async(data) => {
        await BaseModel.multipart('groups/edit', data)
            .then((response) => {
                this.setLoading(false);
                super.navigateToScreen('Group', response);
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

                            <Text style={[MainStyles.centerText, {marginTop: 5}]}>Tournaments</Text>
                            <List containerStyle={[MainStyles.noBorder]}>
                                <FlatList data={this.state.tournaments} renderItem={({item}) => (
                                        <Swipeable rightButtons={[
                                            (
                                                <TouchableHighlight style={[MainStyles.button, MainStyles.error, LocalStyles.trashButton]}>
                                                    <FontAwesome name='trash-o' style={MainStyles.headerIconButton} />
                                                </TouchableHighlight>
                                            )
                                        ]}>
                                            { isAndroid
                                                ?
                                                    <View style={[MainStyles.formPicker, MainStyles.noMargin, MainStyles.noPadding, LocalStyles.pickerHeight]}>
                                                        <Picker style={MainStyles.noMargin} selectedValue={item.selectTournament} onValueChange={(tValue) => item.selectTournament = tValue}>
                                                            <Picker.Item style={[MainStyles.formPickerText]} color={Constants.TERTIARY_COLOR_ALT} value='' label={this.state.tName} />
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
                                        </Swipeable>
                                    )}
                                    keyExtractor={item => item._id}
                                    onEndReachedThreshold={1} />
                            </List>

                            <Text style={[MainStyles.centerText, {marginTop: 5}]}>Users</Text>
                            <List containerStyle={[MainStyles.noBorder]}>
                                <FlatList data={this.state.currentGroup.users} renderItem={({item}) => (
                                        <Swipeable rightButtons={[
                                            (
                                                <TouchableHighlight style={[MainStyles.button, MainStyles.error, LocalStyles.trashButton]}>
                                                    <FontAwesome name='trash-o' style={MainStyles.headerIconButton} />
                                                </TouchableHighlight>
                                            )
                                        ]}>
                                            <TouchableHighlight style={[MainStyles.listItem]} underlayColor={Constants.HIGHLIGHT_COLOR}
                                                onPress={() => console.log(item)}>
                                                <View style={[MainStyles.viewFlexItemsR]}>
                                                    <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart]}>
                                                        { item.photo != null
                                                            ?
                                                                <Image style={{height:50,width:50}} source={{uri: item.photo.path}}></Image>
                                                            :
                                                                <Image style={{height:50,width:50}} source={addPhoto}></Image>
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


// { isAndroid
//     ?
//         <View style={[MainStyles.formPicker, MainStyles.noMargin, MainStyles.noPadding, LocalStyles.pickerHeight]}>
//             <Picker style={MainStyles.noMargin} selectedValue={this.state.selectTournament} onValueChange={(tValue, itemIndex) => this.setState({selectTournament: tValue})}>
//                 <Picker.Item style={[MainStyles.formPickerText]} color={Constants.TERTIARY_COLOR_ALT} value='' label='Pick a tournament' />
//                 {tournamentItems}
//             </Picker>
//         </View>
//     :
//         <TouchableOpacity style={[MainStyles.formPicker, MainStyles.noMargin]} onPress={() => {
//             ActionSheetIOS.showActionSheetWithOptions({
//                     options: tournamentName,
//                     cancelButtonIndex: tournamentName.length - 1,
//                 },
//                 (buttonIndex) => {
//                     if (tournamentKeys[buttonIndex] != 'none') {
//                         this.setState({selectTournament: tournamentKeys[buttonIndex]})
//                     }
//                 })
//         }}>
//             <Text style={[MainStyles.formPickerText, MainStyles.noMargin]} numberOfLines={1}>{this.state.tName}</Text>
//         </TouchableOpacity>
// }
