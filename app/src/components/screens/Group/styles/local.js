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
    addPhotoLogo: {
        width: Style.iconLG,
        height:Style.iconLG,
        position:'absolute',
        top:'55%',
        left:'55%',
        backgroundColor: '#1D222D',
    },
});

export default LocalStyles;