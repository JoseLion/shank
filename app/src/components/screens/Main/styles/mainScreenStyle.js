import {Dimensions, StyleSheet} from 'react-native';
import * as ShankConstants from '../../../../core/ShankConstants';
import Style from '../../../../styles/Stylesheet';

const width = Dimensions.get('window').width;

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
	mainContainer: {
		flex: 1,
		width: '100%',
		height: '100%'
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
		borderBottomColor: ShankConstants.TERTIARY_COLOR_ALT,
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
		color: ShankConstants.SHANK_GREEN,
		letterSpacing: Style.EM(0.25)
	},
	groupTournament: {
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_16,
		color: ShankConstants.TERTIARY_COLOR_ALT
	},
	groupStatsView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'baseline'
	},
	groupStatsSubView: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'baseline'
	},
	groupStatsLabel: {
		fontFamily: 'century-gothic-bold',
		fontSize: Style.FONT_16,
		color: ShankConstants.TERTIARY_COLOR_ALT,
		marginRight: '3%'
	},
	groupStatsValue: {
		fontFamily: 'century-gothic',
		fontSize: Style.FONT_16,
		color: ShankConstants.TERTIARY_COLOR_ALT
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
		color: ShankConstants.TERTIARY_COLOR_ALT,
		textAlign: 'center'
	}
});