import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text, View, TouchableOpacity, Image, TextInput, TouchableHighlight, Alert} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local'

import BaseModel from '../../../core/BaseModel';
import Notifier from '../../../core/Notifier';
import Spinner from 'react-native-loading-spinner-overlay';
import {ImagePicker} from 'expo';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';


export default class ProfileScreen extends Component {

    state = {
        userImage: null
    };

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'User Profile',
        headerTintColor: 'white',
        headerTitleStyle: {alignSelf: 'center', color: '#fff'},
        headerStyle: {
            backgroundColor: '#556E3E'
        },
    };

    componentDidMount() {
        this.setState({
            email: this.props.navigation.state.params.currentUser.email,
            name: this.props.navigation.state.params.currentUser.name
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
        }
    }

    render() {
        let navigation = this.props.navigation;
        let {userImage} = this.state;
        let addPhoto = require('../../../../resources/createGroup/ios/Recurso13.png');
        console.log("navigation.state.params.currentUser")
        console.log(navigation.state.params)
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
                        {userImage &&
                        <Image source={{uri: userImage}} style={LocalStyles.groupImage}/>
                        }
                        {!userImage &&
                        <Image style={LocalStyles.groupImage}
                               source={addPhoto}>
                        </Image>
                        }
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
                        onChangeText={(name) => this.setState({name})}
                        value={this.state.name}
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
                        onPress={() => this._handleNewUserRegistry(navigation.state.params.currentUser._id)}
                        style={[MainStyles.goldenShankButton, {marginBottom: '10%'}]}>
                        <Text style={LocalStyles.buttonText}>Update Profile</Text>
                    </TouchableHighlight>
                </View>
            </KeyboardAwareScrollView>
        );
    }

    async _handleNewUserRegistry(userId) {
        if (!this.state.name) {
            Notifier.message({title: 'User Update', message: 'username cant be empty'});
            return;
        }

        if (!this.state.email) {
            Notifier.message({title: 'User Update', message: 'email cant be empty'});
            return;
        }

        if (!this.state.userImage) {
            Notifier.message({title: 'User Update', message: 'Please select a profile photo (tap on the empty image)'});
            return;
        }

        this.setLoading(true);
        // ImagePicker saves the taken photo to disk and returns a local URI to it
        let localUri = this.state.userImage;
        let filename = localUri.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        let data = {
            name: this.state.name,
            photo: {path: localUri, name: filename, type: type},
        };

        BaseModel.update('users/' + userId, data).then((response) => {
            this.setLoading(false);
            this.props.navigation.dispatch({type: 'Main'})
        })
            .catch((error) => {
                this.setLoading(false);
                Notifier.message({title: 'ERROR', message: error});
            });
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