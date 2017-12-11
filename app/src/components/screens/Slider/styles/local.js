import { Dimensions, Platform, StyleSheet } from 'react-native';
import Style from '../../../../styles/Stylesheet';

import * as Constants from '../../../../core/Constants';
const {width, height} = Dimensions.get('window');

const LocalStyles = StyleSheet.create({
    slide: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverImage: {
        width,
        flex: 1
    },
    startButton: {
        bottom:'12.5%',
        position:'absolute',
        width: '80%'
    }
});

export default LocalStyles;
