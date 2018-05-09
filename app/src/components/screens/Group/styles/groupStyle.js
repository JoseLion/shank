import { StyleSheet } from 'react-native';
import Style from 'ShankStyle';
import * as AppConst from 'Core/AppConst';

export default ViewStyle = StyleSheet.create({
    editButton: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: Style.EM(1)
    },
    editButtonText: {
        fontFamily: Style.CENTURY_GOTHIC,
        fontSize: Style.FONT_16,
        color: AppConst.COLOR_WHITE
    },
    groupInformation: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '5%',
        paddingHorizontal: '2.5%'
    },
    groupImage: {
        width: Style.EM(4),
        height: Style.EM(4),
        borderRadius: Style.EM(4) / 2.0
    },
    groupHeader: {
        flex:3,
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginLeft: '2%',
        paddingRight: '2%'
    },
    groupNameText: {
        fontFamily: Style.CENTURY_GOTHIC,
        fontSize: Style.FONT_17,
        color: AppConst.COLOR_BLUE
    },
    tournamentNameText: {
        fontFamily: Style.CENTURY_GOTHIC_BOLD,
        fontSize: Style.FONT_16,
        width: '92.5%'
    },
    caretDown: {
        width: '7.5%',
        height: '100%'
    },
    prizeView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: AppConst.COLOR_GRAY,
        paddingTop: Style.EM(0.5)
    },
    prizeSubView: {
        flex: 1,
        flexDirection:'column',
        paddingHorizontal: '2.5%'
    },
    prizeText: {
        fontFamily: Style.CENTURY_GOTHIC_BOLD,
        fontSize: Style.FONT_16
    },
    prizeDescription: {
        fontFamily: Style.CENTURY_GOTHIC,
        fontSize: Style.FONT_16,
        paddingBottom: Style.EM(0.5)
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
        fontFamily: Style.CENTURY_GOTHIC,
        fontSize: Style.FONT_22,
        color: AppConst.COLOR_GREEN
    },
    statLabel: {
        fontFamily: Style.CENTURY_GOTHIC,
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
        paddingVertical: Style.EM(1),
        alignItems: 'center',
        justifyContent: 'center'
    },
    rankColumnText: {
        fontFamily: Style.CENTURY_GOTHIC_BOLD,
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
        fontFamily: Style.CENTURY_GOTHIC,
        fontSize: Style.FONT_16
    },
    leaderboardRowPts: {
        fontFamily: Style.CENTURY_GOTHIC_BOLD,
        fontSize: Style.FONT_15,
        color: AppConst.COLOR_GRAY,
        textAlign: 'right'
    },
    swipeButton: {
        backgroundColor: AppConst.COLOR_BLUE,
        height: '100%',
        justifyContent: 'center'
    },
    swipeButtonText: {
        fontFamily: Style.CENTURY_GOTHIC,
        fontSize: Style.FONT_17,
        color: AppConst.COLOR_WHITE,
        marginHorizontal: '5%'
    },
    roundLabelsView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginVertical: '1%',
        marginRight: '10%'
    },
    roundsText: {
        fontFamily: Style.CENTURY_GOTHIC,
        fontSize: Style.FONT_14,
        marginRight: '2%'
    },
    roundLabel: {
        justifyContent: 'center',
        alignItems: 'center',
        width: Style.EM(1.25),
        height: Style.EM(1.25),
        borderRadius: Style.EM(1.25) / 2,
        marginLeft: '1%'
    },
    roundLabelText: {
        fontFamily: Style.CENTURY_GOTHIC,
        fontSize: Style.FONT_15,
        color: 'white',
        backgroundColor: 'transparent'
    },
    cellMainView: {
        flex: 1,
        paddingHorizontal: '10%',
        backgroundColor: AppConst.COLOR_WHITE
    },
    cellSubview: {
        borderBottomWidth: 1,
        borderBottomColor: AppConst.COLOR_GRAY,
        paddingVertical: '7.5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    roasterPosition: {
        fontFamily: Style.CENTURY_GOTHIC,
        fontSize: Style.FONT_16,
        color: AppConst.COLOR_GREEN
    },
    roasterImage: {
        width: Style.EM(2.5),
        height: Style.EM(2.5),
        borderRadius: Style.EM(2.5) / 2
    },
    roasterEmpty: {
        fontFamily: Style.CENTURY_GOTHIC,
        fontSize: Style.FONT_16,
        color: AppConst.COLOR_GRAY,
        textAlign: 'center'
    },
    roasterName: {
        fontFamily: Style.CENTURY_GOTHIC,
        fontSize: Style.FONT_16,
        color: AppConst.COLOR_GREEN,
    },
    roasterInfo: {
        fontFamily: Style.CENTURY_GOTHIC_BOLD,
        fontSize: Style.FONT_15,
        color: AppConst.COLOR_GRAY
    },
    sortImage: {
        width: Style.EM(1.5),
        height: Style.EM(1.5)
    },
    tabViewContainer: {
        backgroundColor: AppConst.COLOR_WHITE,
        height:'100%',
        width:'100%'
    },
    checkoutButtonView: {
        paddingHorizontal: '10%',
        marginVertical: Style.EM(0.5)
    }
});