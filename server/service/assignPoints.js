import mongoose from 'mongoose';
import handleMongoError from './handleMongoError';

const Tournament = mongoose.model('Tournament');
const Leaderboard = mongoose.model('Leaderboard');
const Group = mongoose.model('Group');
const AppSetting = mongoose.model('AppSetting');

export default async function(tournamentId, roundNumber) {
	let tournament = await Tournament.findById(tournamentId).catch(handleMongoError);
	let leaders = await Leaderboard.find({tournament: tournamentId}).sort({rank: 1}).catch(handleMongoError);
	const points = await AppSetting.find({code: /PTS.*/}).sort({code: 1}).catch(handleMongoError);
	const fines = await AppSetting.find({code: /FND.*/}).sort({code: 1}).catch(handleMongoError);

	leaders = filterLeaders(leaders);

	for (let j = 0; j < tournament.rounds.length; j++) {
		let round = tournament.rounds[j];

		if (round.number == roundNumber && !round.pointsGiven) {
			let groups = await Group.find({'tournaments.tournament': tournamentId}).catch(handleMongoError);

			groups.asyncForEach(async group => {
				group.tournaments.forEach(crossTournament => {
					if (crossTournament.tournament == tournamentId) {
						crossTournament.leaderboard.forEach(leaderboardCross => {
							leaderboardCross.roaster.forEach((cross, i) => {
								let compareList = leaders.filter(leader => leader.position == i+1);
								let found = compareList.find(obj => obj.player == cross.player);

								if (found != null && found.length > 0) {
									if (leaderboardCross.lastRoaster.length > 0 && cross.player != leaderboardCross.lastRoaster[i].player) {
										let penalty = fines[roundNumber - 1].value / 100.0;
										leaderboardCross.score += (points[i].value * penalty);
									} else {
										leaderboardCross.score += points[i].value;
									}
								}
							});

							leaderboardCross.lastRoaster = [...leaderboard.roaster];
						});

						setLeaderboardRank(crossTournament.leaderboard);
					}
				});

				await group.save().catch(handleMongoError);
			});

			tournament.rounds[j].pointsGiven = true;
			break;
		}
	}

	await tournament.save().catch(handleMongoError);
}

const setLeaderboardRank = function(leaderboard) {
	leaderboard = leaderboard.sort(comparePoints);

	for (let i = 0; i < leaderboard; i++) {
		leaderboard.rank = i + 1;
	}
}

const comparePoints = function(a ,b) {
	if (a.score > b.score) {
		return 1;
	}

	if (a.score < b.score) {
		return -1;
	}

	return 0;
}

const filterLeaders = function(leaderboard) {
	let leaders = [];

	for (let i = 0; i < leaderboard.legth; i++) {
		if (leaderboard[i-1]) {
			if (leaderboard[i].score == leaderboard[i-1].score) {
				leaderboard[i].position = leaderboard[i-1].position
			}
		}

		if (leaderboard[i].position == null) {
			leaderboard[i].position = i+1;
		}

		leaders.push(leaderboard[i]);

		if (leaders.length == 5) {
			break;
		}
	}

	return leaders;
}