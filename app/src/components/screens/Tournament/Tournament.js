import React, { Component } from 'react';
import { ScrollView, View, Image, Text, TouchableHighlight, Platform, NativeModules, FlatList, Linking, RefreshControl } from 'react-native';
import ImageLoad from "react-native-image-placeholder";
import LinearGradient from "react-native-linear-gradient";
import Moment from 'moment';
import { FileHost } from "../BaseComponent";
import * as AppConst from "Core/AppConst";
import BaseModel from "Core/BaseModel";
import handleError from "Core/handleError";
import ViewStyle from './styles/tournamentStyle';

import TournamentsTabOn from 'Res/tournaments-tab-on.png';
import TournamentsTabOff from 'Res/tournaments-tab-off.png';
import GolfCourse from 'Res/golf-course.png';
import LinkIcon from 'Res/link-icon.png';
import Static1 from 'Res/static1.png';
import Static2 from 'Res/static2.png';
import Placeholder from 'Res/placeholder.png';

export default class Tournaments extends Component {

	static navigationOptions = {
		title: "Tournaments",
		tabBarLabel: 'Tournaments',
		tabBarIcon: ({tintColor}) => (<Image style={ViewStyle.tabIcon} source={tintColor == AppConst.COLOR_WHITE ? TournamentsTabOn : TournamentsTabOff} resizeMode={'contain'} resizeMethod={'resize'} />)
	};

	constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.refreshData = this.refreshData.bind(this);
		this.getFormattedDate = this.getFormattedDate.bind(this);
		this.tournamentHasStarted = this.tournamentHasStarted.bind(this);
		this.state = {
            isRefreshing: false,
			header: {},
			tournaments: [],
			leaderboard: []
		};
    }
    
    async loadData() {
        let tournaments = await BaseModel.get("tournament/findAll").catch(handleError);
		let leaderboard = [];

		if (tournaments == null || tournaments.length == 0) {
			tournaments = [
				{_id: -1, name: 'US Open', mainPhoto: GolfCourse},
				{_id: -2, name: 'Masters Tournament', secondaryPhoto: Static1},
				{_id: -3, name: 'British Open', secondaryPhoto: Static2}
			];
		} else {
			tournaments.forEach(tournament => {
				tournament.mainPhoto = {uri: FileHost + tournament.mainPhoto};
				tournament.secondaryPhoto = {uri: FileHost + tournament.secondaryPhoto};
			});

			leaderboard = await BaseModel.get('leaderboard/findByTournament/' + tournaments[0]._id).catch(handleError);
		}

		let header = tournaments.shift();
		this.setState({ tournaments, header, leaderboard });
    }

    async refreshData() {
        this.setState({isRefreshing: true});
        await this.loadData();
        this.setState({isRefreshing: false});
    }

	getFormattedDate(obj) {
		if (obj && obj.startDate && obj.endDate) {
			const startDate = new Date(obj.startDate);
			const endDate = new Date(obj.endDate);
			const start = Moment(startDate).format('MMM D');
			const end = Moment(endDate).format('MMM D');
			
			return `${start}-${end}, ${startDate.getFullYear()}`;
		}
		
		return '';
	}

	tournamentHasStarted() {
		const today = new Date();
		const startDate = new Date(this.state.header.startDate);

		if (today.getTime() >= startDate.getTime()) {
			return true;
		}

		return false;
    }
	
	async componentDidMount() {
		global.setLoading(true);
		await this.loadData();
		global.setLoading(false);
	}

	render() {
		return (
			<ScrollView contentContainerStyle={ViewStyle.mainScroll} refreshControl={<RefreshControl refreshing={this.state.isRefreshing} onRefresh={this.refreshData} />}>
				<View style={ViewStyle.headerView}>
					<ImageLoad style={ViewStyle.headerImage} source={this.state.header.mainPhoto} resizeMode={'contain'} resizeMethod={'resize'}
					placeholderSource={Placeholder} placeholderStyle={ViewStyle.headerPlaceholder}>
						<LinearGradient style={ViewStyle.headerGradient} colors={['transparent', 'rgba(0, 0, 0, 0.5)']} locations={[0.4, 1]} />
					</ImageLoad>

					<View style={ViewStyle.headerDetailView}>
						<Text style={ViewStyle.headerName}>{this.state.header.name}</Text>

						<View style={{flexDirection: 'row', marginVertical: '2%'}}>
							<View style={{flex: 2, paddingRight: '1%'}}>
								<Text style={ViewStyle.headerSubtitle}>{this.state.header.venue ? 'Course/Location' : null}</Text>
								<Text style={ViewStyle.headerText}>{this.state.header.venue}</Text>
								<Text style={ViewStyle.headerText}>{this.state.header.location}</Text>
							</View>

							<View style={{flex: 1, paddingLeft: '1%'}}>
								<Text style={ViewStyle.headerSubtitle}>{this.state.header.startDate ? 'Dates' : null}</Text>
								<Text style={ViewStyle.headerText}>{this.getFormattedDate(this.state.header)}</Text>
							</View>
						</View>
					</View>
				</View>

				<Text style={ViewStyle.leaderboardTitle}>Leaderboard</Text>
				{this.state.leaderboard.length > 0 && this.tournamentHasStarted() ?
					<FlatList contentContainerStyle={ViewStyle.listContainer} data={this.state.leaderboard} keyExtractor={item => item._id}
						ListHeaderComponent={<LeaderboardHeader style={ViewStyle.listHeader} />}
						renderItem={({item, index}) => <LeaderboardRow item={item} index={index} header={this.state.header} />} />
				:
					<Text style={ViewStyle.hasntStartedText}>The tournament hasn't started.</Text>
				}

				{/*this.state.leaderboard.length <= 0 && */
					<View style={ViewStyle.gridView}>
						{this.state.tournaments.map((tournament, index) => {
							const margin = index % 2 == 0 ? {marginRight: '2.5%'} : {marginLeft: '2.5%'};
							return (<GridItem key={tournament._id} style={[ViewStyle.gridItem, margin]} tournament={tournament} />);
						})}
					</View>
				}
			</ScrollView>
		);
	}
}

