import {Dimensions, Platform, StyleSheet} from 'react-native';

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
    listView: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    card: {
        backgroundColor: 'red',
        width: (width / 2) - 15,
        height: 300,
        marginLeft: 10,
        marginTop: 10
    }
});

export default LocalStyles;