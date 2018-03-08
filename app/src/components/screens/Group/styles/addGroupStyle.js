import { Dimensions, Platform, StyleSheet } from 'react-native';
import Style from '../../../../styles/Stylesheet';

import * as ShankConstants from '../../../../core/ShankConstants';


const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;

export default ViewStyle = StyleSheet.create({
	formContainer: {
        width: '80%'
    },
	addPhotoLogo: {
        alignItems: 'center',
        marginBottom: Style.EM(1.5),
        marginTop: Style.EM(2.5)
    },
    groupImage:{
        width:  Style.iconMD,
        height: Style.iconMD,
        borderRadius: Style.iconMD / 2,
        borderColor: '#A39534',
    },
    pickerHeight: {
        height: Style.EM(2.5),
        paddingLeft: Style.EM(0.75)
    }
});