class GridItem extends Component {
	
	constructor(props) {
		super(props);
		this.getFormattedDate = this.getFormattedDate.bind(this);
		this.openLink = this.openLink.bind(this);
		this.state = {tournament: props.tournament};
	}

	getFormattedDate(obj) {
		if (obj && obj.startDate && obj.endDate) {
			const startDate = new Date(obj.startDate);
			const endDate = new Date(obj.endDate);
			const start = Moment(startDate).format('MMM D');
			const end = Moment(endDate).format('MMM D');
			
			return `${start}-${end}, ${startDate.getFullYear()}`;
		}
		
		return '';
	}

	async openLink() {
		if (this.state.tournament.url) {
			let canOpen = await Linking.canOpenURL(this.state.tournament.url).catch(handleError);

			if (canOpen) {
				return Linking.openURL(this.state.tournament.url).catch(handleError);
			}

			return handleError("Unable to open URL! The URL might not be valid.");
		}

		handleError("The URL was not found!");
	}

	render() {
		return (
			<TouchableHighlight style={this.props.style} underlayColor={AppConst.COLOR_WHITE} onPress={this.openLink}>
				<View style={ViewStyle.gridItemView}>
					<View style={ViewStyle.gridItemImageView}>
						<ImageLoad style={ViewStyle.gridItemImage} source={this.state.tournament.secondaryPhoto} resizeMode={'cover'} resizeMethod={'resize'}
						placeholderSource={Placeholder} placeholderStyle={ViewStyle.gridItemPlaceholder}>
							<LinearGradient style={ViewStyle.gridItemGradient} colors={['transparent', 'rgba(0, 0, 0, 0.5)']} locations={[0.4, 1]} />
						</ImageLoad>

						<View style={ViewStyle.gridItemOverView}>
							<View style={{flex: 9, padding: '5%'}}>
								<Text style={ViewStyle.gridItemName} numberOfLines={1}>{this.state.tournament.name}</Text>
								<Text style={ViewStyle.gridItemDate} numberOfLines={1}>{this.getFormattedDate(this.state.tournament)}</Text>
							</View>

							<Image style={ViewStyle.gridItemLinkImage} source={LinkIcon} resizeMode={'contain'} resizeMethod={'resize'} />
						</View>
					</View>

					<View style={ViewStyle.gridItemDetailView}>
						<Text style={ViewStyle.gridItemDetailText} numberOfLines={1}>{this.state.tournament.venue}</Text>
						<Text style={ViewStyle.gridItemDetailText} numberOfLines={1}>{this.state.tournament.location}</Text>
					</View>
				</View>
			</TouchableHighlight>
		);
	}
}

