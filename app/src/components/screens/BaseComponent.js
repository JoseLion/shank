// React components:
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Platform, Dimensions, StyleSheet } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import DropdownAlert from 'react-native-dropdownalert';

import NoAuthModel from '../../core/NoAuthModel';
import BaseModel from '../../core/BaseModel';
import { FileHost } from '../../config/variables';
import GolfApiModel from '../../core/GolfApiModel';
import MainStyles from '../../styles/MainStyles';
import * as AppConst from '../../core/AppConst';
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
            this.setState({navigationPress: false});
        }
    }

    navigateToScreen(page, data) {
        if(!this.state.navigationPress) {
            this.setState({navigationPress: true});
            this.props.navigation.navigate(page, data);
            this.setState({navigationPress: false});
        }
    }

    navigateDispatch() {
        if(!this.state.navigationPress) {
            this.setState({navigationPress: true});
            this.props.navigation.dispatch();
            this.setState({navigationPress: false});
        }
    }

}

export {
    Dimensions,
    DropdownAlert,
    Platform,
    Spinner,
    StyleSheet,
    Style,
    BarMessages,
    BaseComponent,
    BaseModel,
    FileHost,
    AppConst,
    GolfApiModel,
    isAndroid,
    MainStyles,
    NoAuthModel
};
