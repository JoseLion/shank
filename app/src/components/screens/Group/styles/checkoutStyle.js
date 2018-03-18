import { Dimensions, Platform, StyleSheet } from 'react-native';
import Style from '../../../../styles/Stylesheet';

import * as AppConst from '../../../../core/AppConst';


const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;
const widthSpace = '3%';

const ViewStyle = StyleSheet.create({
	container: {
		flex: 1, justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: '5%',
		backgroundColor: 'white'
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
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: '8%',
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
		color: AppConst.COLOR_GRAY
	},
	exchangeIcon: {
		fontSize: Style.FONT_15,
		textAlign: 'center',
		color: AppConst.COLOR_GRAY
	},
	rowPrice: {
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_15,
		color: AppConst.COLOR_BLUE,
		textAlign: 'right'
	},
	totalView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-start'
	},
	totalLabel: {
		flex: 4,
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_16,
		color: AppConst.COLOR_BLUE
	},
	totalValue: {
		flex: 1,
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_18,
		color: AppConst.COLOR_SUCCESS
	},
	buttonsView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});

export default ViewStyle;