import { Dimensions, Platform, StyleSheet } from 'react-native';
import Style from '../../../../styles/Stylesheet';

import * as ShankConstants from '../../../../core/ShankConstants';


const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;

export default ViewStyle = StyleSheet.create({
	checkIsSelected: {
        backgroundColor: ShankConstants.SUCCESS_COLOR,
        color: ShankConstants.TERTIARY_COLOR
    },
    titleStyle: {
        fontSize: Style.FONT_17
    },
    selectedCheck: {
        backgroundColor: ShankConstants.TERTIARY_COLOR,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: ShankConstants.SUCCESS_COLOR,
        paddingLeft: Style.EM(1),
        paddingRight: Style.EM(1),
        color: ShankConstants.SUCCESS_COLOR
    }
});