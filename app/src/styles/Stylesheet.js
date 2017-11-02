'use strict';

import React from 'react';
import {Dimensions, Platform, PixelRatio} from 'react-native';

const isAndroid = Platform.OS == 'android' ? true : false;

// Precalculate Device Dimensions for better performance
const x = Dimensions.get('window').width;
const y = Dimensions.get('window').height;

const baseWidth = 320;
const baseHeight = 480;

const em_unit = 0.875 / baseWidth;

// Calculating ratio from iPhone breakpoints
//const ratioX = x < 375 ? (x < 320 ? 0.75 : 0.875) : 1 ;
//const ratioY = y < 568 ? (y < 480 ? 0.75 : 0.875) : 1 ;

const ratioX = x * em_unit;
const ratioY = y * em_unit;

// We set our base font size value
const base_unit = 16;

// We're simulating EM by changing font size according to Ratio
const unit = base_unit * ratioX;

// We add an em() shortcut function
function em(value) {
    return unit * value;
}

function normalize(size) {
    if (Platform.OS === 'ios') {
        return Math.round(PixelRatio.roundToNearestPixel(size))
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(size)) - 2
    }
}

// Then we set our styles with the help of the em() function
const Style = {

    // GENERAL
    DEVICE_WIDTH: x,
    DEVICE_HEIGHT: y,
    RATIO_X: ratioX,
    RATIO_Y: ratioY,
    UNIT: em(1),
    PADDING: em(1.25),
    SMALL_PADDING: em(0.8),

    // CARD
    CARD_WIDTH: x - em(1.25) * 2,
    CARD_HEIGHT: (x - em(1.25) * 2) * (3 / 5),
    CARD_PADDING_X: em(1.875),
    CARD_PADDING_Y: em(1.25),


    //FONT_PIXEL_RATIO

    FONT_MINI: normalize(12),

    FONT_SMALL:normalize(15),
    FONT_MEDIUM: normalize(17),
    FONT_LARGE: normalize(20),
    FONT_XLARGE: normalize(24),

    // FONT
    FONT_SIZE: em(1),
    FONT_SIZE_SMALLER: em(0.75),
    FONT_SIZE_SMALL: em(0.875),
    FONT_SIZE_TITLE: em(1.25),
    FONT_12: em(0.45),
    FONT_13: em(0.55),
    FONT_14: em(0.70),
    FONT_15: em(0.85),
    FONT_16: em(1),
    FONT_16_5: em(1.075),
    FONT_17: em(1.15),
    FONT_18: em(1.30),
    FONT_19: em(1.45),
    FONT_20: em(1.60),
    FONT_21: em(1.75),
    FONT_22: em(1.90),
    FONT_23: em(2.05),
    FONT_24: em(2.20),
    FONT_25: em(2.35),
    FONT_26: em(2.50),
    FONT_27: em(2.65),
    FONT_27_5: em(2.85),
    FONT_28: em(2.80),
    FONT_29: em(2.95),
    FONT_30: em(3.10),
    FONT_50: em(4.70),
    FONT_55: em(5.45),
    FONT_60: em(6.20),
    //PX
    PX_10: em(0.69),
    PX_12: em(0.89),
    PX_13: em(1.25),
    PX_14: em(1.40),
    PX_15: em(1.55),
    PX_26: em(2.50),
    PX_28: em(2.80),
    PX_30: em(3.10),
    PX_31: em(3.25),
    PX_32: em(3.40),
    PX_33: em(3.55),
    PX_34: em(3.70),
    PX_35: em(3.85),
    PX_36: em(4), //45.5 px
    //BUTTONS
    XLG: em(22),
    LG: em(18),
    MD: em(15),
    SM: em(10),
    XS: em(6.25),
    //RADIUS
    RAD_MD: em(15) / 2,
    //Horizontal SPACES
    HS_10: em(0.625),
    //ICONS
    iconXXXLG: em(15),
    iconXXLG: em(12),
    iconXLG: em(9),
    iconLG: em(7),
    iconMD: em(4),
    iconSM: em(2),
    iconXS: em(1.5),
    //HEIGHT
    INPUT_INSIDE_BUBBLE: em(3),
    INPUT_MULTILINE_INSIDE_BUBBLE: Platform.OS == 'android' ? em(5) : em(3),
};

export default Style;