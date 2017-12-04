import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Image, StatusBar, AsyncStorage, Linking } from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import * as Constants from '../../../core/Constans';

import qs from 'qs';

const logoTrans = require('../../../../resources/shankLogo/IOS/trans/shankLogoTrans.png');
const logoRegular = require('../../../../resources/shankLogo/IOS/regular/shankLogo.png');

export default class SplashScreen extends Component {
    url = "";

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'Splash',
        header: null
    };

    constructor(props) {
        super(props);
        console.log(':::IT\'S ON SPLASH:::')
        this.state = {
            changeImages: true,
            changeBackground: true,
        };

        setTimeout(() => {
            this.setState(previousState => {
                return {
                    changeImages: !previousState.changeImages,
                    changeBackground: !previousState.changeBackground,
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
        // let promise = await Linking.getInitialURL
        Linking.getInitialURL()
            .then(url => {
                console.log('Inside of the function is: ' + url);
                this.url = url
            })
            .catch(err => console.error('An error occurred', err));

        this.timeoutHandle = setTimeout(() => {
            AsyncStorage.getItem(Constants.AUTH_TOKEN)
                .then(authToken => {
                    console.log('AUTH_TOKEN: ', authToken);
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
        // let imgSource = this.state.changeImages ? logoRegular : logoTrans;
        let imgSource = this.state.changeImages ? logoRegular : logoRegular;
        let backgroundColor = this.state.changeBackground ? '#1D222D' : '#3C4635';
        return (
            <View style={[LocalStyles.container, {backgroundColor: backgroundColor}]}>
                <StatusBar hidden={true}/>
                <Image source={imgSource} style={MainStyles.iconXLG}/>
            </View>
        );
    }
}
