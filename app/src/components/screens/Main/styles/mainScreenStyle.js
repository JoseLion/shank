import { StyleSheet } from 'react-native';
import * as AppConst from '../../../../core/AppConst';
import Style from '../../../../styles/Stylesheet';

export default StyleSheet.create({
	navButton: {
		height: '100%',
		paddingHorizontal: Style.EM(1),
		justifyContent: 'center',
		alignItems: 'center'
	},
	navPlusIcon: {
		width: Style.EM(1),
		height: Style.EM(1)
	},
	navUserIcon: {
		width: Style.EM(1.5),
		height: Style.EM(1.5)
	},
	tabIcon: {
		width: '100%',
		height: '100%'
	},
	mainContainer: {
		flex: 1,
		width: '100%',
		height: '100%',
		backgroundColor: AppConst.COLOR_WHITE
	},
	rowButton: {
		width: '100%'
	},
	rowContainer: {
		width: '100%',
		paddingHorizontal: '5%'
	},
	rowSubView: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		borderBottomWidth: 1,
		borderBottomColor: AppConst.COLOR_GRAY,
		paddingVertical: '5%'
	},
	groupImage: {
		width: Style.EM(4),
		height: Style.EM(4),
		borderRadius: Style.EM(4) / 2.0
	},
	grupInfoView: {
		flex: 5,
		flexDirection: 'column',
		justifyContent: 'center',
		paddingHorizontal: '2%',
		height: '100%'
	},
	groupName: {
		fontFamily: 'century-gothic',
		fontSize: Style.FONT_17,
		color: AppConst.COLOR_GREEN,
		letterSpacing: Style.EM(0.25)
	},
	groupTournament: {
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_16,
		color: AppConst.COLOR_GRAY
	},
	groupStatsView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	groupStatsSubView: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	groupStatsLabel: {
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_16,
		color: AppConst.COLOR_GRAY,
		marginRight: '3%'
	},
	groupStatsValue: {
		fontFamily: 'century-gothic',
		fontSize: Style.FONT_16,
		color: AppConst.COLOR_GRAY
	},
	caretIcon: {
		flex: 1,
		height: '25%'
	},
	noDataContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%'
	},
	noDataText: {
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_16,
		color: AppConst.COLOR_GRAY,
		textAlign: 'center'
	}
});