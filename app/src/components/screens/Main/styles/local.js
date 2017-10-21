import {Dimensions, Platform, StyleSheet} from 'react-native';

const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;
import Style from '../../../../styles/Stylesheet';

const LocalStyles = StyleSheet.create({
    containerMain: {
        backgroundColor: '#fff',
        flex:1
    },
    avatarList: {
        width: Style.MD,
        height: Style.MD,
        borderRadius: Style.MD/2
    },
    roundAvatar: {
        width: Style.iconSM,
        height: Style.iconSM,
        borderRadius: Style.iconSM/2,
    },
    containerRoundAvatar: {
        height: Style.iconSM,
        width: Style.iconSM,
        borderRadius: Style.iconSM/2,
        marginVertical:'10%'
    },
    overlayRoundAvatar: {
        backgroundColor: 'transparent',
    },
    containerList: {
        height: Style.INPUT_INSIDE_BUBBLE,
    },
    titleMainList: {
       fontSize: Style.FONT_LARGE,
       color: "#556E3E",
    },
    subTitleMainList: {
        fontSize: Style.FONT_MEDIUM,
        color: "#BFBFBF",
        marginLeft:'2.5%'
    },
    buttonStart: {
        width: '100%',
        paddingBottom:12,
        paddingTop: 12,
        borderWidth: 2,
        borderColor: '#c2c2c2',
        borderRadius: 10,
        alignItems: 'center',
    },
});

export default LocalStyles;