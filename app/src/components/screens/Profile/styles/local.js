import {Dimensions, Platform, StyleSheet} from 'react-native';

const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;

const LocalStyles = StyleSheet.create({
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
    createTInput :{
        height: '7%',
        width:'80%',
        borderWidth: 2,
        borderColor: '#rgba(0, 0, 0, .2)',
        borderRadius: 0,
        padding: 5,
        fontSize: 18,
        borderBottomWidth: 0,
        color: '#333'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16
    },
});

export default LocalStyles;