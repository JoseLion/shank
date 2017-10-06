import {Dimensions, Platform, StyleSheet} from 'react-native';
import Style from './Stylesheet';

const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;

const MainStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    groupsNone: {
        fontSize: 15,
        color: 'rgba(0,0,0,.2)'
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
    shankTitle: {
        fontSize: Style.FONT_50,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    medShankFont: {
        fontSize: Style.FONT_19,
        color: '#fff',
        textAlign: 'center',
    },

    smallShankFont: {
        fontSize: Style.FONT_13,
        color: '#fff',
        textAlign: 'left',
    },
    smallShankBlackFont: {
        fontSize: Style.FONT_13,
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
    centerText: {
        textAlign: 'center',
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
    loginInput: {
        height: 50,
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
        marginTop: Style.PX_13,
    }
});

export default MainStyles;