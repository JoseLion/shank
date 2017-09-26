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
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'transparent'
    },
    text: {
        color: '#556E3E',
        fontSize: Style.FONT_16,
        fontWeight: 'bold',
        textAlign: 'center',

    },
    smallShankFont: {
        fontSize: Style.FONT_13,
        color: '#fff',
        textAlign: 'left',
        alignItems: 'center',
        flex:1,
        backgroundColor: 'rgba(0,0,0,.6)',
        marginTop:50,
    },
    shankLogo: {
        width: Style.iconXLG,
        flex: 1,
        backgroundColor: 'transparent',
    },
    coverImage: {
        width,
        flex: 1
    },
    plusIcon: {},
    shankTitle: {
        fontSize: Style.FONT_30,
        color: '#fff',
        textAlign: 'center',
        marginTop: 50,
        backgroundColor: 'rgba(0,0,0,.6)',
        fontWeight: 'bold',
    },
    medFont: {
        fontSize: Style.FONT_18,
        color: '#fff',
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,.6)',

    },
    smallFont: {
        fontSize: Style.FONT_13,
        color: '#fff',
        textAlign: 'left',
        backgroundColor: 'rgba(0,0,0,.6)',
        margin:100,
    },
    buttonStart: {
        height: 50,
        width: '80%',
        marginBottom: Style.FONT_55,
        padding: 4,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 10,
        backgroundColor:'#fff',
        position:'absolute',
        bottom:0,
    },
});

export default LocalStyles;