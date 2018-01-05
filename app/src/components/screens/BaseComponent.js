// React components:
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Platform, Dimensions, StyleSheet } from 'react-native';
import { Facebook } from 'expo';
import { FontAwesome, Entypo, Ionicons } from '@expo/vector-icons';

import NoAuthModel from '../../core/NoAuthModel';
import BaseModel from '../../core/BaseModel';
import GolfApiModel from '../../core/GolfApiModel';
import MainStyles from '../../styles/main';
import * as Constants from '../../core/Constants';
import * as BarMessages from '../../core/BarMessages';
import Style from '../../styles/Stylesheet';

let isAndroid = Platform.OS == 'android' ? true : false;

class BaseComponent extends Component {

    static propTypes = { navigation: PropTypes.object.isRequired };

    constructor(props) {
        super(props);
        this.state = {
            navigationPress : false
        };
    }

    updateState(data) {
        this.setState(data);
    }

    navigateDispatchToScreen(page) {
        if(!this.state.navigationPress) {
            this.setState({navigationPress: true});
            this.props.navigation.dispatch({type: page});
        }
    }

    navigateToScreen(page, data) {
        if(!this.state.navigationPress) {
            this.setState({navigationPress: true});
            this.props.navigation.navigate(page, data);
        }
    }

    navigateDispatch() {
        if(!this.state.navigationPress) {
            this.setState({navigationPress: true});
            this.props.navigation.dispatch();
        }
    }

}

export {
    Platform,
    Dimensions,
    StyleSheet,
    Facebook,

    FontAwesome,
    Entypo,
    Ionicons,
    Style,

    BaseComponent,
    NoAuthModel,
    BaseModel,
    GolfApiModel,
    MainStyles,
    Constants,
    BarMessages,
    isAndroid };
