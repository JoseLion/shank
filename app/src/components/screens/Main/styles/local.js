import {Dimensions, Platform, StyleSheet} from 'react-native';

const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;

const LocalStyles = StyleSheet.create({
    buttonStart: {
        width: '100%',
        paddingBottom:12,
        paddingTop: 12,
        borderWidth: 2,
        borderColor: '#c2c2c2',
        borderRadius: 10,
        alignItems: 'center',
    },
});

export default LocalStyles;