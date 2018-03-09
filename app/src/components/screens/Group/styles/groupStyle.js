import { Dimensions, Platform, StyleSheet } from 'react-native';
import Style from '../../../../styles/Stylesheet';

import * as ShankConstants from '../../../../core/ShankConstants';


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
        color: ShankConstants.PRIMARY_COLOR,
        paddingBottom: '5%',
        marginTop: '-5%'
    },
    tournamentNameText: {
        fontFamily: 'century-gothic-bold',
        fontSize: Style.FONT_16,
        marginRight: '2%',
        paddingTop: '5%'
    },
    prizeView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2.5%',
        borderBottomWidth: 1,
        borderBottomColor: ShankConstants.TERTIARY_COLOR_ALT,
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
        color: ShankConstants.SHANK_GREEN
    },
    statLabel: {
        fontFamily: 'century-gothic',
        fontSize: Style.FONT_15,
        color: ShankConstants.TERTIARY_COLOR_ALT
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '8%',
        paddingBottom: '3%'
    },
    rankColumnText: {
        fontFamily: 'century-gothic-bold',
        fontSize: Style.FONT_14,
        color: ShankConstants.PRIMARY_COLOR,
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
        borderColor: ShankConstants.TERTIARY_COLOR_ALT
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
        color: ShankConstants.TERTIARY_COLOR_ALT,
        textAlign: 'right'
    },
    swipeButton: {
        backgroundColor: '#252D3B',
        height: '100%',
        justifyContent: 'center'
    },
    swipeButtonText: {
        fontFamily: 'century-gothic',
        fontSize: Style.FONT_17,
        color: 'white',
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
        paddingLeft: '10%',
        paddingRight: '10%',
        paddingTop: '0%',
        paddingBottom: '0%',
        borderBottomWidth: 0,
        backgroundColor: 'white'
    },
    cellSubview: {
        borderColor: ShankConstants.TERTIARY_COLOR_ALT,
        paddingVertical: '7.5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    roasterPosition: {
        fontFamily: 'century-gothic',
        fontSize: Style.FONT_16,
        color: ShankConstants.SHANK_GREEN
    },
    roasterEmpty: {
        fontFamily: 'century-gothic',
        fontSize: Style.FONT_16,
        color: ShankConstants.TERTIARY_COLOR_ALT,
        textAlign: 'center'
    },
    roasterName: {
        fontFamily: 'century-gothic',
        fontSize: Style.FONT_16,
        color: ShankConstants.SHANK_GREEN,
    },
    roasterInfo: {
        fontFamily: 'century-gothic-bold',
        fontSize: Style.FONT_15,
        color: ShankConstants.TERTIARY_COLOR_ALT
    },
    tabViewContainer: {
        backgroundColor: 'white',
        height:'100%',
        width:'100%'
    },
    checkoutButtonView: {
        paddingLeft: '10%',
        paddingRight: '10%',
        paddingBottom: '5%'
    }
});