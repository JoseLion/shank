/**
 * Created by MnMistake on 10/10/2017.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Ionicons} from '@expo/vector-icons'; // 5.2.0
import {TabNavigator} from 'react-navigation';
import PlayersList from './PlayerList';
import LocalStyles from './styles/local';
import MainStyles from '../../../styles/main';
import {Avatar} from "react-native-elements";
import AtoZListView from 'react-native-atoz-listview';
import BaseModel from '../../../core/BaseModel';
import Notifier from '../../../core/Notifier';

import {
    TouchableOpacity,
    Text,
    View
} from 'react-native';

const InnerPlayerTabNav = TabNavigator({
    All: {
        screen: PlayersList,
    },
    Gold: {
        screen: PlayersList,
    },
    Silver: {
        screen: PlayersList,
    },
    Bronze: {
        screen: PlayersList,
    },
}, {
    tabBarPosition: 'top',
    animationEnabled: true,
    tabBarOptions: {
        activeTintColor: '#556E3E',
        inactiveTintColor : '#556E3E',
        style: {
            backgroundColor: "#fff",
        }
    },
    labelStyle: {
        fontWeight: 'black',
    }
});

const rowHeight = 40;

class SectionHeader extends Component {
    render() {
        return (
            <View style={LocalStyles.viewHeaderPlayerList}>
                <Text style={LocalStyles.textHeaderPlayerList}>{this.props.title}</Text>
            </View>
        );
    }
}

class SectionItem extends Component {
    render() {
        return (
            <Text style={LocalStyles.alphabeticalText}>{this.props.title}</Text>
        );
    }
}

export default class PlayerSelection extends Component {

    constructor(props) {
        super(props);
        // this._removeStorage = this._removeStorage.bind(this);
        this.state = {
            loading: false,
            tPLayers: this.props.tPlayers,
            data: {
                "F": [{"name": "Bernard", "lastName": "Ford", "urlPhoto":"http://ichef.bbci.co.uk/onesport/cps/480/mcs/media/images/71780000/jpg/_71780044_gallacherpa.jpg"} ],
                "H": [{"name": "Issac", "lastName": "Hines", "urlPhoto":"https://static1.squarespace.com/static/58abbdb120099e0b12538e67/t/5923a3a1c534a5397b32c34b/1495507887454/Richie3.jpg?format=300w"},{"name": "Shawn", "lastName": "Harper", "urlPhoto":"http://media.jrn.com/images/photo-0627bc6sacc_6137489_ver1.0_640_480.jpg"} ],
                "K": [{"name": "Si Woo", "lastName": "Kim", "urlPhoto":"http://www.golfchannel.com/sites/golfchannel.prod.acquia-sites.com/files/styles/blog_header_image_304x176/public/9/C/C/%7B9CC84FBA-BEE3-482B-9EA7-16CB3EF643AF%7Dkim_si_woo_q-school12_final_day_610.jpg?itok=DCgt_CPy"} ],
                "T": [{"name": "Keegan", "lastName": "Taylor", "urlPhoto":"http://media.gettyimages.com/photos/may-2000-kevin-keegan-the-england-manager-plays-out-of-a-bunker-on-picture-id1030959"} ],
                "W": [{"name": "William", "lastName": "Wheeler", "urlPhoto":"http://media.golfdigest.com/photos/592442b5c45e221ebef6e668/master/w_768/satoshi-kodaira-sony-open-2017.jpg"} ],

            }
/*        {"name": "Jared", "lastName": "Williams", "urlPhoto":"http://s3.amazonaws.com/golfcanada/app/uploads/golfcanada/production/2017/06/09093500/17.06.09-Ryan-Williams-370x213.jpg"}*/
        }
    }

    updatePlayerRankings = async (groupId,userGroupId,playerRankings,navigation,newAddition,currentPosition) => {
        this.setLoading(true);
        let existingPlayer = playerRankings.find(o => o.name === newAddition.name && o.lastName === newAddition.lastName);
        if (existingPlayer){
            Notifier.message({title: 'RESPONSE', message: "You already have this player on your prediction list."});
        }else{
            let newAdditionInPosition = {}
            newAdditionInPosition[currentPosition -1] = newAddition
            let updatedPlayerPredictions = Object.assign(playerRankings, newAdditionInPosition)
            let data = {
                userGroupId:userGroupId,
                playerRankings:updatedPlayerPredictions,
                groupId:groupId,
            }
            newAddition.position = currentPosition
            console.log("datadatadataupdatePlayerRanksssingsupdatePlayerRankingsupdatePlayerRankings")
            console.log(data)
            try {
                const currentGroup = await BaseModel.create('updateUserPlayerRankingByGroup', data)
                if (currentGroup) {
                    navigation.goBack()
                    navigation.state.params.onNewPlayer({ onNewPlayer: newAddition })
                }
            } catch (e) {
                console.log('error in initialRequest: SingleGroup.js')
                console.log(e)
            }
        }
    };

    renderRow = (item, sectionId, index) =>{
        let navigation = this.props.navigation;
        item['none'] = false;
        return (
            <TouchableOpacity style={[MainStyles.centeredObject, {height: '13%', justifyContent: 'center', alignItems: 'center'}]}
                              onPress={() => this.updatePlayerRankings(navigation.state.params.groupId,navigation.state.params.userGroupId,navigation.state.params.tPlayers,navigation,item,navigation.state.params.currentPosition)/*navigation.navigate('SingleGroup', {extraPlayer: this.props.item})*/}>
                <Avatar
                    small
                    rounded
                    source={{uri: item.urlPhoto}}
                    onPress={() => this.updatePlayerRankings(navigation.state.params.groupId,navigation.state.params.userGroupId,navigation.state.params.tPlayers,navigation,item,navigation.state.params.currentPosition)}
                    activeOpacity={0.7}
                />
                <Text>{item.name} {item.lastName}</Text>
            </TouchableOpacity>
        );
    }

    static navigationOptions = ({navigation}) => ({
        title: 'CHOOSE PLAYER',
        headerTintColor: '#fff',
        headerTitleStyle: {alignSelf: 'center', color: '#fff'},
        headerStyle: {
            backgroundColor: '#556E3E'
        },
        headerRight: (<Ionicons name="md-search" size={25} color="white"/>)
    });

    setLoading(loading) {
        this.setState({loading: loading});
    }

    componentDidMount() {
        console.log(this.state.currentDate)
    }
