/**
 * Created by MnMistake on 9/27/2017.
 */
import React from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

export const AUTH_TOKEN = "shank-auth-token";
export const USER_PROFILE = 'shank-profile';
export const TIME_OUT_NOTIFIER = 10000;
// export const APP_FB_ID = '1905648309688579'; chino enviroment
export const APP_FB_ID = '135776033719994'; //chris enviroment 135776033719994

export const APIKEYNEWS = '992cdafbd3be4e3892828a84328873a6';
/*export const API_KEY_SPORT_RADAR = 'vs9dk4wn7egcvbjta4ysnjkf'; //CADUCADA*/
/*export const API_KEY_SPORT_RADAR = 'vs9dk4wn7egcvbjta4ysnjkf'; CADUCADAagain*/
/*export const API_KEY_SPORT_RADAR = 'put7549btxtzk6hbcbrmfnjh'; new*/
/*export const API_KEY_SPORT_RADAR = 'rtqrpe23fn6pe9dhtm4shcc5'; new*/
export const API_KEY_SPORT_RADAR = 'rtqrpe23fn6pe9dhtm4shcc5';
export const LINKING_URI = 'exp://expo.io/@mnmistake123/your-app-slug/';
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