import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, View, TouchableOpacity, Image, TextInput, TouchableHighlight, Alert} from 'react-native';
import MainStyles from '../../../styles/MainStyles';
import LocalStyles from './styles/local'
import { FontAwesome } from '@expo/vector-icons';
import BaseModel from '../../../core/BaseModel';
import Notifier from '../../../core/Notifier';
import Spinner from 'react-native-loading-spinner-overlay';
import {ImagePicker} from 'expo';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as ShankConstants from '../../../core/ShankConstants';
import * as BarMessages from '../../../core/BarMessages';
import LoadingIndicator from '../../common/LoadingIndicator';
import { Host } from '../../../config/variables';

export default class ProfileScreen extends Component {
  state = {
    userImage: null
  };
  
  static propTypes = { navigation: PropTypes.object.isRequired };
  
  static navigationOptions = ({navigation}) => ({
    title: 'User Profile',
    headerTintColor: ShankConstants.TERTIARY_COLOR,
    headerTitleStyle: {alignSelf: 'center', color: ShankConstants.TERTIARY_COLOR},
    headerStyle: { backgroundColor: ShankConstants.PRIMARY_COLOR },
    headerLeft: (
      <TouchableHighlight onPress={() => navigation.dispatch({type: 'Settings'})}>
        <FontAwesome name='chevron-left' style={MainStyles.headerIconButton} />
      </TouchableHighlight>
    ),
    headerRight: (<View></View>)
  });
  
  constructor(props) {
    super(props);
    this._handleNewUserRegistry = this._handleNewUserRegistry.bind(this);
    this.state = {
      loading: true,
      fullName: '',
      email: '',
      photo: {}
    }
  }
  
  componentDidMount() {
    //this.setLoading(false);
    
    BaseModel.get('users/' + this.props.navigation.state.params.currentUser._id).then((response) => {
      this.setState({
        loading: false,
        _id: response._id,
        fullName: response.fullName,
        email: response.email,
        photo: response.photo
      })
    })
    .catch((error) => {
      this.setLoading(false);
      Notifier.message({title: 'ERROR', message: error});
    });
  }
  
  setLoading(loading) {
    this.setState({loading: loading});
  }
  
  _renderImage = () => {
    
    let {userImage} = this.state;
    
    if (userImage) {
      return <Image source={{uri: userImage}} style={LocalStyles.groupImage} />;
    }

    let addPhoto = require('../../../../resources/add_edit_photo.png');
    
    if (!userImage && !this.state.photo.name) {
      return  <Image source={addPhoto} style={LocalStyles.groupImage} />;
    }
    
    let photo_path = Host + this.state.photo.path;
    return <Image source={{uri: photo_path }} style={LocalStyles.groupImage} />;
  }
  
  render() {
    
    if (this.state.loading) {
      return (
        <LoadingIndicator />
      );
    }
    
    let navigation = this.props.navigation;
    let user_photo = this._renderImage();
    
    return (
      <KeyboardAwareScrollView ref='scroll' enableOnAndroid={true} extraHeight={5}
                               style={{backgroundColor: '#F5FCFF'}}>
        <View style={[MainStyles.container]} behavior="padding">
          <Spinner visible={this.state.loading} animation="slide"/>
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
            
            {user_photo}
            
            <Text style={[MainStyles.centerText, MainStyles.greenMedShankFont]}>
              Add or Update your photo
            </Text>
          </TouchableOpacity>
            
          <Text style={[MainStyles.greenMedShankFont, MainStyles.inputTopSeparation]}>
            Your name:
          </Text>
          
          <TextInput
            underlineColorAndroid='transparent'
            style={[LocalStyles.createTInput]}
            onChangeText={(fullName) => this.setState({fullName})}
            value={this.state.fullName}
          />
          <Text style={[MainStyles.greenMedShankFont]}>
            Your email:
          </Text>
          
          <TextInput
            underlineColorAndroid='transparent'
            editable={false}
            style={[LocalStyles.createTInput]}
            onChangeText={(email) => this.setState({email})}
            value={this.state.email}
          />
          <TouchableHighlight
            onPress={() => this._handleNewUserRegistry(navigation.state.params.currentUser._id).then(() => console.log("some"))}
            style={[MainStyles.button, MainStyles.success, {marginBottom: '10%', width: '80%'}]}>
            <Text style={MainStyles.buttonText}>Update Profile</Text>
          </TouchableHighlight>
        </View>
      </KeyboardAwareScrollView>
    );
  }
  
  async _handleNewUserRegistry(userId) {
    if (!this.state.fullName) {
      Notifier.message({title: 'User Update', message: 'username cant be empty'});
      return;
    }

    if (!this.state.email) {
      Notifier.message({title: 'User Update', message: 'email cant be empty'});
      return;
    }
      
    if (!this.state.userImage && !this.state.photo.name) {
      Notifier.message({title: 'User Update', message: 'Please select a profile photo (tap on the empty image)'});
      return;
    }
    
    this.setLoading(true);
    
    if (this.state.userImage) {
      
      // ImagePicker saves the taken photo to disk and returns a local URI to it
      let localUri = this.state.userImage;
      let filename = localUri.split('/').pop();
  
      // Infer the type of the image
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;
  
      let data = new FormData();
      data.append('file', {uri: localUri, name: filename, type: type});
      let user_data = JSON.stringify({fullName: this.state.fullName});
      data.append('user', user_data);
      
      BaseModel.createPhoto('updateUser', data).then((response) => {
        this.setLoading(false);
        this.props.navigation.dispatch({type: 'Main'})
      })
      .catch((error) => {
        this.setLoading(false);
        Notifier.message({title: 'ERROR', message: error});
      });
    }
    else {
      this.setLoading(false);
      
      BaseModel.update('users/' + this.state._id, {fullName: this.state.fullName}).then((response) => {
        this.setLoading(false);
        this.props.navigation.dispatch({type: 'Main'})
      })
      .catch((error) => {
        this.setLoading(false);
        Notifier.message({title: 'ERROR', message: error});
      });
    }
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    
    if (!result.cancelled) {
      this.setState({userImage: result.uri});
    }
  };
    
  _takePicture = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });
    
    if (!result.cancelled) {
      this.setState({userImage: result.uri});
    }
  };
}
