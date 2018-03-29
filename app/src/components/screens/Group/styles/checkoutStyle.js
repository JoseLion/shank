import { StyleSheet } from 'react-native';
import Style from '../../../../styles/Stylesheet';
import * as AppConst from '../../../../core/AppConst';

export default StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: '100%',
		paddingHorizontal: '5%',
		backgroundColor: AppConst.COLOR_WHITE
	},
	titleView: {
		justifyContent: 'center',
		borderBottomWidth: 2.5,
		width: '100%',
		paddingVertical: '2.5%',
		borderBottomColor: AppConst.COLOR_GRAY
	},
	titleText: {
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_17,
		color: AppConst.COLOR_BLUE,
		textAlign: 'center'
	},
	rowView: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: Style.EM(1.8),
		borderBottomWidth: 1,
		borderColor: AppConst.COLOR_GRAY
	},
	rowNum: {
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_15,
		color: AppConst.COLOR_BLUE
	},
	rowName: {
		fontFamily: 'century-gothic',
		fontSize: Style.FONT_15,
		color: AppConst.COLOR_GRAY,
		paddingHorizontal: Style.EM(0.25)
	},
	exchangeIcon: {
		width: Style.EM(0.8),
		height: Style.EM(0.8),
	},
	rowPrice: {
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_15_5,
		color: AppConst.COLOR_BLUE,
		textAlign: 'right'
	},
	totalView: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'baseline',
		marginTop: Style.EM(1)
	},
	totalLabel: {
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_16,
		color: AppConst.COLOR_BLUE
	},
	totalValue: {
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_18,
		color: AppConst.COLOR_SUCCESS,
		alignSelf: 'flex-end'
	},
	buttonsView: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: Style.EM(2)
	}
});