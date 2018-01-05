// React components:
import React from 'react';
import { View, Image, StatusBar, Linking, AsyncStorage, Animated } from 'react-native';
import qs from 'qs';

// Shank components:
import { BaseComponent, MainStyles, Constants } from '../BaseComponent';
import LocalStyles from './styles/local';

import BackgroundSolid from '../../../../resources/shank_completo.png';
import BackgroundTransparent from '../../../../resources/shank_fade_out.png';

export default class SplashScreen extends BaseComponent {

    static navigationOptions = ({navigation}) => ({
        title: 'Splash',
        header: null,
        imageSource: null
    });
    url = '';

    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0)
        };
    };
    componentDidMount() {
        Linking.getInitialURL()
            .then(url => { this.url = url; console.log(this.url) })
            .catch(err => console.error('An error occurred', err));

        this.setState({imageSource: BackgroundSolid});
        Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 2500 }).start(() => {
            Animated.timing(this.state.fadeAnim, { toValue: 0, duration: 2500 }).start(() => {
                this.setState({imageSource: BackgroundTransparent});
                Animated.timing(this.state.fadeAnim, { toValue: 1, duration: 2500 }).start(() => {
                    Animated.timing(this.state.fadeAnim, { toValue: 0, duration: 2500 }).start(() => {
                        AsyncStorage.getItem(Constants.FIRST_TIME).then(firstTime => {
                            if(firstTime) {
                                this.props.navigation.navigate('Main', {url: this._handleRedirects(this.url), auth: true})
                            } else {
                                AsyncStorage.setItem(Constants.FIRST_TIME, 'no');
                                this.props.navigation.navigate('Slider', {url: this._handleRedirects(this.url), auth: false})
                            }
                        });
                    });
                });
            });
        });
    };
    componentWillUnmount() { clearTimeout(this.timeoutHandle); };

    _handleRedirects = (url) => {
        let query = url.replace(Constants.LINKING_URI + '+', '');
        let data;
        if (query) {
            data = qs.parse(query);
            if(!data['tag']){
                data = '';
            }
        } else {
            data = '';
        }
        return data;
    }

    render() {
        let { fadeAnim } = this.state;
        return (
            <View style={[MainStyles.container, LocalStyles.container]}>
                <StatusBar hidden={false}/>
                <Animated.View style={{opacity: fadeAnim}}>
                    <Image source={this.state.imageSource} style={[MainStyles.iconXLG]}/>
                </Animated.View>
            </View>
        );
    }

}
