let mongoose = require('mongoose'),
Player = mongoose.model('Player'),
path = '/players',
router = require('../core/routes.js')(Player, path),
auth = require('../../config/auth');

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
  });

  return router;
};
