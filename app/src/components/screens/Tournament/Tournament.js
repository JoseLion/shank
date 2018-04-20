import React, { Component } from 'react';
import { ScrollView, View, Image } from 'react-native';
import { AppConst } from '../BaseComponent';
import ViewStyle from './styles/tournamentStyle';

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
		return (
			<ScrollView contentContainerStyle={{flex: 1, alignItems: 'flex-start'}}>
				<Image style={{flex: 1, width: '100%'}} source={GolfCourse} resizeMode={'contain'} resizeMethod={'resize'}>
					
				</Image>
			</ScrollView>
		);
	}
}