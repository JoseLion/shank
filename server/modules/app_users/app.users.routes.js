import mongoose, { Promise } from 'mongoose';
import express from 'express';
import auth from '../../config/auth';
import handleMongoError from '../../service/handleMongoError';
import PushNotification from '../../service/pushNotification';
import multer from 'multer';
import Request from 'request';
import Q from 'q';

const AppUser = mongoose.model('App_User');
const Archive = mongoose.model('Archive');
const basePath = '/app_user'
const router = express.Router();

export default function (app) {
    router.post(`${basePath}/register`, async (request, response) => {
        try {
            const found = await AppUser.findOne({ email: request.body.email });

            if (found) {
                return response.server_error('This email is already used in another account');
            }

            let appUser = new AppUser(request.body);
            appUser.setPassword(request.body.password);
            appUser = await appUser.save();

            return response.ok({ user: appUser, token: appUser.generateJwt() });
        } catch (error) {
            return response.server_error(error);
        }
    });

    router.post(`${basePath}/facebookSignin`, async (request, response) => {
        try {
            let found = await AppUser.findOne({ email: request.body.email });

            if (found && found.isFacabookUser) {
                return response.ok({user: found, token: found.generateJwt()});
            } else if (found && !found.isFacabookUser) {
                const photoData = await imageUrlToBytes(request.body.photoUrl);
                const archive = await Archive.create({
                    name: `facebook-${request.body.facebookId}.${photoData.type.split('/')[1]}`,
                    type: photoData.type,
                    size: photoData.size,
                    data: photoData.data
                }).catch(handleMongoError);

                found.fullName = request.body.fullName;
                found.isFacabookUser = true;
                found.photo = archive;
                found = new AppUser(found);
                found.setPassword(request.body.facebookId);

                found = await found.save();
                return response.ok({user: found, token: found.generateJwt()});
            } else {
                const photoData = await imageUrlToBytes(request.body.photoUrl);
                console.log("photoData: ", photoData);
                const archive = await Archive.create({
                    name: `facebook-${request.body.facebookId}.${photoData.type.split('/')[1]}`,
                    type: photoData.type,
                    size: photoData.size,
                    data: photoData.data
                }).catch(handleMongoError);     

                let appUser = new AppUser(request.body);
                appUser.isFacabookUser = true;
                appUser.photo = archive;
                appUser.setPassword(request.body.facebookId);

                appUser = await appUser.save();
                return response.ok({user: appUser, token: appUser.generateJwt()});
            }
        } catch (error) {
            response.server_error(error);
        }
    });

    router.post(`${basePath}/registerNotificationsToken`, auth, async (request, response) => {
        try {
            let appUser = await AppUser.findById(request.payload._id);
            appUser.notifications.push(request.body);
            await appUser.save();

            return response.ok(appUser.notifications);
        } catch (error) {
            response.server_error(error);
        }
    });

    router.get(`/apns/send/:id`, async (request, response) => {
        const appUser = await AppUser.findById(request.params.id);
        const pushNotification = new PushNotification();

        appUser.notifications.asyncForEach(async notifObj => {
            pushNotification.send({ token: notifObj.token, os: notifObj.os, alert: 'New message from Shank' });
        });

        return response.ok();
    });

    router.get('/app_profile', auth, async (req, res) => {
        if (!req.payload._id) {
            return res.server_error('Unauthorized.');
        }

        AppUser
            .findById(req.payload._id)
            .select('_id fullName email photo country gender')
            .exec(function (err, user) {
                if (err) {
                    return res.server_error(err);
                }

                res.ok(user);
            });
    });

    router.post('/update_profile_with_image', auth, multer().single('file'), async (req, res) => {
        try {
            if (!req.payload._id) {
                return res.server_error('Unauthorized.');
            }

            let user = JSON.parse(request.body.user);

            let promises = [];
  			let archive_id;

            if (req.file) {
                archive_id = mongoose.Types.ObjectId();

                let archive_one = new Archive({
                    _id: archive_id,
                    name: req.file.originalname,
                    type: req.file.mimetype,
                    size: req.file.size,
                    data: req.file.buffer
                });

                if (user.photo) {
                    promises.push(Archive.findByIdAndRemove(user.photo).exec());
                }

                promises.push(archive_one.save());
                user.photo = archive_id;
            }

            promises.push(AppUser.update({_id: req.payload._id}, user).exec());

            Q.all(promises).then(() => {
                res.ok(user);
            }, (err) => {
                res.server_error(err);
            });
        } catch (error) {
            return res.server_error(error);
        }
    });

    router.post('/update_profile', auth, async (req, res) => {
        try {
            if (!req.payload._id) {
                return res.server_error('Unauthorized.');
            }

            AppUser
                .findByIdAndUpdate({ _id: req.payload._id }, req.body, (err, data) => {
                    if (err) {
                        return res.server_error(err);
                    }

                    res.ok(req.body);
                })
        } catch (error) {
            return response.server_error(error);
        }
    });

    return router;
}

function imageUrlToBytes(url) {
    return new Promise(function (resolve, reject) {
        const photoRequest = Request.defaults({ encoding: null });

        photoRequest.get(url, function (error, response, body) {
            try {
                if (error) {
                    reject(error);
                    return;
                }

                resolve({
                    type: response.headers['content-type'],
                    size: response.headers['content-length'],
                    data: body
                });
            } catch (error) {
                reject(error);
            }
        });
    });
}