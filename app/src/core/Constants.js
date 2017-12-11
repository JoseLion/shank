import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

export const BACKGROUND_COLOR = '#F5FCFF';
export const PRIMARY_COLOR = '#252D3B';
export const TERTIARY_COLOR = '#FFFFFF';
export const TERTIARY_COLOR_ALT = '#rgba(0, 0, 0, .2)';

export const SUCCESS_COLOR = '#00B16A';
export const ERROR_COLOR = '#ED2C3E';

export const AUTH_TOKEN = "shank-auth-token";
export const USER_PROFILE = 'shank-profile';
export const TIME_OUT_NOTIFIER = 10000;
export const APP_FB_ID = '520526514985916';

export const APIKEYNEWS = '992cdafbd3be4e3892828a84328873a6';
/*export const API_KEY_SPORT_RADAR = 'vs9dk4wn7egcvbjta4ysnjkf'; //CADUCADA*/
/*export const API_KEY_SPORT_RADAR = 'vs9dk4wn7egcvbjta4ysnjkf'; CADUCADAagain*/
/*export const API_KEY_SPORT_RADAR = 'put7549btxtzk6hbcbrmfnjh'; new*/
/*export const API_KEY_SPORT_RADAR = 'rtqrpe23fn6pe9dhtm4shcc5'; new*/
/*export const API_KEY_SPORT_RADAR = '26s42kdrdh3htxrny27tm5j4'; new*/
export const API_KEY_SPORT_RADAR = '26s42kdrdh3htxrny27tm5j4';
export const LINKING_URI = 'Shank://+';
//export const LINKING_URI = 'exp://192.168.1.3:19000/';
//export const LINKING_URI = 'exp://expo.io/@mnmistake123/your-app-slug/';
/*export const API_KEY_SPORT_RADAR = 'qt7fggrmjfknbte34f2zj83m';*/
export const SPORT_RADAR_GET_TOURNAMENTS = 'http://api.sportradar.us/golf-t2/schedule/${tour}/${year}/tournaments/schedule.json?api_key=${apiKey}';
export const DismissKeyboardHOC = (Comp) => {
    return ({ children, ...props }) => (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Comp {...props}>
                {children}
            </Comp>
        </TouchableWithoutFeedback>
    );
};
