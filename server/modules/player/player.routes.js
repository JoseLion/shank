let mongoose = require('mongoose');
let Player = mongoose.model('Player');
let path = '/players';
let router = require('../core/routes.js')(Player, path);
let auth = require('../../config/auth');
import fantasy from '../../service/fantasy';
var fs = require("fs");

module.exports = (app) => {
  router
  .post(`${path}/findPlayers`, auth, (req, res) => {
    try {
      Player.find().exec((err, players) => {
        if(err) {
          console.error('ERROR! ', err);
          res.server_error();
          return;
        }
        res.ok(players);
        return;
      });
    } catch (e) {
      console.error('FATAL! ', e);
      res.server_error();
      return;
    }
  })
  .delete(`${path}/removeAll`, auth, (req, res) => {
    try {
      Player.remove((err) => {
        if(err) {
          console.error('ERROR! ', err);
          res.server_error();
          return;
        }
        res.ok({success: true});
        return;
      });
    } catch (e) {
      console.error('FATAL! ', e);
      res.server_error();
      return;
    }
  })
  .post(`${path}/save`, auth, (req, res) => {
    try {
      let player = {
        playerId: req.body.PlayerID,
        fullName: req.body.FirstName + ' ' + req.body.LastName,
        photoUrl: req.body.PhotoUrl
      };
      Player.findOneAndUpdate({playerId: player.playerId}, { $set: player }, {new: true}, function(err, final) {
        if(!final) {
          let playerModel = new Player(player);
          playerModel.save((err, finalModel) => {
            if(err) {
              console.error('ERROR! ', err);
              res.server_error();
              return;
            }
            res.ok(finalModel);
            return;
          });
        } else {
          res.ok(final);
          return;
      }
      });
    } catch (e) {
      console.error('FATAL! ', e);
      res.server_error();
      return;
    }
  })
  .get('/load_players', async (req, res) => {
    try {
      //https://gyandeeps.com/json-file-write/
      //let players = await fantasy.get_players(req.body.year);
      let players = require('./fantasy.players.data.json');
      
      console.log(players.length, '-----------');
      players.asyncForEach(async player => {
        //console.log("--------------------");
        let player_in = await Player.findOne({playerID: player.playerID}).catch(err => {console.log(err);});
        
        if (player_in) {
          player_in.set(player);
          await player_in.save().catch((err) => {console.log(err);});
        }
        else {
          await Player.create(player).catch((err) => {console.log(err);});
        }
      });
    } catch (e) {
      res.server_error();
    }
  });

  return router;
};
