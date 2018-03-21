'use strict';


import groupModel from './group/group.model';
import tournamentModel from './tournament/tournament.model';
import archiveModel from './archive/archive.model';
import leaderboardModel from './leaderboard/leaderboard.model';

import profileModel from './profiles/profile.model';
import userModel from './users/user.model';
import appSettingModel from './app_settings/appSetting.model';
import playerModel from './player/player.model';



import authRoute from './auth/auth.route';
import groupRoute from './group/group.route';
import tournamentRoute from './tournament/tournament.route';
import archiveRoute from './archive/archive.route';
import leaderboardRoute from './leaderboard/leaderboard.route';

import profileRoute from './profiles/profile.routes';
import userRoute from './users/user.routes';
import appSettingRoute from './app_settings/appSetting.routes';
import platerRoute from './player/player.routes';

export default function(app) {
	app.use('/api', authRoute(app));
	app.use('/api', groupRoute(app));
	app.use('/api', tournamentRoute(app));
	app.use('/api', archiveRoute(app));
	app.use('/api', leaderboardRoute(app));

	app.use('/api', profileRoute(app));
	app.use('/api', userRoute(app));
	app.use('/api', appSettingRoute(app));
	app.use('/api', platerRoute(app));
}