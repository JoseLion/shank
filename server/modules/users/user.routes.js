let mongoose = require('mongoose');
let multer = require('multer');
let fs = require('fs-extra');

let User = mongoose.model('User');
let Profile = mongoose.model('Profile');
let path = '/users';

let router = require('../core/routes.js')(User, '/users');
let auth = require('../../config/auth');

let constants = require('../../config/constants');
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = `../server/public/shank/app_users/${req.payload._id}`;
    fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

//var upload =  multer({ storage: storage }).single('file');
var upload =  multer({ storage: storage });

let prepareRouter = function (app) {

  router
  .post(`${path}/findUsers`, auth, (req, res) => {
    Profile.findOne({acronyms: req.body.profile}).exec((err, profile) => {
      if (err) {
        res.serverError();
        return;
      }
      req.body.profile = profile;
      User.find(req.body).populate('profile').exec((err, users) => {
        if(err) {
          res.serverError();
          return;
        }
        res.ok(users);
        return;
      });
    });
  })
  .post(`${path}/save`, auth, (req, res) => {
    User.findOne({email: req.body.email}).exec((err, user) => {
      if(err) {
        res.serverError();
        return;
      }

      User.findByIdAndUpdate(req.body._id, { $set : req.body }, { new: true }, (err, final) => {
        if(err) {
          res.serverError();
          return;
        }
        res.ok(final);
        return;
      });
    });
  })

  .post(`${path}/register`, function (req, res) {
    User.findOne({email: req.body.email})
    .exec((err, user) => {
      if(err) { res.serverError(); return; }
      if(user) { res.ok({}, 'The email entered is already used.'); return; }

      let userModel = new User(req.body);
      userModel.setPassword(req.body.password);
      userModel.save((err, userFinal) => {
        if(err) { res.serverError(); return; }
        res.ok({user: userFinal, token: userFinal.generateJwt([])});
        return;
      });
    });
  })
  .post(`${path}/facebookSignin`, function (req, res) {
    User.findOne({email: req.body.email})
    .exec(function(err, user) {
      if(err) { res.serverError(); return; }

      let userModel;
      if(user && user.facebookId) {
        res.ok({user: user, token: user.generateJwt([])});
        return;
      } else if(user && !user.facebookId){
        user.fullName = req.body.fullName;
        user.facebookId = req.body.facebookId;
        user.photo = req.body.photo;
        userModel = new User(user);
      } else {
        userModel = new User(req.body);
        userModel.setPassword(req.body.facebookId);
      }
      userModel.save(function(err, userFinal) {
        if(err) { res.serverError(); return; }
        res.ok({user: userFinal, token: userFinal.generateJwt([])});
        return;
      });
    });
  })
  .post(`${path}/updateApp`, auth, function (req, res) {
    User.findOne({_id: req.body._id})
    .exec(function(err, user) {
      if(err) { res.serverError(); return; }
      let userModel = new User(user);
      if(req.body.photo) {
        console.log(req.body.photo);
      }
      userModel.fullName = req.body.fullName;
      userModel.birthDate = req.body.birthDate;
      userModel.gender = req.body.gender;
      userModel.country = req.body.country;
      userModel.city = req.body.city;
      userModel.cellPhone = req.body.cellPhone;

      userModel.save(function(err, userFinal) {
        if(err) { res.serverError(); return; }
        res.ok(userFinal);
        return;
      });
    });
  })
  .get('/profile', auth, function (req, res) {
    if (!req.payload._id) {
      res.ok({}, 'Usuario no autorizado.');
      return;
    }

    User
    .findById(req.payload._id)
    .select('_id name surname email')
    .exec(function (err, user) {
      if (err) {
        res.ok({}, 'Al seleccionar usuario.');
        return;
      }
      res.ok(user);
    });
  })
  .get('/allUsers', function (req, res) {
    User
    .find()
    .select('_id name surname email hash salt enabled type group')
    .exec(function (err, user) {
      if (err) {
        res.ok({}, 'Al seleccionar usuarioss.');
        return;
      }
      res.ok(user);
    });
  })
  .post('/updateUser', auth, upload.single('file'), function (req, res) {

    if (!req.payload._id) {
      res.ok({}, 'Not authorized.');
      return;
    }

    let req_body = JSON.parse(req.body.user);

    let data_to_update = {
      fullName: req_body.fullName,
      photo: {
        name: req.file.filename,
        path: `shank/app_users/${req.payload._id}/${req.file.filename}`
      }
    }

    User.update({_id: req.payload._id}, data_to_update, function(err, user_updated) {
      if (err) {
        return res.serverError();
      }

      res.ok({});
    });
  });

  return router;
};

module.exports = prepareRouter;
