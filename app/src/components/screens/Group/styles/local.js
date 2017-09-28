import {Dimensions, Platform, StyleSheet} from 'react-native';
import Style from '../../../../styles/Stylesheet';

const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;

const LocalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1D222D',
    },
    participantsList: {
        flex: 1,
        paddingTop: 20,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF',
        marginLeft:'-50%'
    },
    addNewParticipant: {
        flex: 1,
        paddingTop: 22,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#F5FCFF',
    },
    addPhotoLogo: {
        width: Style.iconMD,
        height:Style.iconMD,
        position:'absolute',
        top:'6%',
        left:'-9%',
    },
    txtAddPhoto: {
        fontSize: Style.FONT_16,
        color: '#3C4635',
        marginTop: '-9%',
        marginBottom:'4%'
    },
    inputTxt: {
        height: 40,
        width:'80%',
        padding: 4,
        fontSize:  Style.FONT_16,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 0,
        color: '#3C4635'
    },
    inputTxtPrize: {
        height: 60,
        width:'80%',
        padding: 4,
        fontSize:  Style.FONT_16,
        borderWidth: 1,
        borderColor: '#48BBEC',
        borderRadius: 0,
        color: '#3C4635'
    },
    buttonCreateGroup: {
        alignItems: 'center',
        width: '80%',
        paddingBottom:Style.PX_12,
        paddingTop: Style.PX_12,
        borderWidth: 1,
        borderColor: '#A39534',
        borderRadius: 10,
        backgroundColor:'#A39534',
        position:'absolute',
        bottom:'3%',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16
    },
    item: {
        padding: 7,
        fontSize: Style.FONT_18,
        height: 44,
        textAlign:'left',
    },
    centerText : {
        textAlign: 'center',
    },
    leftText : {
        textAlign: 'left',
    },
});

export default LocalStyles;