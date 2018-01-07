/**
 * Created by MnMistake on 10/10/2017.
 */
import React, {Component} from 'react';

import PropTypes from 'prop-types';
import LocalStyles from './styles/local';
import MainStyles from '../../../styles/MainStyles';
import AtoZListView from 'react-native-atoz-listview';
import {Avatar} from "react-native-elements";

import {
    Text,
    View,
    TouchableOpacity,
} from 'react-native';

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
const rowHeight = 40;
export default class PlayersList extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };



    // Define your own renderRow
    constructor(props) {
        super(props);
        console.log("constructorconstructor")
        //console.log(this.props.screenProps.tPlayers) heres gonna come the players

        this.renderRow = this.renderRow.bind(this);
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
        };
    }

    renderRow = (item, sectionId, index) =>{
        let navigation = this.props.navigation;
        console.log("this.propsthis.propsthis.propsthis.propsthis.propsthis.propsthis.propsthis.propsthis.props")
        console.log(this.props)
        return (
            <TouchableOpacity style={[MainStyles.centeredObject, {height: '13%', justifyContent: 'center', alignItems: 'center'}]}
                              onPress={() => navigation.goBack(null)/*navigation.navigate('SingleGroup', {extraPlayer: this.props.item})*/}>
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


    setLoading(loading) {
        this.setState({loading: loading});
    }

    componentDidMount() {
        console.log(this.state.currentDate)
        console.log("asdczxczxc")
        console.log(this.props)

    }

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
