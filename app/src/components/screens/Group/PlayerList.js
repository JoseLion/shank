/**
 * Created by MnMistake on 10/10/2017.
 */
import React, {Component} from 'react';

import {
    Button,
    Text
} from 'react-native';

export default class PlayersList extends Component {

    constructor(props) {
        super(props);
        console.log("constructorconstructor")
    console.log(this.props)
        // this._removeStorage = this._removeStorage.bind(this);
        this.state = {
            loading: false,
            tPLayers : this.props.tPlayers
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

    render(){
/*        let tournamentItems = this.state.tPLayers.map((s, i) => {
            return <Text>{s.first_name} {s.last_name}</Text>
        });*/
        return(
            <Text>PLAYERS ALREADY GETTING HERE</Text>
        )
    }
}