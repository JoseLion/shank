import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, StatusBar, AsyncStorage, Linking } from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import * as Constants from '../../../core/Constants';

import qs from 'qs';

export default class SplashScreen extends Component {
    url = "";

    static propTypes = { navigation: PropTypes.object.isRequired };
    static navigationOptions = {
        title: 'Splash',
        header: null
    };

    constructor(props) {
        super(props);
        console.log(':::IT\'S ON SPLASH:::')
        this.state = {
            changeImages: true,
            changeBackground: true
        };

        setTimeout(() => {
            this.setState(previousState => {
                return {
                    changeImages: !previousState.changeImages,
                    changeBackground: !previousState.changeBackground
                };
            });
        }, 1000);
    };

    _handleRedirects = (url) => {
        let query = url.replace(Constants.LINKING_URI + '+', '');
        let data;
        if (query) {
            data = qs.parse(query);
            if(!data['tag']){
                data = "";
            }
        } else {
            data = "";
        }
        return data;
    }

    componentDidMount() {
        Linking.getInitialURL()
            .then(url => { this.url = url })
            .catch(err => console.error('An error occurred', err));

        this.timeoutHandle = setTimeout(() => {
            AsyncStorage.getItem(Constants.AUTH_TOKEN)
                .then(authToken => {
                    if (authToken) {
                        this.props.navigation.navigate('Main', {url: this._handleRedirects(this.url), auth: true})
                    } else {
                        this.props.navigation.navigate('Slider', {url: this._handleRedirects(this.url), auth: false})
                    }
                });
        }, 3000);
    };

    componentWillUnmount() {
        clearTimeout(this.timeoutHandle);
    };

    render() {
        let imgSource = require('../../../../resources/shank_completo.png');
        return (
            <View style={[MainStyles.container, LocalStyles.container]}>
                <StatusBar hidden={true}/>
                <Image source={imgSource} style={MainStyles.iconXLG}/>
            </View>
        );
    }
}
