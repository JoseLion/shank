import React, { Component } from 'react';
import { ScrollView, View, Image, Text, TouchableHighlight, Platform, NativeModules } from 'react-native';
import ImageLoad from "react-native-image-placeholder";
import { FileHost } from "../BaseComponent";
import * as AppConst from "Core/AppConst";
import BaseModel from "Core/BaseModel";
import handleError from "Core/handleError";
import ViewStyle from './styles/tournamentStyle';
import Style from 'ShankStyle';

import TournamentIcon from '../../../../resources/tournament-icon.png';
import TournamentIconO from '../../../../resources/tournament-icon-o.png';
import GolfCourse from '../../../../resources/golf-course.png';
import LinkIcon from '../../../../resources/link-icon.png';
import Static1 from '../../../../resources/static1.png';
import Static2 from '../../../../resources/static2.png';
import Placeholder from '../../../../resources/placeholder.png';

export default class Tournaments extends Component {

	static navigationOptions = {
		title: "Tournaments",
		tabBarLabel: 'Tournaments',
		tabBarIcon: ({tintColor}) => (<Image style={ViewStyle.tabIcon} source={tintColor == AppConst.COLOR_WHITE ? TournamentIcon : TournamentIconO} resizeMode={'contain'} resizeMethod={'resize'} />)
	};

	constructor(props) {
		super(props);
		this.getFormattedDate = this.getFormattedDate.bind(this);
		this.state = {
			header: {},
			tournaments: []
		};
	}

	getFormattedDate(obj) {
		if (obj && obj.startDate && obj.endDate) {
			const locale = Platform.OS == 'android' ? NativeModules.I18nManager.localeIdentifier : NativeModules.SettingsManager.settings.AppleLocale;
			console.log("locale: ", locale);
			const startDate = new Date(obj.starDate);
			const endDate = new Date(obj.endDate);
			const startMonth = startDate.toLocaleString(locale, {month: "short"});
			const endMonth = endDate.toLocaleString(locale, {month: "short"});

			return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${startDate.getFullYear()}`;
		}
		
		return '';
	}
	
	async componentDidMount() {
		let tournaments = await BaseModel.get("tournament/findAll").catch(handleError);

		if (tournaments == null || tournaments.length == 0) {
			tournaments = [
				{_id: -1, name: 'US Open', bigImage: GolfCourse},
				{_id: -2, name: 'Masters Tournament', smallImage: Static1},
				{_id: -3, name: 'British Open', smallImage: Static2}
			];
		} else {
			tournaments.forEach(tournament => {
				tournament.bigImage = {uri: FileHost + tournament.bigImage};
				tournament.smallImage = {uri: FileHost + tournament.smallImage};
			})
		}

		let header = tournaments.shift();
		this.setState({ tournaments, header });
	}

	render() {
		const grid = this.state.tournaments.map((tournament, index) => {
			const margin = index % 2 == 0 ? {marginRight: '2.5%'} : {marginLeft: '2.5%'};
			return (<GridItem key={tournament._id} style={[{width: '47.5%', marginBottom: '5%'}, margin]} tournament={tournament} />);
		});

		return (
			<ScrollView contentContainerStyle={{width: '100%', backgroundColor: AppConst.COLOR_WHITE}}>
				<View style={{flexDirection: 'row'}}>
					<ImageLoad style={{flex: 1, aspectRatio: 1280/720}} source={this.state.header.bigImage} resizeMode={'contain'} resizeMethod={'resize'}
					placeholderSource={Placeholder} placeholderStyle={{flex: 1, aspectRatio: 1280/720, resizeMode: 'cover'}} />

					<View style={{position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100%', justifyContent: "flex-end", paddingHorizontal: '5%'}}>
						<Text style={{fontFamily: Style.CENTURY_GOTHIC_BOLD, fontSize: Style.FONT_15_5, color: AppConst.COLOR_WHITE}}>{this.state.header.name}</Text>

						<View style={{flexDirection: 'row', marginVertical: '2%'}}>
							<View style={{flex: 2, paddingRight: '1%'}}>
								<Text style={{fontFamily: Style.CENTURY_GOTHIC_BOLD, fontSize: Style.FONT_14_5, color: AppConst.COLOR_WHITE}}>{this.state.header.venue ? 'Course/Location' : null}</Text>
								<Text style={{fontFamily: Style.CENTURY_GOTHIC, fontSize: Style.FONT_14_5, color: AppConst.COLOR_WHITE}}>{this.state.header.venue}</Text>
								<Text style={{fontFamily: Style.CENTURY_GOTHIC, fontSize: Style.FONT_14_5, color: AppConst.COLOR_WHITE}}>{this.state.header.location}</Text>
							</View>

							<View style={{flex: 1, paddingLeft: '1%'}}>
								<Text style={{fontFamily: Style.CENTURY_GOTHIC_BOLD, fontSize: Style.FONT_14_5, color: AppConst.COLOR_WHITE}}>{this.state.header.startDate ? 'Dates' : null}</Text>
								<Text style={{fontFamily: Style.CENTURY_GOTHIC, fontSize: Style.FONT_14_5, color: AppConst.COLOR_WHITE}}>{this.getFormattedDate(this.state.header)}</Text>
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

class GridItem extends Component {
	
	constructor(props) {
		super(props);
		this.state = {tournament: props.tournament};
		this.getFormattedDate = this.getFormattedDate.bind(this);
	}

	getFormattedDate(obj) {
		if (obj && obj.starDate && obj.endDate) {
			const locale = Platform.OS == 'android' ? NativeModules.I18nManager.localeIdentifier : NativeModules.SettingsManager.settings.AppleLocale;
			const startDate = new Date(obj.starDate);
			const endDate = new Date(obj.endDate);
			const startMonth = startDate.toLocaleString(locale, {month: "short"});
			const endMonth = endDate.toLocaleString(locale, {month: "short"});

			return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}, ${startDate.getFullYear()}`;
		}
		
		return '';
	}

