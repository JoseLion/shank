import { Dimensions, StyleSheet } from 'react-native';
import Style from 'ShankStyle';
import * as AppConst from 'Core/AppConst';

const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;
const widthSpace = '3%';

const ViewStyle = StyleSheet.create({
	rowCell: {
		paddingHorizontal: widthSpace,
		backgroundColor: AppConst.COLOR_WHITE,
		flex: 1,
		justifyContent: 'center'
	},
	cellView: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderColor: AppConst.COLOR_GRAY,
		height: '100%',
		paddingBottom: '2%'
	},
	playerImage: {
		width: Style.EM(2),
		height: Style.EM(2),
		borderRadius: Style.EM(2) / 2.0
	},
	playerName: {
		fontFamily: Style.CENTURY_GOTHIC,
		fontSize: Style.FONT_15_5,
		color: AppConst.COLOR_GREEN,
		paddingHorizontal: '5%'
	},
	pickRate: {
		fontFamily: Style.CENTURY_GOTHIC,
		fontSize: Style.FONT_15_5,
		color: AppConst.COLOR_GREEN
	},
	checkView: {
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: AppConst.COLOR_SUCCESS,
		borderRadius: 17.5,
		paddingVertical: '10%',
		paddingHorizontal: '30%'
	},
	checkImage: {
		width: Style.EM(1),
		height: Style.EM(1)
	},
	selectedView: {
		backgroundColor: AppConst.COLOR_SUCCESS
	},


	mainContainer: {
		flex:1,
		width:'100%',
		backgroundColor: AppConst.COLOR_WHITE
	},
	tournamentName: {
		fontFamily: Style.CENTURY_GOTHIC_BOLD,
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
		borderColor: AppConst.COLOR_GRAY,
		paddingHorizontal: widthSpace
	},
	headerText: {
		fontFamily: Style.CENTURY_GOTHIC,
		fontSize: Style.FONT_16
	},
	saveView: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: '2.5%',
		paddingHorizontal: '7.5%'
	},
	searchInputView: {
		width: (containerWidth * 0.80),
		height: '100%',
		paddingHorizontal: (containerWidth * 0.02),
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: Style.EM(0.375)
	},
	searchIcon: {
		width: Style.EM(1.125),
		height: '80%',
		position: 'absolute',
		left: '5%'
	},
	searchButton: {
		width: Style.EM(1.25),
		height: Style.EM(1.25),
		marginRight: Style.EM(1)
	},
	searchInput: {
		flex: 1,
		fontFamily: Style.CENTURY_GOTHIC,
		fontSize: Style.FONT_15,
		color: AppConst.COLOR_WHITE,
		height: '100%',
		backgroundColor: '#323d50',
		borderRadius: Style.EM(0.5),
		paddingLeft: '10%',
		paddingRight: '2%',
		zIndex: -1
	},
	cancelSearchButton: {
		width: (containerWidth * 0.2),
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	cancelSearchText: {
		fontFamily: Style.CENTURY_GOTHIC,
		fontSize: Style.FONT_15,
		color: AppConst.COLOR_WHITE
	}
});

export default ViewStyle;