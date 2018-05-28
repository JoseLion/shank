import React, { Component } from 'react';
import { View, ActivityIndicator, Animated } from 'react-native';

export default class LoadingIndicator extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            showLoading: this.props.visible,
            opacity: new Animated.Value(0.0)
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.visible) {
            Animated.timing(state.opacity, {toValue: 0.5, duration: 260, delay: 10}).start();
        }

        state.showLoading = props.visible;
        return state;
    }

    render() {
        if (this.state.showLoading) {
            return (
                <Animated.View style={{justifyContent: 'center', alignItems: 'center', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#000', opacity: this.state.opacity, zIndex: 9998}}>
                    <ActivityIndicator animating={this.state.showLoading} color={'#fff'} size="large" />
                </Animated.View>
            );
        }

        return null;
    }
}