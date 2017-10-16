import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Image, StatusBar, AsyncStorage} from 'react-native';
import MainStyles from '../../../styles/main';
import LocalStyles from './styles/local';
import * as Constants from '../../../core/Constans';

const logoTrans = require('../../../../resources/shankLogo/IOS/trans/shankLogoTrans.png');
const logoRegular = require('../../../../resources/shankLogo/IOS/regular/shankLogo.png');

export default class SplashScreen extends Component {

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'Splash',
        header: null
    };

    componentDidMount() {
        this.timeoutHandle = setTimeout(() => {
            AsyncStorage.getItem(Constants.AUTH_TOKEN).then(authToken => {
                if (authToken) {
                    this.props.navigation.dispatch({type: 'Main'})
                }else{
                    this.props.navigation.dispatch({type: 'Slider'})
                }
            });
        }, 2000);
    };

    componentWillUnmount() {
        clearTimeout(this.timeoutHandle);
    };

    constructor(props) {

        super(props);
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