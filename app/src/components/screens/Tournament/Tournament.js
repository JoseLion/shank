import React, { Component } from 'react';
import { ScrollView, View, Image, Text, TouchableHighlight } from 'react-native';
import { AppConst } from '../BaseComponent';
import ViewStyle from './styles/tournamentStyle';
import Style from 'ShankStyle';

import TournamentIcon from '../../../../resources/tournament-icon.png';
import TournamentIconO from '../../../../resources/tournament-icon-o.png';
import GolfCourse from '../../../../resources/golf-course.png';
import LinkIcon from '../../../../resources/link-icon.png';
import Static1 from '../../../../resources/static1.png';
import Static2 from '../../../../resources/static2.png';

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
		const array = [
			{_id: 1, name: 'US Open', date: 'June 15-18, 2017', courseImage: Static1, venue: 'Erin Hills Golf Course', location: 'Erin, Winsconsin'},
			{_id: 2, name: 'British Open', date: 'July 20-23, 2017', courseImage: Static2, venue: 'Royal Birkdale Golf Club', location: 'Southport Merseysid, England'}/*,
			{_id: 3, name: 'US Open', date: 'June 15-18, 2017', courseImage: Static1, venue: 'Erin Hills Golf Course', location: 'Erin, Winsconsin'}*/];
		const grid = array.map((tournament, index) => {
			const margin = index % 2 == 0 ? {marginRight: '2.5%'} : {marginLeft: '2.5%'};

			return (
				<TouchableHighlight key={tournament._id} style={[{width: '47.5%', marginBottom: '5%'}, margin]} underlayColor={AppConst.COLOR_WHITE} onPress={() => {}}>
					<View>
						<View style={{flexDirection: 'row'}}>
							<Image style={{flex: 1, aspectRatio: 1, alignSelf: 'center'}} source={tournament.courseImage} resizeMode={'cover'} resizeMethod={'resize'} />

							<View style={{flexDirection: 'row', alignItems: 'flex-end', position: 'absolute', width: '100%', height: '100%'}}>
								<View style={{flex: 9, padding: '5%'}}>
									<Text style={{fontFamily: Style.CENTURY_GOTHIC_BOLD, fontSize: Style.FONT_15, color: AppConst.COLOR_WHITE}} numberOfLines={1}>{tournament.name}</Text>
									<Text style={{fontFamily: Style.CENTURY_GOTHIC, fontSize: Style.FONT_15, color: AppConst.COLOR_WHITE}} numberOfLines={1}>{tournament.date}</Text>
								</View>

								<Image style={{flex: 1, aspectRatio: 1, alignSelf: 'flex-end', marginRight: '5%', marginBottom: '5%'}} source={LinkIcon} resizeMode={'contain'} resizeMethod={'resize'} />
							</View>
						</View>

						<View style={{backgroundColor: 'rgba(179, 190, 201, 0.1)', padding: '5%'}}>
							<Text style={{fontFamily: Style.CENTURY_GOTHIC, fontSize: Style.FONT_15, color: AppConst.COLOR_GREEN}} numberOfLines={1}>{tournament.venue}</Text>
							<Text style={{fontFamily: Style.CENTURY_GOTHIC, fontSize: Style.FONT_15, color: AppConst.COLOR_GREEN}} numberOfLines={1}>{tournament.location}</Text>
						</View>
					</View>
				</TouchableHighlight>
			);
		});

		return (
			<ScrollView contentContainerStyle={{width: '100%', backgroundColor: AppConst.COLOR_WHITE}}>
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
					{grid}
				</View>
			</ScrollView>
		);
	}
}