class LeaderboardHeader extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={this.props.style}>
				<View style={[ViewStyle.listHeaderView, {flex: 2, alignItems: 'center'}]}>
					<Text style={ViewStyle.listHeaderText} numberOfLines={1}>POS</Text>
				</View>

				<View style={[ViewStyle.listHeaderView, {flex: 5}]}>
					<Text style={ViewStyle.listHeaderText} numberOfLines={1}>PLAYERS</Text>
				</View>

				<View style={[ViewStyle.listHeaderView, {flex: 2}]}>
					<Text style={ViewStyle.listHeaderText} numberOfLines={1}>TOTAL</Text>
				</View>

				<View style={[ViewStyle.listHeaderView, {flex: 2}]}>
					<Text style={ViewStyle.listHeaderText} numberOfLines={1}>THRU</Text>
				</View>

				<View style={[ViewStyle.listHeaderView, {flex: 2.5}]}>
					<Text style={ViewStyle.listHeaderText} numberOfLines={1}>TODAY</Text>
				</View>
			</View>
		);
	}
}

class LeaderboardRow extends Component {
	constructor(props) {
		super(props);
		this.getTodaysScore = this.getTodaysScore.bind(this);
		this.state = {
			item: this.props.item,
			index: this.props.index
		};
	}

	getTodaysScore(item) {
		const today = new Date();
		let roundIndex = 0;
		
		this.props.header.rounds.forEach((round, i) => {
			const date = new Date(round.day);

			if (today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth() && today.getDate() == date.getDate()) {
				roundIndex = i;
				return;
			}
		});
		
		if (item.rounds && item.rounds[roundIndex]) {
			return item.rounds[roundIndex].score;
		}
	}

	render() {
		const backgroundColor = this.state.index % 2 == 0 ? '#EAEAEA' : '#F8F6F7';

		return (
			<View style={[ViewStyle.listRowView, { backgroundColor }]}>
				<View style={[ViewStyle.listRowFirstCol, {flex: 2}]}>
					<Text style={ViewStyle.listRowTextBold} numberOfLines={1}>{this.state.item.rank}</Text>
				</View>

				<View style={[ViewStyle.listRowCol, {flex: 5}]}>
					<Text style={ViewStyle.listRowTextGreen} numberOfLines={1}>{this.state.item.player.firstName} {this.state.item.player.lastName}</Text>
				</View>

				<View style={[ViewStyle.listRowCol, {flex: 2}]}>
					<Text style={ViewStyle.listRowTextBold} numberOfLines={1}>{this.state.item.totalScore}</Text>
				</View>

				<View style={[ViewStyle.listRowCol, {flex: 2}]}>
					<Text style={ViewStyle.listRowTextGreen} numberOfLines={1}>{this.state.item.totalThrough}</Text>
				</View>

				<View style={[ViewStyle.listRowCol, {flex: 2.5}]}>
					<Text style={ViewStyle.listRowTextGreen} numberOfLines={1}>{this.getTodaysScore(this.state.item)}</Text>
				</View>
			</View>
		);
	}
}