	render() {
		return (
			<TouchableHighlight style={this.props.style} underlayColor={AppConst.COLOR_WHITE} onPress={() => {}}>
				<View>
					<View style={{flexDirection: 'row'}}>
						<ImageLoad style={{flex: 1, aspectRatio: 1, alignSelf: 'center'}} source={this.state.tournament.smallImage} resizeMode={'cover'} resizeMethod={'resize'}
						placeholderSource={Placeholder} placeholderStyle={{flex: 1, aspectRatio: 1280/720, resizeMode: 'cover'}} />

						<View style={{flexDirection: 'row', alignItems: 'flex-end', position: 'absolute', width: '100%', height: '100%'}}>
							<View style={{flex: 9, padding: '5%'}}>
								<Text style={{fontFamily: Style.CENTURY_GOTHIC_BOLD, fontSize: Style.FONT_15, color: AppConst.COLOR_WHITE}} numberOfLines={1}>{this.state.tournament.name}</Text>
								<Text style={{fontFamily: Style.CENTURY_GOTHIC, fontSize: Style.FONT_15, color: AppConst.COLOR_WHITE}} numberOfLines={1}>{this.getFormattedDate(this.state.tournament)}</Text>
							</View>

							<Image style={{flex: 1, aspectRatio: 1, alignSelf: 'flex-end', marginRight: '5%', marginBottom: '5%'}} source={LinkIcon} resizeMode={'contain'} resizeMethod={'resize'} />
						</View>
					</View>

					<View style={{backgroundColor: 'rgba(179, 190, 201, 0.1)', padding: '5%'}}>
						<Text style={{fontFamily: Style.CENTURY_GOTHIC, fontSize: Style.FONT_15, color: AppConst.COLOR_GREEN}} numberOfLines={1}>{this.state.tournament.venue}</Text>
						<Text style={{fontFamily: Style.CENTURY_GOTHIC, fontSize: Style.FONT_15, color: AppConst.COLOR_GREEN}} numberOfLines={1}>{this.state.tournament.location}</Text>
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}