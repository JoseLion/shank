import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

export const LINKING_URI = 'shank://';

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

export const FANTASY_DATA_API_KEY_1 = '519f4de87ff044afb2796f57a6583a4d';
export const FANTASY_DATA_API_KEY_2 = '05a7d256639b4059905a5fb8ffc5f68f';
export const FANTASY_DATA_API_KEY = `${FANTASY_DATA_API_KEY_1}`;

export const APIKEYNEWS = '992cdafbd3be4e3892828a84328873a6';
export const API_KEY_SPORT_RADAR = '4a9rhy2uask7zyvw537xvt6q';
export const SPORT_RADAR_GET_TOURNAMENTS = 'http://api.sportradar.us/golf-t2/schedule/${tour}/${year}/tournaments/schedule.json?api_key=${apiKey}';
export const DismissKeyboardHOC = (Comp) => {
    return ({ children, ...props }) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Comp { ...props }>
                { children }
            </Comp>
        </TouchableWithoutFeedback>
    );
};