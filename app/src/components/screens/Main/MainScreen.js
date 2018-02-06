// React components:
import React from 'react';
import {
  AsyncStorage,
  FlatList,
  Image,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Linking
} from 'react-native';
import { Constants } from 'expo';
import { Avatar, List } from 'react-native-elements';
import Swipeable from 'react-native-swipeable';

// Shank components:
import { BarMessages, BaseComponent, BaseModel, ShankConstants, DropdownAlert, Entypo, FontAwesome, GolfApiModel, MainStyles, Spinner } from '../BaseComponent';
import LocalStyles from './styles/local';

var qs = require('qs');

export default class MainScreen extends BaseComponent {

  static navigationOptions = ({navigation}) => ({
    title: 'GROUPS',
    showIcon: true,
    headerTintColor: ShankConstants.TERTIARY_COLOR,
    headerTitleStyle: {alignSelf: 'center', color: ShankConstants.TERTIARY_COLOR},
    headerStyle: { backgroundColor: ShankConstants.PRIMARY_COLOR },
    headerLeft: (
      <TouchableHighlight style={[MainStyles.headerIconButtonContainer]} onPress={() => navigation.state.params.tapCenterButton('AddGroup')}>
        <Entypo name='plus' style={[MainStyles.headerIconButton]} />
      </TouchableHighlight>
    ),
    headerRight: (
      <TouchableHighlight style={[MainStyles.headerIconButtonContainer]} onPress={() => navigation.state.params.tapCenterButton('Settings')}>
        <Entypo name='user' style={[MainStyles.headerIconButton]} />
      </TouchableHighlight>
    ),
    tabBarIcon: ({tintColor}) => (
      <Entypo name='users' style={[MainStyles.tabBarIcon, {color: tintColor}]} />
    ),
    tabBarLabel: 'Groups'
  });

