import {Dimensions, Platform, StyleSheet} from 'react-native';

const isAndroid = Platform.OS == 'android' ? true : false;
import MainStyles from '../../../../styles/main';
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;
import Style from '../../../../styles/Stylesheet';

const LocalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1D222D',

    },
    wrapper: {
    },
    slide1: {
        flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#9DD6EB',


    },
    slide2: {
        flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
            fontSize: 30,
            fontWeight: 'bold',
    },
    coverImage: {
        width,
        flex: 1
    },
    plusIcon: {

    },
});

export default LocalStyles;