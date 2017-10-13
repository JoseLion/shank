/**
 * Created by MnMistake on 10/10/2017.
 */
import React, {Component} from 'react';

import PropTypes from 'prop-types';
const AlphabetListView = require('react-native-alphabetlistview');
import LocalStyles from './styles/local';
import MainStyles from '../../../styles/main';

import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';

export default class PlayersList extends Component {


    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        console.log("constructorconstructor")
        console.log(this.props)
        // this._removeStorage = this._removeStorage.bind(this);
        this.state = {
            loading: false,
            tPLayers: this.props.tPlayers,
            data: {
                A: ['some','entries','are here'],
                B: ['some','entries','are here'],
                C: ['some','entries','are here'],
                D: ['some','entries','are here'],
                E: ['some','entries','are here'],
                F: ['some','entries','are here'],
                G: ['some','entries','are here'],
                H: ['some','entries','are here'],
                I: ['some','entries','are here'],
                J: ['some','entries','are here'],
                K: ['some','entries','are here'],
                L: ['some','entries','are here'],
                M: ['some','entries','are here'],
                N: ['some','entries','are here'],
                O: ['some','entries','are here'],
                P: ['some','entries','are here'],
                Q: ['some','entries','are here'],
                R: ['some','entries','are here'],
                S: ['some','entries','are here'],
                T: ['some','entries','are here'],
                U: ['some','entries','are here'],
                V: ['some','entries','are here'],
                W: ['some','entries','are here'],
                X: ['some','entries','are here'],
                Y: ['some','entries','are here'],
                Z: ['some','entries','are here'],
            }
        };
    }

    setLoading(loading) {
        this.setState({loading: loading});
    }

    componentDidMount() {
        console.log(this.state.currentDate)
        console.log("asdczxczxc")
        console.log(this.props)

    }

    SectionHeader = () => {
        return (
            <View style={LocalStyles.viewHeaderPlayerList}>
                <Text style={LocalStyles.textHeaderPlayerList}>{this.props.title}</Text>
            </View>
        );
    };

    SectionItem = () => {
        return (
            <Text style={{color:'#f00'}}>{this.props.title}</Text>
        );
    };

    Cell = (navigation) => {
        return (
            <View style={{height:30}}>
                <TouchableOpacity style={[MainStyles.centeredObject]}
                                  onPress={() => navigation.navigate('SingleGroup', {extraPlayer: this.props.item})}>
                    <Text>{this.props.item}</Text>
                </TouchableOpacity>
            </View>
        );
    };



    render() {
        let navigation = this.props.navigation;
        console.log("navigation.state.params.datanavigation.state.params.data")
        console.log(navigation.state.params.tPlayers)
        /*        let tournamentItems = this.state.tPLayers.map((s, i) => {
                    return <Text>{s.first_name} {s.last_name}</Text>
                });*/
        return (
            <AlphabetListView
                data={this.state.data}
                cell={this.Cell}
                cellHeight={30}
                sectionListItem={this.SectionItem}
                sectionHeader={this.SectionHeader}
                sectionHeaderHeight={22.5}
            />
        )
    }
}