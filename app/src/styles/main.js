import { Dimensions, Platform, StyleSheet } from 'react-native';
import Style from './Stylesheet';
import * as Constants from '../core/Constants';

const isAndroid = Platform.OS == 'android' ? true : false;
const { width, height } = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;

const MainStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Constants.BACKGROUND_COLOR
    },
    outerContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Constants.BACKGROUND_COLOR,
    },
    background: {
        backgroundColor: Constants.BACKGROUND_COLOR
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
        borderColor: Constants.TERTIARY_COLOR_ALT,
        borderRadius: 0,
        borderWidth: 1,
        color: Constants.PRIMARY_COLOR,
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
        borderColor: Constants.TERTIARY_COLOR_ALT,
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
    button: {
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: Style.EM(0.5),
        marginTop: Style.EM(0.5),
        padding: Style.EM(1),
        width: '100%'
    },
    buttonText: {
        color: Constants.TERTIARY_COLOR,
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
        color: Constants.PRIMARY_COLOR,
        fontSize: Style.EM(1)
    },
    success: {
        backgroundColor: Constants.SUCCESS_COLOR
    },
    textSuccess: {
        color: Constants.SUCCESS_COLOR
    },
    error: {
        backgroundColor: Constants.ERROR_COLOR
    },
    textError: {
        color: Constants.ERROR_COLOR
    },
    facebook: {
        backgroundColor: '#3B5998'
    },
    tertiary: {
        backgroundColor: Constants.TERTIARY_COLOR
    },
    headerIconButton: {
        color: Constants.TERTIARY_COLOR,
        fontSize: Style.EM(1.5),
        paddingLeft: Style.EM(0.5),
        paddingRight: Style.EM(0.5)
    },
    noMargin: {
        margin: 0
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
        color: '#556E3E',
    },
    centeredObject: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    shankTitle: {
        fontSize: Style.FONT_50,
        color: Constants.TERTIARY_COLOR,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    medShankFont: {
        fontSize: Style.FONT_19,
        color: Constants.TERTIARY_COLOR,
        textAlign: 'center',
    },

    smallShankFont: {
        fontSize: Style.FONT_13,
        color: Constants.TERTIARY_COLOR,
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

export default MainStyles;
