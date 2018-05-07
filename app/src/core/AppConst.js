import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { ProductSku } from '../config/variables';

export const LINKING_URI = 'comlevelapshank://';
export const SKU = ProductSku;

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

export const API_KEY_SPORT_RADAR = '4a9rhy2uask7zyvw537xvt6q';
export const DismissKeyboardHOC = (Comp) => {
    return ({ children, ...props }) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Comp { ...props }>
                { children }
            </Comp>
        </TouchableWithoutFeedback>
    );
};