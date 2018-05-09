'use strict';

import adminUserModel from './admin_users/admin.users.model';
import groupModel from './group/group.model';
import tournamentModel from './tournament/tournament.model';
import archiveModel from './archive/archive.model';
import leaderboardModel from './leaderboard/leaderboard.model';

import profileModel from './profiles/profiles.model';
import userModel from './users/users.model';
import appSettingsModel from './app_settings/app.settings.model';
import playerModel from './player/player.model';

import authRoutes from './auth/auth.routes';
import adminUsersRoutes from './admin_users/admin.users.routes';
import groupRoute from './group/group.route';
import tournamentRoute from './tournament/tournament.route';
import archiveRoute from './archive/archive.route';
import leaderboardRoute from './leaderboard/leaderboard.route';

import profilesRoute from './profiles/profiles.routes';
import userRoute from './users/users.routes';
import appSettingsRoute from './app_settings/app.settings.routes';
import platerRoute from './player/player.routes';
import permissions from './permissions/permissions.routes';

let api_prefix = '/api';

export default function(app) {
  app.use(api_prefix, authRoutes(app));
  app.use(api_prefix, adminUsersRoutes(app));
	app.use(api_prefix, groupRoute(app));
	app.use(api_prefix, tournamentRoute(app));
	app.use(api_prefix, archiveRoute(app));
	app.use(api_prefix, leaderboardRoute(app));

	app.use(api_prefix, profilesRoute(app));
	app.use(api_prefix, userRoute(app));
	app.use(api_prefix, appSettingsRoute(app));
	app.use(api_prefix, platerRoute(app));
  app.use(api_prefix, permissions()); 
}