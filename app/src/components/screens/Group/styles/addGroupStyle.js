import { StyleSheet } from 'react-native';
import Style from '../../../../styles/Stylesheet';
import * as AppConst from '../../../../core/AppConst';

export default StyleSheet.create({
	mainContainer: {
		flex: 1,
		alignItems: 'center',
		paddingHorizontal: Style.EM(3)
	},
	imageButton: {
		alignItems: 'center',
		paddingVertical: Style.EM(1.5)
	},
	image: {
		width: Style.EM(7),
		height: Style.EM(7),
		borderRadius: Style.EM(7) / 2.0,
		marginBottom: Style.EM(0.5)
	},
	imageText: {
		fontFamily: 'century-gothic',
		fontSize: Style.FONT_14,
		color: AppConst.COLOR_GRAY
	},
	nameInput: {
		width: '100%',
		padding: Style.EM(1),
		borderWidth: 1,
		borderColor: AppConst.COLOR_GRAY,
		fontFamily: 'century-gothic',
		fontSize: Style.FONT_16
	},
	pickerView: {
		width: '100%',
		padding: Style.EM(1),
		borderWidth: 1,
		borderColor: AppConst.COLOR_GRAY,
		borderTopWidth: 0
	},
	androidPicker: {
		padding: Style.EM(0.5)
	},
	pickerText: {
		fontFamily: 'century-gothic',
		fontSize: Style.FONT_16
	},
	betInput: {
		width: '100%',
		height: Style.EM(5),
		padding: Style.EM(1),
		marginBottom: Style.EM(1),
		borderWidth: 1,
		borderColor: AppConst.COLOR_GRAY,
		borderTopWidth: 0,
		fontFamily: 'century-gothic',
		fontSize: Style.FONT_16
	}
});