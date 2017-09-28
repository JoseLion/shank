'use strict';

import React, {Component} from 'react';

import {
    Platform,
    Alert,
    AlertIOS,
} from 'react-native';

const currentAlert = Platform.OS == 'android' ? Alert : AlertIOS;

var Notifier = {
    error: function (message) {
        currentAlert.alert(
            'Error',
            message,
            [
                {
                    text: 'Ok',
                    onPress: () => console.log('Tapped OK'),
                }
            ]
        );
    },
    alert: function (message) {
        currentAlert.alert(
            'Alert',
            message,
            [
                {
                    text: 'Ok',
                    onPress: () => console.log('Tapped OK'),
                }
            ]
        );
    },
    message: function (message) {
        currentAlert.alert(
            message.title,
            message.message,
            [
                {
                    text: 'Ok',
                    onPress: () => console.log('Tapped OK'),
                }
            ]
        );
    },
    withoutConnection: function () {
        currentAlert.alert(
            'Offline',
            'There is no internet access available on your phone.',
            [
                {
                    text: 'Ok',
                    onPress: () => console.log('Tapped OK'),
                }
            ]
        );
    },
    requestServerError: function () {
        currentAlert.alert(
            'Error',
            'Server Offline.',
            [
                {
                    text: 'Ok',
                    onPress: () => console.log('Tapped OK'),
                }
            ]
        );
    },
    requestServerParsingResponse: function () {
        currentAlert.alert(
            'ERROR',
            'Request not avaliable.',
            [
                {
                    text: 'Ok',
                    onPress: () => console.log('Tapped OK'),
                }
            ]
        );
    }
};

export {Notifier as default};