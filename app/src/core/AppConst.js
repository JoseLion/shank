import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ProductSKUs } from '../config/variables';

export const LINKING_URI = 'comelevisionshank://';
export const SKUS = ProductSKUs;

export const COLOR_BLUE = '#252D3B';
export const COLOR_WHITE = '#FFFFFF';
export const COLOR_GRAY = '#B6B6B5';
export const COLOR_GREEN = "#516740";
export const COLOR_SUCCESS = '#00B16A';
export const COLOR_RED = '#ED2C3E';
export const COLOR_HIGHLIGHT = '#E6E7E8';

export const FIRST_TIME = 'first-time';
export const AUTH_TOKEN = "shank-auth-token";
export const USER_PROFILE = 'shank-profile';
export const TIME_OUT_NOTIFIER = 10000;
export const APP_FB_ID = '1840743005946613';
export const FCM_SENDER_ID = '804287418020';

export const EVENTS = {
    logout: 'EVT_LOGOUT',
    showErrorMessageBar: 'EVT_SHOW_ERROR_MESSAGE_BAR',
    realoadGroups: 'EVT_REOAL_GROUPS',
    resetShadowStyle: 'EVT_RESET_SHADOW_STYLE',
    reloadCurrentGroup: 'EVT_RELOAD_CURRENT_GROUP'
};