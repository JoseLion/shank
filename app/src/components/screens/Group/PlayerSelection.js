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

import {
    Button,
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
                "A": [{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"},{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"} ],
                "B": [{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"},{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"} ],
                "C": [{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"},{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"} ],
                "X": [{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"},{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"} ],
                "Z": [{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"},{"name": "Anh Tuan", "lastName": "Nguyen", "urlPhoto":"https://res.cloudinary.com/pga-tour/image/upload/q_85,t_headshots_player_l/headshots_37455.png"} ],
            }
        }
    }

    renderRow = (item, sectionId, index) =>{
        let navigation = this.props.navigation;
        console.log("this.propsthis.propsthis.propsthis.propsthis.propsthis.propsthis.propsthis.propsthis.props")
        console.log(this.props)
        item['none'] = false;
        return (
            <TouchableOpacity style={[MainStyles.centeredObject, {height: '13%', justifyContent: 'center', alignItems: 'center'}]}
                              onPress={() => {navigation.goBack();navigation.state.params.onNewPlayer({ onNewPlayer: item });}/*navigation.navigate('SingleGroup', {extraPlayer: this.props.item})*/}>
                <Avatar
                    small
                    rounded
                    source={{uri: item.urlPhoto}}
                    onPress={() => navigation.navigate('SingleGroup', {extraPlayer: index})}
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