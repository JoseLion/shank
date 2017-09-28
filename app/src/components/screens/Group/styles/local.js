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
        width:  Style.iconLG,
        height: Style.iconLG,
        marginTop: '5%',
        alignItems: 'center',
    },
    groupImage:{
        width:  Style.iconMD,
        height: Style.iconMD,
        borderRadius: Style.iconMD / 2,
        borderColor: '#A39534',
    },
    tournamentPicker: {
        height: 50,
        width:'80%',
        borderWidth: 2,
        borderColor: '#rgba(0, 0, 0, .2)',
        borderRadius: 0,
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
        height: 50,
        width:'80%',
        borderWidth: 2,
        borderColor: '#rgba(0, 0, 0, .2)',
        borderRadius: 0,
        padding: 5,
        fontSize: 18,
        color: '#333'
    },
    buttonText: {
        color: '#fff',
        fontSize: Style.FONT_15
    }
});

export default LocalStyles;