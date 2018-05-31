import { StyleSheet } from 'react-native';
import * as AppConst from 'Core/AppConst';
import Style from 'ShankStyle';

export default StyleSheet.create({
	tabIcon: {
		width: '100%',
		height: '100%'
	},
	mainScroll: {
		width: '100%',
		backgroundColor: AppConst.COLOR_WHITE
	},
	headerView: {
		flexDirection: 'row'
	},
	headerImage: {
		flex: 1,
		aspectRatio: 1280/720
	},
	headerPlaceholder: {
		flex: 1,
		aspectRatio: 1280/720,
		resizeMode: 'contain'
	},
	headerGradient: {
		width: '100%',
		height: '100%'
	},
	headerDetailView: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		width: '100%',
		height: '100%',
		justifyContent: "flex-end",
		paddingHorizontal: '5%'
	},
	headerName: {
		fontFamily: Style.CENTURY_GOTHIC_BOLD,
		fontSize: Style.FONT_15,
		color: AppConst.COLOR_WHITE
	},
	headerSubtitle: {
		fontFamily: Style.CENTURY_GOTHIC_BOLD,
		fontSize: Style.FONT_14,
		color: AppConst.COLOR_WHITE
	},
	headerText: {
		fontFamily: Style.CENTURY_GOTHIC,
		fontSize: Style.FONT_14,
		color: AppConst.COLOR_WHITE
	},
	leaderboardTitle: {
		fontFamily: Style.CENTURY_GOTHIC,
		fontSize: Style.FONT_19,
		color: AppConst.COLOR_BLUE,
		paddingVertical: '2%',
		paddingHorizontal: '5%'
	},
	listContainer: {
		width: '100%',
		padding: '2%'
	},
	listHeader: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: AppConst.COLOR_BLUE
	},
	hasntStartedText: {
		fontFamily: Style.CENTURY_GOTHIC,
		fontSize: Style.FONT_15,
		color: AppConst.COLOR_BLUE,
		paddingVertical: '2%',
		paddingHorizontal: '5%'
	},
	gridView: {
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	gridItem: {
		width: '47.5%'
	},
	gridItemView: {
		paddingVertical: '5%',
	},
	gridItemImageView: {
		flexDirection: 'row'
	},
	gridItemImage: {
		flex: 1,
		aspectRatio: 1,
		alignSelf: 'center'
	},
	gridItemPlaceholder: {
		flex: 1,
		aspectRatio: 1280/720,
		resizeMode: 'contain'
	},
	gridItemGradient: {
		width: '100%',
		height: '100%'
	},
	gridItemOverView: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		position: 'absolute',
		width: '100%',
		height: '100%'
	},
	gridItemName: {
		fontFamily: Style.CENTURY_GOTHIC_BOLD,
		fontSize: Style.FONT_14,
		color: AppConst.COLOR_WHITE
	},
	gridItemDate: {
		fontFamily: Style.CENTURY_GOTHIC,
		fontSize: Style.FONT_14,
		color: AppConst.COLOR_WHITE
	},
	gridItemLinkImage: {
		flex: 1, aspectRatio: 1,
		alignSelf: 'flex-end',
		marginRight: '5%',
		marginBottom: '5%'
	},
	gridItemDetailView: {
		backgroundColor: 'rgba(179, 190, 201, 0.1)',
		padding: '5%'
	},
	gridItemDetailText: {
		fontFamily: Style.CENTURY_GOTHIC,
		fontSize: Style.FONT_14,
		color: AppConst.COLOR_GREEN
	},
	listHeaderView: {
		justifyContent: 'center',
		alignItems: 'flex-start',
		paddingVertical: '1%',
        paddingHorizontal: '3%',
        backgroundColor: AppConst.COLOR_BLUE
	},
	listHeaderText: {
		fontFamily: Style.CENTURY_GOTHIC,
		fontSize: Style.FONT_14_5,
        color: AppConst.COLOR_WHITE,
        width: '100%'
	},
	listRowView: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	listRowFirstCol: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: '3%'
	},
	listRowCol: {
		justifyContent: 'center',
		alignItems: 'flex-start',
		padding: '3%',
		borderColor: AppConst.COLOR_WHITE,
		borderLeftWidth: 3
	},
	listRowTextBold: {
		fontFamily: Style.CENTURY_GOTHIC_BOLD,
		fontSize: Style.FONT_15,
		color: 'black'
	},
	listRowTextGreen: {
		fontFamily: Style.CENTURY_GOTHIC,
		fontSize: Style.FONT_15,
		color: AppConst.COLOR_GREEN
	}
});