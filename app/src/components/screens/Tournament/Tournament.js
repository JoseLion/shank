import React, { Component } from 'react';
import { ScrollView, View, Image, Text, TouchableHighlight } from 'react-native';
import { AppConst } from '../BaseComponent';
import ViewStyle from './styles/tournamentStyle';
import Style from 'ShankStyle';

import TournamentIcon from '../../../../resources/tournament-icon.png';
import TournamentIconO from '../../../../resources/tournament-icon-o.png';
import GolfCourse from '../../../../resources/golf-course.png';

export default class Tournaments extends Component {

	static navigationOptions = {
		title: "Tournaments",
		tabBarLabel: 'Tournaments',
		tabBarIcon: ({tintColor}) => (<Image style={ViewStyle.tabIcon} source={tintColor == AppConst.COLOR_WHITE ? TournamentIcon : TournamentIconO} resizeMode={'contain'} resizeMethod={'resize'} />)
	};

	constructor(props) {
		super(props);
	}

	render() {
		const array = [{_id: 1, name: 'Tournament 1'}, {_id: 2, name: 'Tournament 2'}, {_id: 3, name: 'Tournament 3'}];
		const grid = array.map(tournament => {
			return (
				<TouchableHighlight style={{width: '47,5%', marginLeft: '2,5%'}}></TouchableHighlight>
			);
		});

		return (
			<ScrollView contentContainerStyle={{width: '100%'}}>
				<View style={{flexDirection: 'row'}}>
					<Image style={{flex: 1, aspectRatio: 1280/720}} source={GolfCourse} resizeMode={'contain'} resizeMethod={'resize'} />

					<View style={{position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', justifyContent: "flex-end", paddingHorizontal: '5%'}}>
						<Text style={{fontFamily: Style.CENTURY_GOTHIC_BOLD, fontSize: Style.FONT_15_5, color: AppConst.COLOR_WHITE}}>OPEN US</Text>

						<View style={{flexDirection: 'row', marginVertical: '2%'}}>
							<View style={{flex: 2, paddingRight: '1%'}}>
								<Text style={{fontFamily: Style.CENTURY_GOTHIC_BOLD, fontSize: Style.FONT_14_5, color: AppConst.COLOR_WHITE}}>Course/Location</Text>
								<Text style={{fontFamily: Style.CENTURY_GOTHIC, fontSize: Style.FONT_14_5, color: AppConst.COLOR_WHITE}}>Augusta National Golf Course</Text>
								<Text style={{fontFamily: Style.CENTURY_GOTHIC, fontSize: Style.FONT_14_5, color: AppConst.COLOR_WHITE}}>Augusta, Georgia</Text>
							</View>

							<View style={{flex: 1, paddingLeft: '1%'}}>
								<Text style={{fontFamily: Style.CENTURY_GOTHIC_BOLD, fontSize: Style.FONT_14_5, color: AppConst.COLOR_WHITE}}>Dates</Text>
								<Text style={{fontFamily: Style.CENTURY_GOTHIC, fontSize: Style.FONT_14_5, color: AppConst.COLOR_WHITE}}>April 6-9, 2017</Text>
							</View>
						</View>
					</View>
				</View>

				<Text style={{fontFamily: Style.CENTURY_GOTHIC, fontSize: Style.FONT_19, color: AppConst.COLOR_BLUE, paddingVertical: '2%', paddingHorizontal: '5%'}}>Leaderboard</Text>
				<Text style={{fontFamily: Style.CENTURY_GOTHIC, fontSize: Style.FONT_15, color: AppConst.COLOR_BLUE, paddingVertical: '2%', paddingHorizontal: '5%'}}>The tournament hasn't started.</Text>

				<View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
				</View>
			</ScrollView>
		);
	}
}