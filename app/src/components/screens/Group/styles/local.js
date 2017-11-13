import {Dimensions, Platform, StyleSheet} from 'react-native';
import Style from '../../../../styles/Stylesheet';

const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;

const LocalStyles = StyleSheet.create({
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
        height: '100%',
        backgroundColor:'#rgba(0, 0, 0, .05)',
        padding: Style.ICON_PADDING,
    },
    addNewParticipantOverlay: {
        alignItems: 'center',
        backgroundColor:'#rgba(0, 0, 0, .05)',
        padding: Style.ICON_PADDING,
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
        width: '100%',
        height: '100%'
    },
    positionParticipants: {
        marginRight: '2%',
        fontSize: Style.FONT_15
    },
    participantsList: {
        flex: 1,
    },
    titleStyle: {
        fontSize: Style.FONT_15
    },
    subtitleStyle: {
        fontSize: Style.FONT_12,
        color: '#3F3F3F'
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
    addPhotoLogo: {
        marginTop: '3%',
        alignItems: 'center',
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
        height:'100%'
    },
    listContainer: {paddingHorizontal:'6%'},
    textHeaderPlayerList : {
        textAlign:'center',
        color:'#fff',
        fontWeight:'800',
        fontSize:Style.FONT_SMALL
    },
    alphabeticalText : {
        color:'#556E3E',
        fontWeight:'800',
        fontSize:Style.FONT_MEDIUM
    },
    viewHeaderPlayerList : {
        backgroundColor: '#556E3E'
    },
});

export default LocalStyles;
