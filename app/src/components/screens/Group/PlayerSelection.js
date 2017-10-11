/**
 * Created by MnMistake on 10/10/2017.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Ionicons} from '@expo/vector-icons'; // 5.2.0
import {TabNavigator} from 'react-navigation';
import PlayersList from './PlayerList';

import {
    Button,
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

export default class PlayerSelection extends Component {

    constructor(props) {
        super(props);
        // this._removeStorage = this._removeStorage.bind(this);
        this.state = {
            loading: false,
        };
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
    render(){
        let navigation = this.props.navigation;
        return(
            <InnerPlayerTabNav tPlayers={navigation.state.params.tPlayers}/>
        )
    }
}