import {Dimensions, Platform, StyleSheet} from 'react-native';

import * as ShankConstants from '../../../../core/ShankConstants';

const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;
import Style from '../../../../styles/Stylesheet';

const LocalStyles = StyleSheet.create({
    navButton: {
        height: '100%',
        paddingHorizontal: (width * 0.05),
        justifyContent: 'center',
        alignItems: 'center'
    },
    navPlusIcon: {
        width: (width * 0.05),
        height: (width * 0.05)
    },
    navUserIcon: {
        width: (width * 0.06),
        height: (width * 0.06)
    },














    headerButton: {
        paddingLeft: Style.EM(0.5),
        paddingRight: Style.EM(0.5)
    },
    titleText: {
        color: ShankConstants.PRIMARY_COLOR,
        fontSize: Style.EM(1),
        fontWeight: '700'
    },
    subtitleText: {
        color: ShankConstants.TERTIARY_COLOR_ALT,
        fontSize: Style.EM(0.75),
        fontWeight: '700'
    },
    trashButton: {
        width: 75,
        paddingLeft: 0,
        paddingRight: 0
    },
    noneButtonView: {
        flex: 2,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    containerMain: {
        backgroundColor: '#fff',
        flex: 1
    },
    avatarList: {
        width: Style.MD,
        height: Style.MD,
        borderRadius: Style.MD / 2
    },
    roundAvatar: {
        width: Style.iconSM,
        height: Style.iconSM,
        borderRadius: Style.iconSM / 2,
    },
    touchableUserIcon: {
        alignItems: 'center',
        height: '100%',
        padding: Style.ICON_PADDING,
    },
    containerRoundAvatar: {
        height: Style.iconSM,
        width: Style.iconSM,
        borderRadius: Style.iconSM / 2,
        marginVertical: '10%'
    },
    overlayRoundAvatar: {
        backgroundColor: 'transparent',
    },
    containerList: {
        height: Style.INPUT_INSIDE_BUBBLE,
    },
    titleMainList: {
        fontSize: Style.FONT_XLARGE,
        color: "#556E3E",
    },
    subTitleMainList: {
        fontSize: Style.FONT_MEDIUM,
        color: "#BFBFBF",
        marginLeft: '2.5%'
    },
    buttonStart: {
        width: '100%',
        paddingBottom: 12,
        paddingTop: 12,
        borderWidth: 2,
        borderColor: '#c2c2c2',
        borderRadius: 10,
        alignItems: 'center',
    },
});

export default LocalStyles;
