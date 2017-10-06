import {Dimensions, Platform, StyleSheet} from 'react-native';
import Style from '../../../../styles/Stylesheet';

const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

const LocalStyles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
    },
    listView: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    card: {
        width: viewportWidth / 2.08, //Device width divided in almost a half
        height: (viewportHeight / 2.2),
        //backgroundColor: '#F5FCFF',
    },
    gridItemImage: {
        width: viewportWidth / 2.1,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridItemText: {
        marginTop: 5,
    },
    fixedFooter: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0
    },
    headline: {
        textAlign: 'left',
        fontWeight: 'bold',
        fontSize: Style.FONT_13,
        backgroundColor: 'rgba(0,0,0,0)',
        color: 'white',
    }
});

export default LocalStyles;