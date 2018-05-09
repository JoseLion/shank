import { StyleSheet } from 'react-native';
import * as AppConst from 'Core/AppConst';

export default StyleSheet.create({
	slide: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	coverImage: {
		width: '100%',
		flex: 1
	},
	startButton: {
		bottom:'12.5%',
		position:'absolute',
		width: '80%'
	}
});