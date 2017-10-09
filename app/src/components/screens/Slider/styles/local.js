import {Dimensions, Platform, StyleSheet} from 'react-native';

const isAndroid = Platform.OS == 'android' ? true : false;
import MainStyles from '../../../../styles/main';

const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;
import Style from '../../../../styles/Stylesheet';

const LocalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapper: {},
    slide: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#556E3E',
        fontSize: Style.FONT_16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    coverImage: {
        width,
        flex: 1
    },
    plusIcon: {},
    titleTxtSlideOne: {
        fontSize: Style.FONT_30,
        color:'#556E3E',
        textAlign: 'center',
        marginTop: '10%',
        fontWeight: 'bold',
    },
    medTxtSlideOne: {
        fontSize: Style.FONT_18,
        color: '#556E3E',
        textAlign: 'center',
    },
    positionTextSlideOne: {
        position:'absolute',
        top:'30%',
        left:'30%',
    },
    botTxtSlideOne: {
        fontSize: Style.FONT_14,
        color: '#556E3E',
        textAlign: 'left',
    },
    shankLogoSlideOne: {
        width: Style.iconXXXLG,
        height:Style.iconXXXLG,
        position:'absolute',
        bottom:'-3%',
        right:'25%',
        backgroundColor: 'transparent',
    },
    titleTxtSlideTwo: {
        fontSize: Style.FONT_30,
        color: '#fff',
        textAlign: 'center',
        marginTop: '10%',
        fontWeight: 'bold',
    },
    medTxtSlideTwo: {
        fontSize: Style.FONT_18,
        color: '#fff',
        textAlign: 'center',
    },
    positionTextSlideTwo: {
        position:'absolute',
        bottom:'38%',
        left:'60%',
    },
    botTxtSlideTwo: {
        fontSize: Style.FONT_14,
        color: '#556E3E',
        textAlign: 'left',
    },
    shankLogoSlideTwo: {
        width: Style.iconXXXLG,
        height:Style.iconXXXLG,
        position:'absolute',
        right:'-17%',
        bottom:"-3%",
        backgroundColor: 'transparent',
    },
    titleTxtSlideThree: {
        fontSize: Style.FONT_30,
        color: '#fff',
        textAlign: 'center',
        marginTop: '10%',
        fontWeight: 'bold',
    },
    medTxtSlideThree: {
        fontSize: Style.FONT_18,
        color: '#fff',
        textAlign: 'center',
    },
    positionTextSlideThree: {
        position:'absolute',
        bottom:'50%',
        left:'39%',
    },
    botTxtSlideThree: {
        fontSize: Style.FONT_14,
        color: '#fff',
        textAlign: 'left',
    },
    shankLogoTopSlideThree: {
        width: Style.iconXXLG,
        height:Style.iconXXLG,
        position:'absolute',
        top:'2%',
        right:'-24%',
        backgroundColor: 'transparent',
    },
    shankLogoBotSlideThree: {
        width: Style.iconXXLG,
        height:Style.iconXXLG,
        position:'absolute',
        bottom:'15%',
        left:'-24%',
        backgroundColor: 'transparent',
    },
    buttonStart: {
        width: '80%',
        paddingBottom:Style.PX_12,
        paddingTop: Style.PX_12,
        borderWidth: 1,
        borderColor: '#fff',
        borderRadius: 10,
        backgroundColor:'#fff',
        position:'absolute',
        bottom:'7%',
    },
});

export default LocalStyles;