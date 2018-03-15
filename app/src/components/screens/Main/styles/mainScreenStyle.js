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















	headerButton: {
		paddingLeft: Style.EM(0.5),
		paddingRight: Style.EM(0.5)
	},
	titleText: {
		color: ShankConstants.PRIMARY_COLOR,
		fontSize: Style.EM(1),
		fontWeight: '700'
	},
	subtitleText: {
		color: ShankConstants.TERTIARY_COLOR_ALT,
		fontSize: Style.EM(0.75),
		fontWeight: '700'
	},
	trashButton: {
		width: 75,
		paddingLeft: 0,
		paddingRight: 0
	},
	noneButtonView: {
		flex: 2,
		alignItems: 'center',
		flexDirection: 'column',
		justifyContent: 'center'
	},
	containerMain: {
		backgroundColor: '#fff',
		flex: 1
	},
	avatarList: {
		width: Style.MD,
		height: Style.MD,
		borderRadius: Style.MD / 2
	},
	roundAvatar: {
		width: Style.iconSM,
		height: Style.iconSM,
		borderRadius: Style.iconSM / 2,
	},
	touchableUserIcon: {
		alignItems: 'center',
		height: '100%',
		padding: Style.ICON_PADDING,
	},
	containerRoundAvatar: {
		height: Style.iconSM,
		width: Style.iconSM,
		borderRadius: Style.iconSM / 2,
		marginVertical: '10%'
	},
	overlayRoundAvatar: {
		backgroundColor: 'transparent',
	},
	containerList: {
		height: Style.INPUT_INSIDE_BUBBLE,
	},
	titleMainList: {
		fontSize: Style.FONT_XLARGE,
		color: "#556E3E",
	},
	subTitleMainList: {
		fontSize: Style.FONT_MEDIUM,
		color: "#BFBFBF",
		marginLeft: '2.5%'
	},
	buttonStart: {
		width: '100%',
		paddingBottom: 12,
		paddingTop: 12,
		borderWidth: 2,
		borderColor: '#c2c2c2',
		borderRadius: 10,
		alignItems: 'center',
	},
});