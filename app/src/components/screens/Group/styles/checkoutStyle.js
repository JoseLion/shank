import { Dimensions, Platform, StyleSheet } from 'react-native';
import Style from '../../../../styles/Stylesheet';

import * as ShankConstants from '../../../../core/ShankConstants';


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
		borderBottomColor: ShankConstants.TERTIARY_COLOR_ALT
	},
	titleText: {
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_17,
		color: ShankConstants.PRIMARY_COLOR,
		textAlign: 'center'
	},
	rowView: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: '8%',
		borderBottomWidth: 1,
		borderColor: ShankConstants.TERTIARY_COLOR_ALT
	},
	rowNum: {
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_15,
		color: ShankConstants.PRIMARY_COLOR
	},
	rowName: {
		fontFamily: 'century-gothic',
		fontSize: Style.FONT_15,
		color: ShankConstants.TERTIARY_COLOR_ALT
	},
	exchangeIcon: {
		fontSize: Style.FONT_15,
		textAlign: 'center',
		color: ShankConstants.TERTIARY_COLOR_ALT
	},
	rowPrice: {
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_15,
		color: ShankConstants.PRIMARY_COLOR,
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
		color: ShankConstants.PRIMARY_COLOR
	},
	totalValue: {
		flex: 1,
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_18,
		color: ShankConstants.SUCCESS_COLOR
	},
	buttonsView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	}
});

export default ViewStyle;