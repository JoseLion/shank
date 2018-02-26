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
    this.playerChanged = this.playerChanged.bind(this);
    this.saveAndPay = this.saveAndPay.bind(this);
    this.state = {
      loading: false,
      changes: [],
      groupId: this.props.navigation.state.params.groupId,
      isOwner: this.props.navigation.state.params.isOwner,
      tournamentId: this.props.navigation.state.params.tournamentId,
      currentRoaster: this.props.navigation.state.params.playerRanking,
      originalRoaster: this.props.navigation.state.params.originalRanking,
      pricePerMovement: 0,
      total: 0
    };
  }

  componentDidMount() {
    let finalCost = 0.0;
    
    for (let i = 0; i < this.state.currentRoaster.length; i++) {
      if (this.playerChanged(i)) {
        finalCost += 1.99;
      }
    }

    this.setState({total: finalCost});
  }

  playerChanged(index) {
    if (this.state.currentRoaster[index]._id == this.state.originalRoaster[index]._id) {
      return false;
    }

    return true;
  }

  async saveAndPay() {
    this.setState({loading: true});

    await BaseModel.put(`groups/editMyPlayers/${this.state.groupId}/${this.state.tournamentId}`, {players: this.state.currentRoaster}).then((response) => {
      super.navigateToScreen('Group', {groupId: this.state.groupId, isOwner: this.state.isOwner})
    }).catch((error) => {
      BarMessages.showError(error, this.validationMessage);
    }).finally(() => {
      this.setState({loading: false});
    });
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={[MainStyles.container, {justifyContent: 'flex-start'}]} behavior='padding'>
          <Spinner visible={this.state.loading} animation='fade'/>

          <View style={[{width: '90%'}]}>
            <View>
              <Text style={[LocalStyles.checkoutTitle]}>
                Round {this.props.navigation.state.params.round} Changes Summary
              </Text>
            </View>

            <View>
              <List containerStyle={[MainStyles.noBorder, {marginBottom: 15}]}>
                <FlatList data={this.state.currentRoaster} keyExtractor={item => item._id} renderItem={({item, index}) => (
                  <View style={[LocalStyles.checkoutRow]}>
                    <View style={{flex: 1}}>
                      <Text style={[LocalStyles.checkoutNum]}>{index + 1}</Text>
                    </View>

                    <View style={{flex: 6}}>
                      <Text style={[LocalStyles.checkoutNames]}>{item.fullName}</Text>
                    </View>

                    <View style={{flex: 3}}>
                      <FontAwesome style={[LocalStyles.exchangeIcon]} name='exchange' />
                    </View>

                    <View style={{flex: 6}}>
                      <Text style={[LocalStyles.checkoutNames, {textAlign: 'right'}]}>{this.state.originalRoaster[index].fullName}</Text>
                    </View>

                    <View style={{flex: 3}}>
                      {this.playerChanged(index) ? (<Text style={[LocalStyles.checkoutCost]}>{`$1.99`}</Text>) : null}
                    </View>
                  </View>
                )}></FlatList>
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
                  <TouchableOpacity style={[MainStyles.button, MainStyles.success, {width: '99%'}]} onPress={this.saveAndPay}>
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