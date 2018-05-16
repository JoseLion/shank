'use strict';

let mongoose = require('mongoose');
let Tournament = mongoose.model('Tournament');
let Leaderboard = mongoose.model('Leaderboard');
let Player = mongoose.model('Player');
let fs = require("fs");

import fantasy from '../../service/fantasy';

let load_leaderboard = async (req, res) => {
  try {
    
    let tournament = await Tournament.findOne({_id: req.body._id}).catch((err) => res.server_error());
    let leaderboard = await fantasy.get_leaderboard_by_tournament(tournament.tournamentID);
    //let leaderboard = require('./fantasy.leaderboard.data.json');
    
    await leaderboard.players.asyncForEach(async player => {
      let leaderboard_in = await Leaderboard.findOne({playerTournamentID: player.playerTournamentID}).catch((err) => console.log(err));
      player.tournament = tournament;
      player.player = await Player.findOne({playerID: player.playerID}).catch((err) => console.log(err));
          
      if (leaderboard_in) {
      	leaderboard_in.set(player);
      	await leaderboard_in.save().catch((err) => console.log(err));
      }
      else {
      	await Leaderboard.create(player).catch((err) => console.log(err));
      }
    });
      
    res.ok({});
  } catch(e) {
		console.log(e, '---------------');
    res.server_error();
  }
};

exports.load_leaderboard = (req, res) => {
  load_leaderboard(req, res);
};