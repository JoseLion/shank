import { Dimensions, Platform, StyleSheet } from 'react-native';
import Style from '../../../../styles/Stylesheet';

import * as AppConst from '../../../../core/AppConst';


const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;

export default ViewStyle = StyleSheet.create({
	checkIsSelected: {
        backgroundColor: AppConst.COLOR_SUCCESS,
        color: AppConst.COLOR_WHITE
    },
    titleStyle: {
        fontSize: Style.FONT_17
    },
    selectedCheck: {
        backgroundColor: AppConst.COLOR_WHITE,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: AppConst.COLOR_SUCCESS,
        paddingLeft: Style.EM(1),
        paddingRight: Style.EM(1),
        color: AppConst.COLOR_SUCCESS
    }
});