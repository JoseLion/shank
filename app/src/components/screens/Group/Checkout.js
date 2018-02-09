// React components:
import React from 'react';
import { FlatList, Image, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { List } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import DropdownAlert from 'react-native-dropdownalert';

// Shank components:
import { BaseComponent, BaseModel, MainStyles, ShankConstants, BarMessages, Entypo, FontAwesome } from '../BaseComponent';
import LocalStyles from './styles/local'

export default class Checkout extends BaseComponent {

  static navigationOptions = ({navigation}) => ({
    title: 'CHECKOUT',
    headerTintColor: ShankConstants.TERTIARY_COLOR,
    headerTitleStyle: {alignSelf: 'center', color: ShankConstants.TERTIARY_COLOR},
    headerStyle: { backgroundColor: ShankConstants.PRIMARY_COLOR },
    headerLeft: (
      <TouchableHighlight onPress={() => navigation.goBack(null)}>
        <Entypo name='chevron-small-left' style={[MainStyles.headerIconButton]} />
      </TouchableHighlight>
    ),
    headerRight: (<View></View>)
  });

  constructor(props) {
    super(props);
    this.initialCalculations = this.initialCalculations.bind(this);
    this.onPlayerRankingSave = this.onPlayerRankingSave.bind(this);
    this.onRemoveFromList = this.onRemoveFromList.bind(this);
    this.state = {
      loading: false,
      changes: [],
      groupId: this.props.navigation.state.params.groupId,
      isOwner: this.props.navigation.state.params.isOwner,
      tournamentId: this.props.navigation.state.params.tournamentId,
      originalRanking: this.props.navigation.state.params.originalRanking,
      playerRanking: this.props.navigation.state.params.playerRanking,
      pricePerMovement: 0,
      total: 0
    };
  }

  componentDidMount() {
    this.getPricePerMovement();
  }

  setLoading(loading) {
    this.setState({loading: loading});
  }

  initialCalculations() {
    let original = this.state.originalRanking;
    let changes = [];
    let finalChanges = [];
    let total = 0;

    for(let i=0 ; i<original.length ; i++) {
      let dataChanged = this.state.playerRanking.filter(ranking => ranking.position == original[i].position)[0];
      if(original[i].playerId != dataChanged.playerId) {
        changes.push({
          fromId: original[i].playerId,
          from: original[i].fullName,
          toId: dataChanged.playerId,
          to: dataChanged.fullName
        });
      }
    }

    changes.forEach(change => {
      if(finalChanges.filter(ranking => ranking.fromId == change.toId).length == 0) {
        finalChanges.push(change);
      }
    });

    finalChanges = finalChanges.map((element, idx) => {
      element.number = idx + 1;
      element.price = this.state.pricePerMovement;
      return element;
    });
    this.setState({changes: finalChanges, total: (this.state.pricePerMovement * finalChanges.length) });
  }

  onPlayerRankingSave() {
    this.onPlayerRankingSaveAsync(this.state);
  }

  onRemoveFromList(item) {
    let fromObject = this.state.originalRanking.filter(ranking => ranking.playerId == item.fromId)[0];
    let settedFrom = false;
    let toObject = this.state.originalRanking.filter(ranking => ranking.playerId == item.toId)[0];
    let settedTo = false;
    let playerRanking = this.state.playerRanking.map(ranking => {
        if(!settedFrom && ranking.playerId == fromObject.playerId) {
            ranking = toObject;
            settedFrom = true;
        }
        if(!settedTo && ranking.playerId == toObject.playerId) {
            ranking = fromObject;
            settedTo = true;
        }
        return ranking;
    });
    this.setState(
      {
        playerRanking: this.state.playerRanking.map(ranking => {
          if(!settedFrom && ranking.playerId == fromObject.playerId) {
            ranking = toObject;
            settedFrom = true;
          }
          if(!settedTo && ranking.playerId == toObject.playerId) {
            ranking = fromObject;
            settedTo = true;
          }
          return ranking;
        }),
        changes: this.state.changes.filter(change => change.number != item.number ).map(change => {
          change.number = change.number - 1;
          return change;
        }),
        total: (this.state.pricePerMovement * this.state.changes.filter(change => change.number != item.number).length)
      }
    );
  }

  getPricePerMovement = async() => {
    await BaseModel.get('appSettings/findByCode/PPM').then((setting) => {
      this.setState({pricePerMovement: JSON.parse(setting.value)});
      this.initialCalculations();
    }).catch((error) => {
      this.setLoading(false);
    })
  };

  onPlayerRankingSaveAsync = async(data) => {
    this.setLoading(true);
    await BaseModel.put(`groups/editMyPlayers/${data.groupId}/${data.tournamentId}`, {players: data.playerRanking}).then((response) => {
      super.navigateToScreen('Group', {groupId: data.groupId, isOwner: data.isOwner})
    }).catch((error) => {
      BarMessages.showError(error, this.validationMessage);
    }).finally(() => {
      this.setLoading(false);
    });
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={[MainStyles.container, {justifyContent: 'flex-start'}]} behavior='padding'>
          <Spinner visible={this.state.loading} animation='fade'/>

          <View style={[{width: '90%'}]}>
            <View>
              <Text style={[{fontWeight: '700', fontSize: 20, textAlign: 'center', paddingTop: 25, paddingBottom: 25, borderBottomWidth: 3, borderBottomColor: ShankConstants.TERTIARY_COLOR_ALT}]}>
                Round {this.props.navigation.state.params.round} Changes Summary
              </Text>
            </View>

            <View>
              <List containerStyle={[MainStyles.noBorder, {marginBottom: 15}]}>
                <FlatList data={this.state.changes} renderItem={({item}) => (
                  <View style={[MainStyles.listItem, {paddingLeft: 0, paddingRight: 0}]}>
                    <View style={[MainStyles.viewFlexItemsR]}>
                      <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart, {flex: .1}]}>
                        <Text style={[{fontWeight: '700'}]}>{item.number}</Text>
                      </View>
                      <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart, {flex: .25}]}>
                        <Text style={[{color: ShankConstants.TERTIARY_COLOR_ALT}]}>{item.from}</Text>
                      </View>
                      <View style={[MainStyles.viewFlexItemsC, {flex: .15}]}>
                        <FontAwesome name='exchange' />
                      </View>
                      <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart, {flex: .25}]}>
                        <Text style={[{color: ShankConstants.TERTIARY_COLOR_ALT}]}>{item.to}</Text>
                      </View>
                      <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsEnd, {flex: .15}]}>
                        <Text style={[{fontSize: 18, fontWeight: '700'}]}>$ {this.state.pricePerMovement}</Text>
                      </View>
                      <View style={[MainStyles.viewFlexItemsC, {flex: .1}]}>
                        <TouchableHighlight onPress={() => {this.onRemoveFromList(item); }}>
                          <FontAwesome name='trash-o' style={[{color: ShankConstants.ERROR_COLOR, fontSize: 25}]} />
                        </TouchableHighlight>
                      </View>
                    </View>
                  </View>
                )}
                keyExtractor={item => item.number} />
              </List>
            </View>

            <View style={[{ position: 'absolute', bottom: -35, left: 0, width: '100%' }]}>
              <View style={[MainStyles.viewFlexItemsR]}>
                <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart]}>
                  <Text style={[{fontWeight: '700', fontSize: 20}]}>Total</Text>
                </View>
                <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsEnd]}>
                  <Text style={[{fontWeight: '700', fontSize: 30, color: ShankConstants.SUCCESS_COLOR}]}>$ {this.state.total.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            <View style={[{ position: 'absolute', bottom: -150, left: 0, width: '100%' }]}>
              <View style={[MainStyles.viewFlexItemsR]}>
                <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsStart]}>
                  <TouchableOpacity style={[MainStyles.button, MainStyles.primary, {width: '99%'}]} onPress={() => { this.props.navigation.goBack(null); }}>
                    <Text style={MainStyles.buttonText}>Keep Changing</Text>
                  </TouchableOpacity>
                </View>
                <View style={[MainStyles.viewFlexItemsC, MainStyles.viewFlexItemsEnd]}>
                  <TouchableOpacity style={[MainStyles.button, MainStyles.success, {width: '99%'}]} onPress={this.onPlayerRankingSave}>
                    <Text style={MainStyles.buttonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </View>
        </View>
        <DropdownAlert ref={ref => this.validationMessage = ref} />
      </View>
    );
  }

}
