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
    groupsNone: {
        fontSize: 15,
        textAlign: 'center',
        margin: 10,
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
        marginTop: 50,
        backgroundColor: 'rgba(0,0,0,.6)',
    },
    medShankFont: {
        fontSize: Style.FONT_19,
        color: '#fff',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,.6)',
        marginBottom: 90,
    },
    smallShankFont: {
        fontSize: Style.FONT_13,
        color: '#fff',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,.6)',
    },

    shankGray: {
        color: '#3C4635'
    },
    shankBlue: {
        color: '#1D222D'
    },
    greenMedShankFont: {
        fontSize: Style.FONT_16,
        color: '#556E3E'
    },
    goldenShankButton: {
        padding: Style.PADDING,
        fontSize: Style.FONT_16,
        color: '#A39534'
    },
    loginInput: {
        height: 50,
        marginTop: 10,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 0,
        color: '#A39534'
    },
    startButton: {
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#fff',
        width: Style.LG,
        color: '#556E3E',
        marginBottom: 90,

    },
});

export default MainStyles;