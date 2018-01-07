// React components:
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, View, TouchableHighlight } from 'react-native';
import {TabNavigator} from 'react-navigation';
import {Avatar} from "react-native-elements";
import AtoZListView from 'react-native-atoz-listview';
import SortableListView from 'react-native-sortable-listview'
import ScrollableTabView, {ScrollableTabBar,} from 'react-native-scrollable-tab-view';

import { Ionicons, Entypo, FontAwesome } from '@expo/vector-icons'; // 5.2.0

import BaseModel from '../../../core/BaseModel';
import PlayersList from './PlayerList';
import MainStyles from '../../../styles/MainStyles';
import LocalStyles from './styles/local';
import * as Constants from '../../../core/Constants';
import * as BarMessages from '../../../core/BarMessages';
import Notifier from '../../../core/Notifier';

class RowComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkIsSelected: this.props.data.selected ? LocalStyles.checkIsSelected : {},
            refreshing: false
        };
    }

    playerSelected = function() {
        let self = this;
        this.props.players.forEach(function(player) {
            player.selected = false;
            if(player === self.props.data) {
                player.selected = true;
            }
        });
        this.setState({refreshing: true});
    }

    render() {
        return (
            <TouchableHighlight
                underlayColor="#c3c3c3"
                style={{
                    flex: 1,
                    padding: 20,
                    backgroundColor: '#ffffff',
                    borderBottomWidth: 1.5,
                    borderColor: '#c3c3c3',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
                onPress={() => this.playerSelected()}>
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                    <Avatar
                        small
                        rounded
                        source={{uri: this.props.data.urlPhoto}}
                        activeOpacity={0.7} />
                    <Text>{this.props.data.position}</Text>
                    <Text style={[MainStyles.shankGreen, LocalStyles.titleStyle]}>{this.props.data.name} {this.props.data.lastName}</Text>
                    <FontAwesome name="check" size={29} style={[LocalStyles.selectedCheck, this.state.checkIsSelected]}/>
                </View>
            </TouchableHighlight >
        );
    }
}

export default class PlayerSelection extends Component {

    static navigationOptions = ({navigation}) => ({
        title: 'CHOOSE PLAYER',
        headerTintColor: Constants.TERTIARY_COLOR,
        headerTitleStyle: {alignSelf: 'center', color: Constants.TERTIARY_COLOR},
        headerStyle: { backgroundColor: Constants.PRIMARY_COLOR },
        headerLeft: (
            <TouchableHighlight onPress={() => navigation.goBack(null)}>
                <FontAwesome name='chevron-left' style={MainStyles.headerIconButton} />
            </TouchableHighlight>
        ),
        headerRight: (
            <View>
                <FontAwesome name='search' style={MainStyles.headerIconButton} />
            </View>
        )
    });

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            tPLayers: this.props.tPlayers,
            data:
                [
                    {"name": "Bernard", "lastName": "Ford", "urlPhoto":"http://ichef.bbci.co.uk/onesport/cps/480/mcs/media/images/71780000/jpg/_71780044_gallacherpa.jpg"},
                    {"name": "Emiliano", "lastName": "Grillo", "urlPhoto":"http://fedegolfcba.com.ar/sites/default/files/styles/slider-home/public/field/image/grillo_emiliano.jpg?itok=X4SviB3z"},
                    {"name": "Issac", "lastName": "Hines", "urlPhoto":"https://static1.squarespace.com/static/58abbdb120099e0b12538e67/t/5923a3a1c534a5397b32c34b/1495507887454/Richie3.jpg?format=300w"},
                    {"name": "Shawn", "lastName": "Harper", "urlPhoto":"http://media.jrn.com/images/photo-0627bc6sacc_6137489_ver1.0_640_480.jpg"},
                    {"name": "Si Woo", "lastName": "Kim", "urlPhoto":"http://www.golfchannel.com/sites/golfchannel.prod.acquia-sites.com/files/styles/blog_header_image_304x176/public/9/C/C/%7B9CC84FBA-BEE3-482B-9EA7-16CB3EF643AF%7Dkim_si_woo_q-school12_final_day_610.jpg?itok=DCgt_CPy"},
                    {"name": "David", "lastName": "Lightnment", "urlPhoto":"http://news.xinhuanet.com/english/photo/2015-06/08/134307137_14337441855531n.jpg"},
                    {"name": "Graeme", "lastName": "Mcdowell ", "urlPhoto":"https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Graeme_McDowell_2012.jpg/220px-Graeme_McDowell_2012.jpg"},
                    {"name": "Patrick", "lastName": "Rodgers ", "urlPhoto":"https://i1.wp.com/blog.trackmangolf.com/wp-content/uploads/2016/11/Patrick-Rodgers-Swing-optimization-with-TrackMan.png?fit=1200%2C823&ssl=1"},
                    {"name": "Daniel", "lastName": "Summerhays", "urlPhoto":"http://i2.cdn.turner.com/dr/pga/sites/default/files/articles/summerhays-daniel-071813-640x360.jpg"},
                    {"name": "Keegan", "lastName": "Taylor", "urlPhoto":"http://media.gettyimages.com/photos/may-2000-kevin-keegan-the-england-manager-plays-out-of-a-bunker-on-picture-id1030959"},
                    {"name": "William", "lastName": "Wheeler", "urlPhoto":"http://media.golfdigest.com/photos/592442b5c45e221ebef6e668/master/w_768/satoshi-kodaira-sony-open-2017.jpg"},
                ]
        };
    }

    updateLocalPlayerList(navigation) {
        let self = this;
        let playerSelected = null;
        this.state.data.forEach(player => {
            if(player.selected) {
                playerSelected = player;
                return;
            }
        });
        if(playerSelected) {
            navigation.state.params.updatePlayerRankingsList(navigation.state.params.currentPosition, playerSelected);
        }
        navigation.goBack(null);
    }

    setLoading(loading) { this.setState({loading: loading}); }

    render() {
        let navigation = this.props.navigation;
        let completeData = this.state.data;
        return (
            <View style={{flex:1, width:'100%'}} >
                <SortableListView
                    style={{flex: 1, marginBottom: '20%'}}
                    data={this.state.data}
                    onMoveStart={() => {
                        console.log("onMoveStart")
                    }}
                    onMoveEnd={() => {
                        console.log("onMoveEnd")
                    }}
                    onMoveCancel ={() => {
                        console.log("move canceled")
                    }}
                    renderRow=
                        {
                            (row, sectionID, rowID) => <RowComponent data={row}
                                                                        navigation={navigation}
                                                                        sectionID={sectionID}
                                                                        rowID={rowID}
                                                                        players={completeData}/>
                        }/>

                <TouchableOpacity
                    onPress={() => this.updateLocalPlayerList(navigation)}
                    style={[{
                        position: 'absolute',
                        bottom: '1%',
                        width: '80%'
                    }, MainStyles.button, MainStyles.success]}>
                    <Text style={MainStyles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
