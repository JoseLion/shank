// React components:
import React from 'react';
import { Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import SortableListView from 'react-native-sortable-listview';
import DropdownAlert from 'react-native-dropdownalert';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// Shank components:
import { BaseComponent, BaseModel, GolfApiModel, MainStyles, ShankConstants, BarMessages, FontAwesome, Entypo, Spinner } from '../BaseComponent';
import LocalStyles from './styles/local';

class PlayerRow extends BaseComponent {

  constructor(props) {
    super(props);
    this.playerSelected = this.playerSelected.bind(this);
    this.state = { checkIsSelected: this.props.data.isSelected ? LocalStyles.checkIsSelected : null };
  }

  playerSelected() {
    if(this.state.checkIsSelected != null) {
      this.props.data.isSelected = false;
      this.setState({checkIsSelected: null});
    } else {
      this.props.data.isSelected = true;
      this.setState({checkIsSelected: LocalStyles.checkIsSelected});

    }
    this.props.setUpdateSelected(this.props.data);
  }

  render() {
    return (
      <TouchableHighlight style={[MainStyles.listItem]} underlayColor={ShankConstants.HIGHLIGHT_COLOR} onPress={() => this.playerSelected()}>
        <View style={[MainStyles.viewFlexItemsR]}>
          <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart]}>
            <Avatar medium rounded source={{uri: this.props.data.photoUrl}} />
          </View>
          <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart, {flex: 3}]}>
            <Text style={[MainStyles.shankGreen, LocalStyles.titleStyle]}>{this.props.data.fullName}</Text>
          </View>
          <View style={[MainStyles.viewFlexItemsC]}>
            <Text style={[MainStyles.shankGreen, LocalStyles.titleStyle]}>0 %</Text>
          </View>
          <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsEnd, {flex:2}]}>
            <FontAwesome name='check' size={29} style={[LocalStyles.selectedCheck, this.state.checkIsSelected]}/>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

export default class PlayerSelectionSearch extends BaseComponent {

  static navigationOptions = ({navigation}) => ({
    header: null
  });

  constructor(props) {
    super(props);
    this.setUpdateSelected = this.setUpdateSelected.bind(this);
    this.searchInPlayers = this.searchInPlayers.bind(this);
    this.state = {
      players: this.props.navigation.state.params.players,
      finalPlayers: [],
      loading: false,
      data: []
    };
  }

  setLoading(loading) { this.setState({loading: loading}); }
  setUpdateSelected(playerSelected) {
    let players = this.state.finalPlayers;
    if(playerSelected.isSelected) {
      players.push({
        playerId: playerSelected.playerId,
        fullName: playerSelected.fullName,
        photoUrl: playerSelected.photoUrl
      });
    } else {
      for(let idx=0 ; idx<players.length ; idx++) {
        if(players[idx].playerId == playerSelected.PlayerID) {
          players.splice(idx, 1);
          break;
        }
      }
    }
    this.setState({finalPlayers: players});
    this.props.navigation.state.params.updateListSelected(players);
  }
  searchInPlayers(playerName) {
    if(playerName.length === 0) {
      this.setState({data: []});
      return;
    }

    let found = this.state.players.filter(player => {
      return player.fullName.toUpperCase().indexOf(playerName.toUpperCase().trim()) !== -1;
    });
    this.setState({data: found});
  }

  render() {
    return (
      <View style={{flex:1, width:'100%', backgroundColor: ShankConstants.BACKGROUND_COLOR}} >
        <Spinner visible={this.state.loading} animation='fade' />
        <KeyboardAwareScrollView ref='scroll' enableOnAndroid={true} extraHeight={10} keyboardDismissMode='interactive' style={MainStyles.background}>
          <View style={[MainStyles.viewFlexItemsR, { backgroundColor: ShankConstants.PRIMARY_COLOR }]}>
            <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart, {flex: 4}]}>
              <TextInput
                underlineColorAndroid='transparent'
                placeholderTextColor="#FFF"
                style={[MainStyles.formInput, {
                  borderRadius: 5,
                  borderWidth: 0,
                  backgroundColor: 'rgba(241, 242, 242, 0.25)',
                  color: '#FFF',
                  marginLeft: 15,
                  marginTop: 5,
                  marginBottom: 5,
                  paddingLeft: 40,
                  paddingTop: 10,
                  paddingBottom: 10
                }]}
                placeholder={'Search Players'}
                onChangeText={(playerName) => this.searchInPlayers(playerName)}
                maxLength={25} />
            </View>
            <View style={[MainStyles.viewFlexItemsC]}>
              <TouchableHighlight  style={[MainStyles.headerIconButtonContainer]} onPress={() => this.props.navigation.goBack()}>
                <Text style={[{color: '#FFF'}]}>{this.state.finalPlayers.length > 0 ? 'Close' : 'Cancel'}</Text>
              </TouchableHighlight>
            </View>
          </View>
          <View style={[{flex: 10}]}>
            <SortableListView
              style={{flex: 1, marginBottom: '20%'}}
              data={this.state.data}
              renderRow= { (row) =>
                <PlayerRow
                  data={row}
                  players={this.state.players}
                  setUpdateSelected={this.setUpdateSelected}
                  navigation={this.props.navigation} />
                } />
          </View>
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
