import { Dimensions, StyleSheet } from 'react-native';
import * as ShankConstants from '../../../../core/ShankConstants';
const {width} = Dimensions.get('window');

const LocalStyles = StyleSheet.create({
    container: {
        backgroundColor: ShankConstants.PRIMARY_COLOR
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
