import { Dimensions, StyleSheet } from 'react-native';
import * as Constants from '../../../../core/Constants';
const {width} = Dimensions.get('window');

const LocalStyles = StyleSheet.create({
    container: {
        backgroundColor: Constants.PRIMARY_COLOR
    },
    slide: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverImage: {
        width,
        flex: 1
    },
    startButton: {
        bottom:'12.5%',
        position:'absolute',
        width: '80%'
    }
});

export default LocalStyles;
