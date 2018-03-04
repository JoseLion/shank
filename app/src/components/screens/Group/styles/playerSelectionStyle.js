import { Dimensions, Platform, StyleSheet } from 'react-native';
import Style from '../../../../styles/Stylesheet';

import * as ShankConstants from '../../../../core/ShankConstants';


const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;
const widthSpace = '3%';

const ViewStyle = StyleSheet.create({
	rowCell: {
		paddingHorizontal: widthSpace
	},
	cellView: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: '1%',
		borderTopWidth: 0.5,
		borderBottomWidth: 0.5,
		borderColor: ShankConstants.TERTIARY_COLOR_ALT
	},
	playerName: {
		fontFamily: 'century-gothic',
		fontSize: Style.FONT_15_5,
		color: ShankConstants.SHANK_GREEN,
		paddingHorizontal: '5%'
	},
	pickRate: {
		fontFamily: 'century-gothic',
		fontSize: Style.FONT_15_5,
		color: ShankConstants.SHANK_GREEN
	},
	checkView: {
		justifyContent: 'center',
		backgroundColor: ShankConstants.TERTIARY_COLOR,
		borderWidth: 1.5,
		borderColor: ShankConstants.SUCCESS_COLOR,
		borderRadius: 17.5,
		height: '100%',
		paddingVertical: '10%'
	},
	check: {
		color: ShankConstants.SUCCESS_COLOR,
		paddingHorizontal: '30%'
	},
	selectedView: {
		backgroundColor: ShankConstants.SUCCESS_COLOR
	},
	selectedCheck: {
		color: ShankConstants.TERTIARY_COLOR
	},


	mainContainer: {
		flex:1,
		width:'100%',
		backgroundColor: ShankConstants.BACKGROUND_COLOR
	},
	tournamentName: {
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_17,
		paddingVertical: '2%',
		paddingHorizontal: widthSpace
	},
	headerView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: '2%',
		paddingBottom: '2%',
		borderBottomWidth: 0.5,
		borderColor: ShankConstants.TERTIARY_COLOR_ALT,
		paddingHorizontal: widthSpace
	},
	headerText: {
		fontFamily: 'century-gothic',
		fontSize: Style.FONT_16
	},
	saveView: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: '2.5%',
		paddingHorizontal: '7.5%'
	}
});

export default ViewStyle;