  constructor(props) {
    super(props);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.tapCenterButton = this.tapCenterButton.bind(this);
    this.removeGroup = this.removeGroup.bind(this);
    this.onListGroupAsync = this.onListGroupAsync.bind(this);
    this.getGroupList = this.getGroupList.bind(this);
    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
      auth: null
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      tapCenterButton: this.tapCenterButton
    });
    AsyncStorage.getItem(ShankConstants.AUTH_TOKEN).then(authToken => {
      this.setState({auth: authToken});
      this.getGroupList();
      if (authToken) {
        Linking.addEventListener('url', this._handleOpenURL);
        Linking.getInitialURL().then((url) => {
          if (url) {
            let queryString = url.replace(Constants.linkingUri, '');
            if (queryString) {
              let data = qs.parse(queryString);
              if (data.group) {
                this.addToGroup(data);
              }
            }
          }
        }).catch(err => {
          console.error('An error occurred', err);
        });
      }
    });
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', (e) => {});
  }

  async getGroupList() {
    let user = await AsyncStorage.getItem(ShankConstants.USER_PROFILE);
    this.setState({currentUser: JSON.parse(user)})
    this.onListGroupAsync();
  }

  _handleOpenURL = (url) => {
    let queryString = url.url.replace(Constants.linkingUri, '');
    if (queryString) {
      let data = qs.parse(queryString);
      if (data.group) {
        this.addToGroup(data);
      }
    }
  }

  addToGroup = async(data) => {
    AsyncStorage.getItem(ShankConstants.USER_PROFILE).then(profile => {
      profile = JSON.parse(profile);
      this.setLoading(true);
      BaseModel.put(`groups/addUser/${data.group}/${profile._id}`).then((groups) => {
        this.getGroupList();
      }).catch((error) => {
        this.setLoading(false);
        BarMessages.showError(error, this.validationMessage);
      });;
    });
  }

  setLoading(loading) {
    this.setState({loading: loading});
  };

  tapCenterButton(onLogin) {
    if (this.state.auth) {
      super.navigateToScreen(onLogin);
    } else {
      super.navigateToScreen('Login');
    }
  }

  removeGroup(item) {
    this.onRemoveGroupAsync(item);
  }

  handleRefresh = () => {
    this.setState({
      page: 1,
      seed: this.state.seed + 1,
      refreshing: true
    }, () => {
      this.onListGroupAsync();
    });
  };

  // Async methods:
  onListGroupAsync = async(data) => {
    const {page, currentUser} = this.state;
    this.setState({refreshing: true, loading: true});
    BaseModel.get(`groups/myList/${currentUser._id}`).then((groups) => {
      this.setState({
        data: groups,
        loading: false,
        refreshing: false
      });
    }).catch((error) => {
      this.setLoading(false);
      if (error === 401) {
        try {
          AsyncStorage.removeItem(ShankConstants.AUTH_TOKEN);
        } catch (error) {
          console.log('ERROR ON REMOVING TOKEN: ', error);
        }
      }
      else {
        console.log('ERROR: ', error);
        BarMessages.showError(error, this.validationMessage);
      }
    });
  };

  onRemoveGroupAsync = async(data) => {
    this.setLoading(true);
    let endPoint;
    if (data.isOwner) {
      endPoint = `groups/changeStatus/${data._id}/false`;
    } else {
      endPoint = `groups/removeUser/${data._id}/${this.state.currentUser._id}`;
    }
    BaseModel.delete(endPoint).then(() => {
      this.setLoading(false);
      this.handleRefresh();
    }).catch((error) => {
      this.setLoading(false);
      console.log('ERROR! ', error);
      BarMessages.showError(error, this.validationMessage);
    });
  };

  render() {
    let addPhoto = require('../../../../resources/add_edit_photo.png');

    if (this.state.auth && this.state.data.length > 0) {
      return (
        <View style={[MainStyles.container]}>
          <Spinner visible={this.state.loading} animation='fade'/>
          <View style={[MainStyles.viewFlexItems]}>
            <List containerStyle={[MainStyles.noBorder, {height:'100%'}]}>
              <FlatList data={this.state.data} renderItem={({item}) => (
                <Swipeable rightButtons={[(
                  <TouchableHighlight style={[MainStyles.button, MainStyles.error, LocalStyles.trashButton]} onPress={() => this.removeGroup(item)}>
                    <FontAwesome name='trash-o' style={MainStyles.headerIconButton} />
                  </TouchableHighlight>
                )]}>

                  <TouchableHighlight style={[MainStyles.listItem]} underlayColor={ShankConstants.HIGHLIGHT_COLOR}
                    onPress={() => super.navigateToScreen('Group', {groupId: item._id, isOwner: item.isOwner})}>
                    <View style={[MainStyles.viewFlexItemsR]}>
                      <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart]}>
                        { item.photo != null ?
                            <Avatar medium rounded source={{uri: item.photo.path}} />
                          :
                            <Avatar medium rounded source={addPhoto} />
                        }
                      </View>
                      <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart, {flex:4}]}>
                        <Text numberOfLines={1} style={[LocalStyles.titleText]}>{item.name}</Text>
                        <Text numberOfLines={1} style={[MainStyles.shankGreen, LocalStyles.subtitleText]}>{item.myTournament}</Text>
                        <Text numberOfLines={1} style={[MainStyles.shankGreen, LocalStyles.subtitleText]}>
                          {`Score: ${item.myScore}     Rank: ${item.myRanking}/${item.users.length}`}
                        </Text>
                      </View>
                      <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsEnd]}>
                        <FontAwesome name='chevron-right' size={29} color={ShankConstants.TERTIARY_COLOR_ALT}/>
                      </View>
                    </View>
                  </TouchableHighlight>
                </Swipeable>
              )}
              keyExtractor={item => item._id}
              onRefresh={this.handleRefresh}
              refreshing={this.state.refreshing}
              onEndReachedThreshold={1} />
            </List>
          </View>
          <DropdownAlert ref={ref => this.validationMessage = ref} />
        </View>
      );
    }
    else {
      return (
        <View style={[MainStyles.mainContainer, LocalStyles.noneButtonView]}>
          <Spinner visible={this.state.loading} animation='fade' />
          <TouchableOpacity onPress={() => {this.tapCenterButton('AddGroup')}}>
            <Text style={[MainStyles.withoutGroups]}>
              Tap the {'"+"'} button to create{'\n'}or join a group
            </Text>
          </TouchableOpacity>
          <DropdownAlert ref={ref => this.validationMessage = ref} />
        </View>
      );
    }
  }
}
