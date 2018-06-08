import { StyleSheet, Platform } from 'react-native';
import Style from 'ShankStyle';
import * as AppConst from 'Core/AppConst';

const isAndroid = Platform.OS == 'android';

export default ViewStyle = StyleSheet.create({
    mainContainer: {
        width: '100%',
        height: '100%'
    },
    scrollView: {
        alignItems: 'center'
    },
    mainView: {
        flex: 1,
        paddingHorizontal: '10%',
        width: '100%',
        justifyContent: 'space-between'
    },
    imageView: {
        alignItems: 'center',
        paddingVertical: Style.EM(1.5)
    },
    photoImage: {
        width: Style.EM(7),
        height: Style.EM(7),
        borderRadius: Style.EM(7) / 2.0,
        marginBottom: Style.EM(0.5)
    },
    imageText: {
        fontFamily: Style.CENTURY_GOTHIC,
        fontSize: Style.FONT_14,
        color: AppConst.COLOR_GRAY
    },
    formInput: {
        fontFamily: Style.CENTURY_GOTHIC,
        borderColor: AppConst.COLOR_GRAY,
        borderRadius: 0,
        borderWidth: 1,
        color: AppConst.COLOR_BLUE,
        fontSize: Style.EM(1),
        marginBottom: Style.EM(0.5),
        marginTop: Style.EM(0.5),
        paddingBottom: Style.EM(0.75),
        paddingLeft: Style.EM(1),
        paddingRight: Style.EM(1),
        paddingTop: Style.EM(0.75)
    },
    pickerView: {
        width: '100%',
        height: isAndroid ? Style.EM(2.75) : Style.EM(6),
        justifyContent: 'center',
        borderColor: AppConst.COLOR_GRAY,
        borderRadius: 0,
        borderWidth: 1,
        marginBottom: Style.EM(0.5),
        marginTop: Style.EM(0.5),
        paddingLeft: Style.EM(0.5)
    },
    pickerItem: {
        height: isAndroid ? Style.EM(2.75) : Style.EM(6),
        fontFamily: Style.CENTURY_GOTHIC,
        fontSize: Style.FONT_16
    }
});