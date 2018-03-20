import { Dimensions, Platform, StyleSheet } from 'react-native';
import Style from '../../../../styles/Stylesheet';

import * as AppConst from '../../../../core/AppConst';


const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;

export default ViewStyle = StyleSheet.create({
    groupInformation: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '5%',
        paddingHorizontal: '2.5%'
    },
    groupHeader: {
        flex:3,
        flexDirection: 'column',
        justifyContent: 'space-around',
        paddingVertical: '5%',
        paddingHorizontal: '2.5%'
    },
    groupNameText: {
        fontFamily: 'century-gothic',
        fontSize: Style.FONT_18,
        color: AppConst.COLOR_BLUE
    },
    tournamentNameText: {
        fontFamily: 'century-gothic-bold',
        fontSize: Style.FONT_16,
        marginRight: '2%'
    },
    prizeView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2.5%',
        borderBottomWidth: 1,
        borderBottomColor: AppConst.COLOR_GRAY,
    },
    prizeSubView: {
        flex: 1,
        flexDirection:'column',
        paddingVertical: '5%',
        paddingHorizontal: '2.5%'
    },
    prizeText: {
        fontFamily: 'century-gothic-bold',
        fontSize: Style.FONT_16,
        marginBottom: '1%'
    },
    prizeDescription: {
        fontFamily: 'century-gothic',
        fontSize: Style.FONT_16
    },
    groupStats: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: '5%',
        paddingVertical: '2.5%'
    },
    statView: {
        flex: 1,
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    statNumber: {
        fontFamily: 'century-gothic',
        fontSize: Style.FONT_22,
        color: AppConst.COLOR_GREEN
    },
    statLabel: {
        fontFamily: 'century-gothic',
        fontSize: Style.FONT_15,
        color: AppConst.COLOR_GRAY
    },
    tabsView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '#B3BEC9'
    },
    tabButton: {
        flex: 1,
        paddingVertical: '5%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    rankColumnText: {
        fontFamily: 'century-gothic-bold',
        fontSize: Style.FONT_14,
        color: AppConst.COLOR_BLUE,
        paddingTop: '5%',
        paddingBottom: 0,
        paddingLeft: '10%'
    },
    leaderboardList: {
        paddingTop: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0
    },
    leaderboardRow: {
        paddingVertical: '7.5%',
        borderBottomWidth: 1,
        borderColor: AppConst.COLOR_GRAY
    },
    leaderboardRowView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leaderboardRowText: {
        fontFamily: 'century-gothic',
        fontSize: Style.FONT_16
    },
    leaderboardRowPts: {
        fontFamily: 'century-gothic-bold',
        fontSize: Style.FONT_15,
        color: AppConst.COLOR_GRAY,
        textAlign: 'right'
    },
    swipeButton: {
        backgroundColor: AppConst.COLOR_RED,
        height: '100%',
        justifyContent: 'center'
    },
    swipeButtonText: {
        fontFamily: 'century-gothic',
        fontSize: Style.FONT_17,
        color: AppConst.COLOR_WHITE,
        marginHorizontal: '5%'
    },
    roundLabelsView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: '3%'
    },
    roundsText: {
        marginRight: '2%',
        fontSize: Style.FONT_14
    },
    roundLabel: {
        marginLeft: '1%',
        marginRight: '1%',
        paddingTop: '0.5%',
        paddingBottom: '0.5%',
        paddingLeft: '2%',
        paddingRight: '2%',
        borderWidth: 1,
        borderRadius: 100
    },
    roundLabelText: {
        color: 'white',
        fontSize: Style.FONT_14
    },
    cellMainView: {
        flex: 1,
        paddingHorizontal: '10%'
    },
    cellSubview: {
        opacity: 1.0,
        borderWidth: 0,
        borderColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: AppConst.COLOR_GRAY,
        paddingVertical: '7.5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    roasterPosition: {
        fontFamily: 'century-gothic',
        fontSize: Style.FONT_16,
        color: AppConst.COLOR_GREEN
    },
    roasterEmpty: {
        fontFamily: 'century-gothic',
        fontSize: Style.FONT_16,
        color: AppConst.COLOR_GRAY,
        textAlign: 'center'
    },
    roasterName: {
        fontFamily: 'century-gothic',
        fontSize: Style.FONT_16,
        color: AppConst.COLOR_GREEN,
    },
    roasterInfo: {
        fontFamily: 'century-gothic-bold',
        fontSize: Style.FONT_15,
        color: AppConst.COLOR_GRAY
    },
    tabViewContainer: {
        backgroundColor: AppConst.COLOR_WHITE,
        height:'100%',
        width:'100%'
    },
    checkoutButtonView: {
        paddingLeft: '10%',
        paddingRight: '10%',
        paddingBottom: '5%'
    }
});