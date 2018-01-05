let mongoose = require('mongoose'),
    multer = require('multer'),
    fs = require('fs-extra'),

    User = mongoose.model('User'),
    BettingGroup = mongoose.model('BettingGroup'),
    path = '/users',

    router = require('../core/routes.js')(User, '/users'),
    auth = require('../../config/auth'),
    storage = multer.diskStorage({
        destination: function (req, file, cb) {
            let path = `public/uploads/admin_users/151515`;
            fs.mkdirsSync(path);
            cb(null, path);
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now())
        }
    });

let prepareRouter = function (app) {

    // Administrator part:
    router.post(`${path}/setUpAdminUser`, function(req, res) {
        User.findOne({email: req.body.email, profile: 1}).exec(function(err, user) {
            if(err) {
                res.serverError();
                return;
            } else if(user.hash != null && user.salt != null) {
                res.forbidden()
                return;
            }
            let userModel = new User(user);
            userModel.setPassword('1234');
            userModel.save(function(err) {
                if(err) {
                    res.serverError();
                    return
                }
                res.ok(userModel)
            })
        })
    })
    .post(`${path}/findUsers`, auth, function(req, res) {
        User.find(req.body)
        .populate('profile')
        .exec(function(err, users) {
            res.ok(users);
        });
    })

    // APP part:
    .post(`${path}/register`, function (req, res) {
        User.findOne({email: req.body.email})
        .exec(function(err, user) {
            if(err) { res.serverError(); return; }
            if(user) { res.ok({}, 'The email entered is already used.'); return; }

            let userModel = new User(req.body);
            userModel.setPassword(req.body.password);
            userModel.save(function(err, userFinal) {
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
            if(user) {
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
        .select('_id name surname email hash salt enabled type bettingGroups')
        .exec(function (err, user) {
            if (err) {
                res.ok({}, 'Al seleccionar usuarioss.');
                return;
            }
            res.ok(user);
        });
    })
    .post('/updateUser', function (req, res) {
        let data = req.body;
        console.log('req')
        console.log(data)

        let upload = multer({storage: storage})
        upload.single('picture')(req, res, function (err) {
            if (err) {
                // An error occurred when uploading
                console.log(err)
                res.ok({}, err.toString());
            }
            /*                console.log("data")
            console.log(data)
            let new_user = {
            name:data.name,
            photo: {
            name: {type: String},
            path: {type: String}
        },
    };*/
    res.ok({});
    // Everything went fine
})
})

;
return router;
};

module.exports = prepareRouter;
