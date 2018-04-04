import { StyleSheet, Dimensions } from 'react-native';
import Style from './Stylesheet';
import * as AppConst from '../core/AppConst';

const width = Dimensions.get('window').width;

export default MainStyles = StyleSheet.create({
    button: {
        alignItems: 'center',
        borderRadius: Style.EM(0.5),
        //marginVertical: Style.EM(0.5),
        padding: Style.EM(0.8),
        width: '100%'
    },
    buttonText: {
        fontFamily: 'century-gothic',
        color: AppConst.COLOR_WHITE,
        fontSize: Style.EM(1)
    },
    primary: {
        backgroundColor: AppConst.COLOR_BLUE
    },
    success: {
        backgroundColor: AppConst.COLOR_SUCCESS
    },
    textSuccess: {
        color: AppConst.COLOR_SUCCESS
    },
    error: {
        backgroundColor: AppConst.COLOR_RED
    },
    textError: {
        color: AppConst.COLOR_RED
    },




    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    outerContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    stretchContainer :{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    centerText: {
        textAlign: 'center',
    },
    formInput: {
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
        paddingTop: Style.EM(0.75),
        width: '100%'
    },
    formPicker: {
        borderColor: AppConst.COLOR_GRAY,
        borderRadius: 0,
        borderWidth: 1,
        height: Style.EM(2.5),
        marginBottom: Style.EM(0.5),
        marginTop: Style.EM(0.5),
        paddingBottom: Style.EM(0.75),
        paddingLeft: Style.EM(1),
        paddingRight: Style.EM(1),
        paddingTop: Style.EM(0.75),
        width:'100%'
    },
    formPickerText: {
        fontSize: Style.EM(1),
        color: AppConst.COLOR_BLUE
    },
    buttonVerticalPadding: {
        paddingBottom: Style.EM(0.5),
        paddingTop: Style.EM(0.5)
    },
    buttonText: {
        fontFamily: 'century-gothic',
        color: AppConst.COLOR_WHITE,
        fontSize: Style.EM(1)
    },
    buttonLink: {
        alignItems: 'center',
        backgroundColor: 'transparent',
        margin: 0,
        padding: 0,
        width: '100%'
    },
    buttonLinkText: {
        color: AppConst.COLOR_BLUE,
        fontSize: Style.EM(1),
        marginTop: Style.EM(0.5)
    },
    primary: {
        backgroundColor: AppConst.COLOR_BLUE
    },
    success: {
        backgroundColor: AppConst.COLOR_SUCCESS
    },
    textSuccess: {
        color: AppConst.COLOR_SUCCESS
    },
    error: {
        backgroundColor: AppConst.COLOR_RED
    },
    textError: {
        color: AppConst.COLOR_RED
    },
    facebook: {
        backgroundColor: '#3B5998'
    },
    tertiary: {
        backgroundColor: AppConst.COLOR_WHITE
    },
    tabBarIcon: {
        color: AppConst.COLOR_WHITE,
        fontSize: Style.EM(1)
    },
    headerIconButtonContainer: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerIconButton: {
        color: AppConst.COLOR_WHITE,
        fontSize: Style.EM(1.5),
        paddingLeft: Style.EM(0.5),
        paddingRight: Style.EM(0.5)
    },
    noBorder: {
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0
    },
    noMargin: {
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0
    },
    noPadding: {
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0
    },
    withoutGroupsButton: {
        height: '100%',
        width: '100%'
    },
    withoutGroups: {
        color: AppConst.COLOR_GRAY,
        fontSize: Style.EM(1)
    },
    placeholderText: {
        color: AppConst.COLOR_GRAY,
        fontSize: Style.EM(0.75)
    },
    viewFlexItems: {
        flex: 1,
        height: '100%',
        width: '100%'
    },
    viewFlexItemsR: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewFlexItemsC: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewFlexItemsStart: {
        alignItems: 'flex-start'
    },
    viewFlexItemsEnd: {
        alignItems: 'flex-end'
    },
    listItem: {
        padding: 20,
        borderBottomWidth: 1.5,
        borderColor: AppConst.COLOR_GRAY
    },
    groupsNone: {
        fontSize: Style.FONT_15,
        color: 'black'
    },
    iconXLG: {
        width: Style.iconXLG,
        height: Style.iconXLG,
    },
    iconLG: {
        width: Style.iconLG,
        height: Style.iconLG,
    },
    iconMD: {
        width: Style.iconMD,
        height: Style.iconMD,
    },
    iconSM: {
        width: Style.iconSM,
        height: Style.iconSM,
    },
    iconXS: {
        width: Style.iconXS,
        height: Style.iconXS,
    },
    shankGreen: {
        color: '#516740',
    },
    centeredObject: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    shankTitle: {
        fontSize: Style.FONT_50,
        color: AppConst.COLOR_WHITE,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    medShankFont: {
        fontSize: Style.FONT_19,
        color: AppConst.COLOR_WHITE,
        textAlign: 'center',
    },

    smallShankFont: {
        fontSize: Style.FONT_13,
        color: AppConst.COLOR_WHITE,
        textAlign: 'left',
    },
    smallShankBlackFont: {
        fontSize: Style.FONT_13,
        color: '#000',
    },
    medShankBlackFont: {
        fontSize: Style.FONT_16,
        color: '#000',
    },
    mediumShankGreenFont: {
        fontSize: Style.FONT_14,
        color: '#556E3E',
    },
    shankGray: {
        color: '#3C4635'
    },
    shankBlue: {
        color: '#1D222D'
    },
    greenMedShankFont: {
        fontSize: Style.FONT_16,
        color: '#556E3E',
    },
    leftText: {
        textAlign: 'left',
    },

    goldenShankButton: {
        alignItems: 'center',
        paddingBottom: Style.SMALL_PADDING,
        paddingTop: Style.SMALL_PADDING,
        width: '70%',
        marginTop: Style.PX_15,
        backgroundColor: '#A39534',
        borderRadius: 10
    },
    goldenShankButtonPayment: {
        alignItems: 'center',
        paddingBottom: Style.XS_SMALL_PADDING,
        paddingTop: Style.XS_SMALL_PADDING,
        width: '55%',
        marginVertical: '3%',
        backgroundColor: '#A39534',
        borderRadius: 10
    },
    goldenShankAddGroupButton: {
        alignItems: 'center',
        paddingBottom: Style.SMALL_PADDING,
        paddingTop: Style.SMALL_PADDING,
        width: '26%',
        backgroundColor: '#A39534',
        borderRadius: 10
    },
    loginInput: {
        width: '80%',
        marginTop: Style.PX_15,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#rgba(0, 0, 0, .2)',
        borderRadius: 0,
        color: '#333'
    },
    fbButton: {
        width: '70%',
        paddingBottom: Style.SMALL_PADDING,
        paddingTop: Style.SMALL_PADDING,
        backgroundColor: '#3B5998',
        marginTop: 15,
        alignItems: 'center',
        borderRadius: 10,
    },
    startButton: {
        backgroundColor: '#556E3E',
        width: Style.LG,
        justifyContent: 'center',
        marginBottom: 7,
        borderRadius: 10,
    },
    inputTopSeparation: {
        marginTop: Style.PX_14,
    },
    imageOpacity: {
        backgroundColor: 'rgba(0,0,0,.4)'
    },
    listRenderSeparator : {
        height: 1,
        width: "76%",
        backgroundColor: "#CED0CE",
        marginBottom: "5%",
        marginHorizontal: '10%'
    }
});
