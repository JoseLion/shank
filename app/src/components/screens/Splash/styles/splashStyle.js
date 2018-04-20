import { StyleSheet } from 'react-native';
import * as AppConst from 'AppConst';

export default StyleSheet.create({
	mainContainer: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: AppConst.COLOR_BLUE
	},
	logo: {
		width: '50%',
		position: 'absolute'
	},
	wiredLogo: {
		width: '50%'
	}
});