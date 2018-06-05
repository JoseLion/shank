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
      let players = await fantasy.get_players().catch(error => console.log(error));
      
      await players.asyncForEach(async player => {
        let player_in = await Player.findOne({playerID: player.playerID}).catch(error => console.log(error));
        
        if (player_in) {
          player_in.set(player);
          await player_in.save().catch(error => console.log(error));
        } else {
          await Player.create(player).catch(error => console.log(err));
        }
      });

      res.ok();
    } catch (e) {
      res.server_error(e);
    }
  });

  return router;
};
