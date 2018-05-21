import mongoose from 'mongoose';
import handleMongoError from './handleMongoError';

const Tournament = mongoose.model('Tournament');
const Leaderboard = mongoose.model('Leaderboard');
const Group = mongoose.model('Group');
const App_Setting = mongoose.model('App_Setting');

export default async function(tournamentId, roundNumber) {
	let tournament = await Tournament.findById(tournamentId).catch(handleMongoError);
	const tournamentLeaderboard = await Leaderboard.find({tournament: tournamentId, rank: {$ne: null}}).sort({rank: 1}).catch(handleMongoError);
	const points = await App_Setting.findOne({code: /PTS.*/}).sort({value: -1}).catch(handleMongoError);
	const fines = await App_Setting.findOne({code: /FND.*/}).sort({value: 1}).catch(handleMongoError);

	let leaders = filterLeaders(tournamentLeaderboard);

	for (let j = 0; j < tournament.rounds.length; j++) {
		let round = tournament.rounds[j];

		if (round.number == roundNumber && !round.pointsGiven) {
			let groups = await Group.find({'tournaments.tournament': tournamentId}).populate('tournaments.leaderboard.roaster').catch(handleMongoError);

			groups.asyncForEach(async group => {
				group.tournaments.forEach(crossTournament => {
					if (String(crossTournament.tournament) == String(tournamentId)) {
						crossTournament.leaderboard.forEach((leaderboardCross, j) => {
							let roundScore = 0;
							let comboMult = 0;

							leaderboardCross.roaster.forEach((cross, i) => {
								let compareList = leaders.filter(leader => leader.position == i+1);
								let found = compareList.filter(obj => String(obj.player) == String(cross.player));

								if (found != null && found.length > 0) {
									let hit = 0.0;

									if (leaderboardCross.lastRoaster.length > 0 && cross.player != leaderboardCross.lastRoaster[i]) {
										let penalty = 1.0 - (parseFloat(fines.values[roundNumber - 1]) / 100.0);
										hit = (parseFloat(points.values[i]) * penalty);
									} else {
										hit = points.values[i];
									}

									roundScore += parseFloat(hit);
									comboMult++;
									console.log(`User ${j}: +${hit} (x${comboMult})`);
								}
							});

							console.log(`Round ${roundNumber} Score: ${roundScore} (x${comboMult}) -> ${roundScore * comboMult}`);
							leaderboardCross.score += (roundScore * comboMult);
							leaderboardCross.lastRoaster = [...leaderboardCross.roaster];
							console.log(`User Score: ${leaderboardCross.score}`);
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
	leaderboard = leaderboard.sort((a, b) => {
		if (a.score < b.score) {
			return 1;
		}

		if (a.score > b.score) {
			return -1;
		}

		return 0;
	});

	leaderboard.forEach((leader, i) => {
		leader.rank = i+1;
	});
}

const filterLeaders = function(leaderboard) {
	let leaders = [];
	let previous = null;
	let pos = 1;

	for (let i = 0; i < leaderboard.length; i++) {
		let schema = Object.assign({}, leaderboard[i]);
		let leader = schema._doc;

		if (previous) {
			if (leader.totalScore == previous.totalScore) {
				leader.position = previous.position
			}
		}

		if (leader.position == null) {
			leader.position = pos;
			pos++;
		}

		leaders.push(leader);

		if (leader.position == 5) {
			break;
		}

		previous = Object.assign({}, leader);
	}

	return leaders;
}