// React components:
import React from 'react';
import { Text, View, TextInput, TouchableHighlight, Image, TouchableOpacity, Picker, ActionSheetIOS, AsyncStorage } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import ActionSheet from 'react-native-actionsheet'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DropdownAlert from 'react-native-dropdownalert';
import { ImagePicker } from 'expo';
import { connectActionSheet } from '@expo/react-native-action-sheet';

// Shank components:
import { BaseComponent, BaseModel, GolfApiModel, MainStyles, ShankConstants, BarMessages, Entypo, isAndroid } from '../BaseComponent';
import ViewStyle from './styles/addGroupStyle'

@connectActionSheet
export default class AddGroup extends BaseComponent {

  static navigationOptions = {title: 'CREATE GROUP'};

  constructor(props) {
    super(props);
    this.onCreateGroupPressed = this.onCreateGroupPressed.bind(this);
    this.optionSelectedPressed = this.optionSelectedPressed.bind(this);
    this.showActionSheet = this.showActionSheet.bind(this);
    this.state = {
      bet: '',
      name: '',
      selectTournament: '',
      groupPhoto: null,
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
  }

  setLoading(loading) {
    this.setState({loading: loading});
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
        buttonIndex => this.optionSelectedPressed(buttonIndex)
      );
    }
  }

  optionSelectedPressed(actionIndex) {
    this.pictureSelection(actionIndex);
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

    if (!this.state.selectTournament) {
      BarMessages.showError('Please select a tournament.', this.validationMessage);
      return;
    }

    if (!this.state.bet) {
      BarMessages.showError('Please enter a bet.', this.validationMessage);
      return;
    }

    this.setLoading(true);
    let formData = new FormData();
    let data = {
      name: this.state.name,
      bet: this.state.bet,
      tournamentId: this.state.selectTournament.tournamentId,
      tournamentName: this.state.selectTournament.tournamentName,
      tournamentStart: this.state.selectTournament.startDate
    };
    formData.append('groupInformation', JSON.stringify(data));
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
  initialRequest = async () => {
    this.setLoading(true);
    BaseModel.post(`tournaments/findTournaments`).then((tournaments) => {
      this.setState({tournamentData: tournaments});
      this.setLoading(false);
    }).catch((error) => {
      console.log('ERROR! ', error);
      this.setLoading(false);
    });
  };

  onCreateGroupPressedAsync = async(data) => {
    await BaseModel.multipart('groups/create', data)
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
    let tournamentName = [];
    let tournamentKeys = [];

    let tournamentItems = this.state.tournamentData.map((s, i) => {
      tournamentName[i] = s.tournamentName
      tournamentKeys[i] = s.tournamentId
      return <Picker.Item style={[MainStyles.formPickerText]} key={i} value={s} label={s.tournamentName} />
    });
    tournamentName.push('Cancel');
    tournamentKeys.push('none');

    return (
      <View style={{flex: 1}}>
        <KeyboardAwareScrollView ref='scroll' enableOnAndroid={true} extraHeight={10} keyboardDismissMode='interactive' style={MainStyles.background}>
          <View style={[MainStyles.container]} behavior='padding'>
            <Spinner visible={this.state.loading} animation='slide'/>
            <ActionSheet ref={o => this.ActionSheet = o} options={[ 'Open your gallery', 'Take a picture', 'Cancel']} cancelButtonIndex={2} onPress={this.optionSelectedPressed} />
            <View style={[ViewStyle.formContainer]}>
              <TouchableOpacity style={[ViewStyle.addPhotoLogo, MainStyles.inputTopSeparation]} onPress={() => { navigation.state.params.actionSheet(); }}>
                { groupPhoto && <Image source={{uri: groupPhoto}} style={ViewStyle.groupImage}/> }
                {!groupPhoto && <Image style={ViewStyle.groupImage} source={addPhoto}></Image> }
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

              { isAndroid
                ?
                  <View style={[MainStyles.formPicker, MainStyles.noMargin, MainStyles.noPadding, ViewStyle.pickerHeight]}>
                    <Picker style={MainStyles.noMargin} selectedValue={this.state.selectTournament} onValueChange={(tValue, itemIndex) => this.setState({selectTournament: tValue})}>
                      <Picker.Item style={[MainStyles.formPickerText]} color={ShankConstants.TERTIARY_COLOR_ALT} value='' label='Pick a tournament' />
                      {tournamentItems}
                    </Picker>
                  </View>
                :
                  <TouchableOpacity style={[MainStyles.formPicker, MainStyles.noMargin]} onPress={() => {
                    ActionSheetIOS.showActionSheetWithOptions({options: tournamentName, cancelButtonIndex: tournamentName.length - 1},
                    (buttonIndex) => {
                      if (tournamentKeys[buttonIndex] != 'none') {
                        this.setState({selectTournament: tournamentKeys[buttonIndex]})
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
                placeholder={'Bet'}
                maxLength={50} />

              <TouchableOpacity style={[MainStyles.button, MainStyles.success]} onPress={this.onCreateGroupPressed}>
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