/*    render(){
        let navigation = this.props.navigation;
        console.log("tttttttttttttttttttttttttttttt")
        console.log(navigation.state.params.tPlayers)
       /!*TODO: MAKE IT WORK WITH TABS - NAV GETS FUCKED <InnerPlayerTabNav  screenProps={{tPlayers: navigation.state.params.tPlayers }}/>*!/
        return(
            <InnerPlayerTabNav  screenProps={{tPlayers: navigation.state.params.tPlayers }}/>
        )
    }*/

    render() {
        let navigation = this.props.navigation;
        console.log("navigation.state.params.datanavigation.state.params.data")
        // console.log(navigation.state.params.tPlayers)
        /*        let tournamentItems = this.state.tPLayers.map((s, i) => {
         return <Text>{s.first_name} {s.last_name}</Text>
         });*/
        {/* <AlphabetListView
         data={this.state.data}
         cell={Cell}
         cellHeight={30}
         sectionListItem={SectionItem}
         sectionHeader={SectionHeader}
         sectionHeaderHeight={22.5}
         />*/
        }
        return (
            <AtoZListView
                data={this.state.data}     // required array|object
                renderRow={this.renderRow} // required func
                rowHeight={rowHeight}      // required number
                sectionHeaderHeight={40}   // required number
                sectionHeader={SectionHeader}
                sectionListItem={SectionItem}
                /**
                 * Optional props: all props will passing to ListView
                 * you simple look at ListView official document
                 * headerHeight              number
                 * footerHeigh               number
                 * sectionListStyle          number|object
                 * hideSectionList           bool
                 * compareFunction           func
                 * renderSelectionList       func
                 * sectionListItem           func
                 * contentOffset             object
                 * style                     object|number
                 */
            />
        )
    }
}