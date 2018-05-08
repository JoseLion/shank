'use strict';

import adminUserModel from './admin_users/admin.users.model';
import groupModel from './group/group.model';
import tournamentModel from './tournament/tournament.model';
import archiveModel from './archive/archive.model';
import leaderboardModel from './leaderboard/leaderboard.model';

import profileModel from './profiles/profiles.model';
import userModel from './users/user.model';
import appSettingModel from './app_settings/appSetting.model';
import playerModel from './player/player.model';

import authRoutes from './auth/auth.routes';
import adminUsersRoutes from './admin_users/admin.users.routes';
import groupRoute from './group/group.route';
import tournamentRoute from './tournament/tournament.route';
import archiveRoute from './archive/archive.route';
import leaderboardRoute from './leaderboard/leaderboard.route';

import profilesRoute from './profiles/profiles.routes';
import userRoute from './users/user.routes';
import appSettingRoute from './app_settings/appSetting.routes';
import platerRoute from './player/player.routes';

let api_prefix = '/admin/api';

export default function(app) {
  app.use(api_prefix, authRoutes(app));
  app.use(api_prefix, adminUsersRoutes(app));
	app.use('/api', groupRoute(app));
	app.use('/api', tournamentRoute(app));
	app.use('/api', archiveRoute(app));
	app.use('/api', leaderboardRoute(app));

	app.use('/api', profilesRoute(app));
	app.use('/api', userRoute(app));
	app.use('/api', appSettingRoute(app));
	app.use('/api', platerRoute(app));
}