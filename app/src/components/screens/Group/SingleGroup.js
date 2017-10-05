/**
 * Created by MnMistake on 10/4/2017.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, StyleSheet, Text, View, Image, StatusBar, BackHandler} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';

const logoRegular = require('../../../../resources/shankLogo/IOS/regular/shankLogo.png');

export default class SingleGroup extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'Splash',
        header: null
    };

    componentDidMount() {
        BackHandler.addEventListener('backPress', () => {
            const { dispatch, nav } = this.props
          /*  if (shouldCloseApp(nav)) return false*/
            dispatch({ type: 'Back' })
            return true
        })
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('backPress')
    }

    constructor(props) {
        super(props);
        this.state = {
            changeImages: true,
            changeBackground: true,
        };
    };

    render() {
        // let imgSource = this.state.changeImages ? logoRegular : logoTrans;
        let imgSource = this.state.changeImages ? logoRegular : logoRegular;
        let backgroundColor = this.state.changeBackground ? '#1D222D' : '#3C4635';
        return (
            <View style={[LocalStyles.container, {backgroundColor: backgroundColor}]}>
                <StatusBar hidden={true}/>
                <Image source={imgSource}
                       style={MainStyles.iconXLG}/>
            </View>

        );
    }
}