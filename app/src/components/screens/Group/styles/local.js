import { Dimensions, Platform, StyleSheet } from 'react-native';
import Style from '../../../../styles/Stylesheet';

import * as ShankConstants from '../../../../core/ShankConstants';


const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;

const LocalStyles = StyleSheet.create({
    formContainer: {
        width: '80%'
    },
    pickerHeight: {
        height: Style.EM(2.5),
        paddingLeft: Style.EM(0.75)
    },
    addPhotoLogo: {
        alignItems: 'center',
        marginBottom: Style.EM(1.5),
        marginTop: Style.EM(2.5)
    },
    groupInformation: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: '5%',
        paddingRight: '5%'
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
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingTop: '5%',
        borderBottomWidth: 1,
        borderBottomColor: ShankConstants.TERTIARY_COLOR_ALT,
        paddingBottom: '5%'
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





    titleText: {
        fontFamily: 'century-gothic-bold',
        fontSize: Style.EM(1),
        color: ShankConstants.PRIMARY_COLOR
    },
    titleTextNumber: {
        fontFamily: 'century-gothic',
        fontSize: Style.EM(1.5)
    },
    subtitleText: {
        fontSize: Style.EM(0.75),
        fontWeight: '700',
        color: ShankConstants.PRIMARY_COLOR
    },
    normalText: {
        fontSize: Style.EM(0.75),
        color: ShankConstants.PRIMARY_COLOR
    },
    trashButton: {
        alignItems: 'center',
        height: '80%',
        justifyContent: 'center',
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        width: 75
    },
    roasterRowHighlight: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1.5,
        borderColor: '#EEEEEE',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    roasterRowView: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    roasterRowPhoto: {
        height: 30,
        width: 30,
        borderRadius: 15
    },
    table: {
        backgroundColor: ShankConstants.BACKGROUND_COLOR
    },
    tableCols: {
        backgroundColor: ShankConstants.BACKGROUND_COLOR,
        height: Style.EM(2.5)
    },
    tableContent: {
        paddingBottom: Style.EM(0.75),
        paddingLeft: Style.EM(1),
        paddingRight: Style.EM(1),
        paddingTop: Style.EM(0.75)
    },
    selectedCheck: {
        backgroundColor: ShankConstants.TERTIARY_COLOR,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: ShankConstants.SUCCESS_COLOR,
        paddingLeft: Style.EM(1),
        paddingRight: Style.EM(1),
        color: ShankConstants.SUCCESS_COLOR
    },
    checkIsSelected: {
        backgroundColor: ShankConstants.SUCCESS_COLOR,
        color: ShankConstants.TERTIARY_COLOR
    },

    //Modal
    modalhead:{
        backgroundColor: '#556E3E',
        width: '70%',
        height:'7%',
        borderRadius: 10,
    },
    modalbody:{
        paddingTop:10,
        alignItems: 'center',
        backgroundColor: 'white',
        width: '70%',
        height: '45%',
        borderRadius: 10,
    },
    modalfooter:{
        paddingTop:10,
        backgroundColor: 'white',
        width: '70%',
    },
    inputModal:{
        width: '50%',
        marginTop: Style.PX_10,
        fontSize: Style.FONT_SMALL,
        borderWidth: 1,
        paddingLeft:5,
        borderColor: '#rgba(0, 0, 0, .2)',
        borderRadius: 0,
        color: '#333',
    },
    goldenShankButton: {
        alignItems: 'center',
        alignContent: 'center',
        paddingBottom: Style.SMALL_PADDING,
        paddingTop: Style.SMALL_PADDING,
        width: '60%',
        marginTop: Style.PX_10,
        marginLeft: Style.PX_10,
        backgroundColor: '#A39534',
        borderRadius: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1D222D',
    },
    dropdown_2_text: {
        marginVertical: 10,
        marginHorizontal: 6,
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',
    },
    participantsTxt: {
        //flex: 1,
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        //marginLeft:'-50%'
    },
    touchableUserIcon: {
        alignItems: 'center',
        height: '115%',
        backgroundColor:'#rgba(0, 0, 0, .05)',
        padding: Style.ICON_PADDING,
    },
    addNewParticipantOverlay: {
        alignItems: 'center',
        backgroundColor:'#rgba(0, 0, 0, .05)',
        padding: Style.ICON_PADDING,
        margin: Style.ICON_PADDING,
    },
    dropdown_2_dropdown: {
        width: 150,
        height: 300,
        borderColor: 'cornflowerblue',
        borderWidth: 2,
        borderRadius: 3,
    },
    List: {
        flex: 2,
        width: '100%',
        height: '80%'
    },
    GroupList: {
        flex: 1,
    },
    cellMainView: {
        paddingLeft: '10%',
        paddingRight: '10%',
        paddingTop: '0%',
        paddingBottom: '0%',
        borderBottomWidth: 0,
        height: 90,
        backgroundColor: 'white'
    },
    cellSubview: {
        borderColor: ShankConstants.TERTIARY_COLOR_ALT,
        paddingTop: '5%',
        paddingBottom: '5%',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    positionParticipants: {
        marginRight: '2%',
        fontSize: Style.FONT_17
    },
    participantsList: {
        flex: 1,
    },
    titleStyle: {
        fontSize: Style.FONT_17
    },
    subtitleStyle: {
        fontSize: Style.FONT_14,
        fontWeight: 'bold',
        color: '#B6B6B5'
    },
    participantsScore: {
        fontSize: Style.FONT_14,
        color: '#3F3F3F'
    },
    addNewParticipant: {
        flex: 1,
        marginTop: 22,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF',
    },
    groupImage:{
        width:  Style.iconMD,
        height: Style.iconMD,
        borderRadius: Style.iconMD / 2,
        borderColor: '#A39534',
    },
    androidTournamentPicker: {
        height: '10%',
        width:'80%',
        borderWidth: 2,
        borderColor: '#rgba(0, 0, 0, .2)',
        borderRadius: 0,
        borderBottomWidth: 0
    },
    androidPickerItem: {
        fontSize: Style.FONT_16,
        color: '#rgba(0, 0, 0, .2)',
    },
    androidTournamentInternal: {
        padding:'4%',
    },
    tournamentPicker: {
        height: '9%',
        width:'80%',
        padding:Style.SMALL_PADDING,
        borderWidth: 2,
        borderColor: '#rgba(0, 0, 0, .2)',
        borderRadius: 0,
        borderBottomWidth: 0
    },
    inputContainer:{

    },
    txtAddPhoto: {
        fontSize: Style.FONT_16,
        color: '#3C4635',
        marginTop: '-9%',
        marginBottom:'4%'
    },
    item: {
        padding: 7,
        fontSize: Style.FONT_13,
        height: 44,
        width:'100%',
        textAlign:'left',
    },
    createTInput :{
        height: '11%',
        width:'80%',
        borderWidth: 2,
        borderColor: '#rgba(0, 0, 0, .2)',
        borderRadius: 0,
        padding: Style.SMALL_PADDING,
        fontSize: Style.FONT_15,
        borderBottomWidth: 0,
        color: '#333'
    },
    innerInput:{
        color: '#rgba(0, 0, 0, .2)',
        fontSize: Style.FONT_15,
    },
    richCreateTInput :{
        height: '14%',
        width:'80%',
        borderWidth: 2,
        borderColor: '#rgba(0, 0, 0, .2)',
        borderRadius: 0,
        padding: Style.SMALL_PADDING,
        fontSize: Style.FONT_15,
        color: '#333'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16
    },
    absoluteFill :{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    singleGroupTitle :{
        fontSize: Style.FONT_15,
        color: '#fff',
    },
    singleGroupTitleBold :{
        fontSize: Style.FONT_16,
        color: '#fff',
        fontWeight: 'bold'
    },
    singleGroupBoxes: {
        width:'100%',
        height: '10%',
        backgroundColor: 'white',
        borderBottomColor: '#2F1C1C',
        borderBottomWidth: 0.7,
        paddingHorizontal: '8%',
        paddingVertical: '3%',
    },
    singleGroupSliderBorder: {
        borderTopColor: '#3c3c3c',
        borderTopWidth: 1.7,
    },
    singleGroupSliderHighlightedBorder: {
        borderTopColor: '#556E3E',
        borderTopWidth: 1.9,
    },
    innerScoreGroupBox:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    singleGroupPrize: {
        fontSize: Style.FONT_15,
        fontWeight: 'bold'
    },
    singleGroupPrizeDescription: {
        fontSize: Style.FONT_14,
    },
    singleGroupScoreTab: {
        fontSize: Style.FONT_15,
        fontWeight: 'bold'
    },
    singleGroupScoreTabDescription: {
        fontSize: Style.FONT_13,
        color: '#3c3c3c',
    },
    singleGroupSliderText: {
        fontSize: Style.FONT_SMALL
    },
    linearGradient: {
        height: '2%',
        width:'100%'
    },
    slideBorderStyle: {
        backgroundColor: 'white',
        height:'100%',
        width:'100%'
    },
    listContainer: {
        paddingHorizontal:'6%'
    },
    textHeaderPlayerList : {
        textAlign:'center',
        color:'#fff',
        fontWeight:'800',
        fontSize:Style.FONT_SMALL
    },
    alphabeticalText: {
        color:'#556E3E',
        fontWeight:'800',
        fontSize:Style.FONT_MEDIUM
    },
    viewHeaderPlayerList: {
        backgroundColor: '#556E3E'
    },
    roundLabelsView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: '3%'
    },
    roundsText: {
        marginRight: '2%',
        fontSize: Style.FONT_16
    },
    roundLabel: {
        marginLeft: '1%',
        marginRight: '1%',
        paddingTop: '0.5%',
        paddingBottom: '0.5%',
        paddingLeft: '2.5%',
        paddingRight: '2.5%',
        borderWidth: 1,
        borderRadius: 100
    },
    roundLabelText: {
        color: 'white',
        fontSize: Style.FONT_16
    },
    checkoutButtonView: {
        paddingLeft: '10%',
        paddingRight: '10%',
        paddingBottom: '5%'
    },
    checkoutTitle: {
        fontWeight: '700',
        fontSize: 20,
        textAlign: 'center',
        paddingTop: 25,
        paddingBottom: 25,
        borderBottomWidth: 3,
        borderBottomColor: ShankConstants.TERTIARY_COLOR_ALT
    },
    checkoutRow: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '8%',
        paddingBottom: '8%',
        paddingLeft: '2%',
        paddingRight: '2%',
        borderBottomWidth: 1,
        borderColor: ShankConstants.TERTIARY_COLOR_ALT
    },
    checkoutNum: {
        fontSize: Style.FONT_15_5,
        fontWeight: 'bold'
    },
    checkoutNames: {
        fontSize: Style.FONT_15_5,
        color: ShankConstants.TERTIARY_COLOR_ALT
    },
    checkoutCost: {
        fontSize: Style.FONT_15_5,
        fontWeight: 'bold',
        textAlign: 'right'
    },
    exchangeIcon: {
        fontSize: Style.FONT_15_5,
        textAlign: 'center'
    }
});

export default LocalStyles;
