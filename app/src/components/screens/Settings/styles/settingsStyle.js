import { StyleSheet } from 'react-native';
import * as AppConst from 'Core/AppConst';
import Style from 'ShankStyle';

export default StyleSheet.create({
    mainContainer: {
        width:'100%',
        height: '100%',
        backgroundColor: AppConst.COLOR_WHITE
    },
    mainSubview: {
        width: '100%',
        alignItems: 'center'
    },
    list: {
        width: '100%'
    },
    listRowView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: '5%'
    },
    listRowText: {
        flex: 15,
        fontFamily: Style.CENTURY_GOTHIC_BOLD,
        fontSize: Style.FONT_16,
        color: AppConst.COLOR_BLUE,
        paddingVertical: '5%'
    },
    listRowCaret: {
        flex: 1,
        aspectRatio: 1
    }
});