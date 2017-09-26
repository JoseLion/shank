import {Dimensions, Platform, StyleSheet} from 'react-native';

const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;

const LocalStyles = StyleSheet.create({
    fbButton :{
        width:'70%',
        backgroundColor: '#3B5998',
        marginTop: 15,
        padding: 4,
        height: 50,
        alignItems: 'center',
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16
    }
});

export default LocalStyles;