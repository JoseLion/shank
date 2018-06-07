'use strict';

var generate = require('../utils/permissions.utils.js').generate_permission;

module.exports = {
  general: {
    reports_can_find_earnings: generate('find', [ 'all' ]),
    reports_can_find_funnel: generate('find', [ 'all' ]),
    reports_can_find_app_users: generate('find', [ 'all' ]),
    reports_can_find_ranking_by_tournament: generate('find', [ 'all' ]),
    reports_can_find_referrals: generate('find', [ 'all' ]),
    reports_can_find_player_payments: generate('find', [ 'all' ])
  }
};