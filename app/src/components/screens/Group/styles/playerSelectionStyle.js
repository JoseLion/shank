import { Dimensions, Platform, StyleSheet } from 'react-native';
import Style from '../../../../styles/Stylesheet';

import * as AppConst from '../../../../core/AppConst';


const isAndroid = Platform.OS == 'android' ? true : false;
const {width, height} = Dimensions.get('window');
const containerWidth = width > 500 ? 500 : width;
const widthSpace = '3%';

const ViewStyle = StyleSheet.create({
	rowCell: {
		paddingHorizontal: widthSpace,
		backgroundColor: AppConst.COLOR_WHITE
	},
	cellView: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: '1%',
		borderBottomWidth: 1,
		borderColor: AppConst.COLOR_GRAY
	},
	playerImage: {
		width: Style.EM(2),
		height: Style.EM(2),
		borderRadius: Style.EM(2) / 2.0
	},
	playerName: {
		fontFamily: 'century-gothic',
		fontSize: Style.FONT_15_5,
		color: AppConst.COLOR_GREEN,
		paddingHorizontal: '5%'
	},
	pickRate: {
		fontFamily: 'century-gothic',
		fontSize: Style.FONT_15_5,
		color: AppConst.COLOR_GREEN
	},
	checkView: {
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 1,
		borderColor: AppConst.COLOR_SUCCESS,
		borderRadius: 17.5,
		height: '100%',
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
		borderColor: AppConst.COLOR_GRAY,
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
	},
	searchInputView: {
		width: (containerWidth * 0.80),
		height: '100%',
		justifyContent: 'center',
		paddingHorizontal: (containerWidth * 0.02)
	},
	searchIcon: {
		height: '40%',
		position: 'absolute',
		left: Style.EM(-4)
	},
	searchInput: {
		fontFamily: 'century-gothic',
		fontSize: Style.FONT_15,
		color: 'white',
		height: '70%',
		backgroundColor: 'rgba(241, 242, 242, 0.2)',
		borderRadius: 10,
		paddingLeft: (containerWidth * 0.125)
	},


	cancelSearchButton: {
		width: (containerWidth * 0.2),
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	cancelSearchText: {
		fontFamily: 'century-gothic',
		fontSize: Style.FONT_15,
		color: 'white'
	}
});

export default ViewStyle;