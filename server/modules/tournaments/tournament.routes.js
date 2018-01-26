let mongoose = require('mongoose'),
Tournament = mongoose.model('Tournament'),
path = '/tournaments',
router = require('../core/routes.js')(Tournament, path),
auth = require('../../config/auth');

module.exports = (app) => {
  router
  .post(`${path}/findTournaments`, auth, (req, res) => {
    try {
      Tournament.find().populate('rounds.player').exec((err, tournaments) => {
        if(err) {
          console.error('ERROR! ', err);
          res.serverError();
          return;
        }
        res.ok(tournaments);
        return;
      });
    } catch (e) {
      console.error('FATAL! ', e);
      res.serverError();
      return;
    }
  })
  .post(`${path}/create`, auth, (req, res) => {
    try {
      let tournamentModel = new Tournament(req.body);
      tournamentModel.save((err, final) => {
        if(err) {
          console.error('ERROR! ', err);
          res.serverError();
          return;
        }
        res.ok(final);
        return;
      });
    } catch (e) {
      console.error('FATAL! ', e);
      res.serverError();
      return;
    }
  })
  .post(`${path}/update`, auth, (req, res) => {
    try {
      Tournament.findByIdAndUpdate(req.body._id, { $set: req.body }, { new: true}, (err, final) => {
        if(err) {
          console.error('ERROR! ', err);
          res.serverError();
          return;
        }
        res.ok(final);
        return;
      });
    } catch (e) {
      console.error('FATAL! ', e);
      res.serverError();
      return;
    }
  });

  return router;
};
