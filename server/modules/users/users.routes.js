let mongoose = require('mongoose');
let User = mongoose.model('User');

let multer  = require('multer');
let fs = require('fs-extra');

multer.diskStorage({
  destination: function (req, file, cb) {
    let path = `../../uploads/admin_users/${req.body.user}`;
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

let auth = require('../../config/auth');
let guard = require('../../config/guard')();

let prepareRouter = function(app) {

  let path = '/users';
  let router = require('../core/routes.js')(User, path);
  
  router
  .get('/profile', auth, function(req, res) {
    if (!req.payload._id) {
      res.ok({}, 'Usuario no autorizado.');
      return;
    }
    
    User
    .findById(req.payload._id)
    .select('_id name surname email cell_phone gender birthdate address fb')
    .exec(function(err, user) {
      if (err) {
        res.ok({}, 'Al seleccionar usuario.');
        return;
      }
      
      res.ok(user);
    });
  });
  
  return router;
};

module.exports = prepareRouter;