import mongoose from 'mongoose';
import express from 'express';
import auth from '../../config/auth';
import handleMongoError from '../../service/handleMongoError';
import apn from 'apn';
import Constants from '../../config/constants';

const AppUser = mongoose.model('App_User');
const basePath = '/app_user'
const router = express.Router();

export default function(app) {
    router.post(`${basePath}/register`, async (request, response) => {
        try {
            const found = await AppUser.findOne({email: request.body.email});

            if (found) {
                return response.server_error('This email is already used in another account');
            }

            let appUser = new AppUser(request.body);
            appUser.setPassword(request.body.password);
            appUser = await appUser.save();

            return response.ok({user: appUser, token: appUser.generateJwt()});
        } catch (error) {
            handleMongoError(error);
            return response.server_error(error);
        }
    });

    router.post(`${basePath}/facebookSignin`, async (request, response) => {
        try {
            let found = await AppUser.findOne({email: request.body.email});

            if (found && found.isFacabookUser) {
                return response.ok({user: found, token: found.generateJwt()});
            } else if (found && !found.isFacabookUser) {
                found.fullName = request.body.fullName;
                found.isFacabookUser = true;
                found = new AppUser(found);
                found.setPassword(request.body.facebookId);

                found = await found.save();
                return response.ok({user: found, token: found.generateJwt()});
            } else {
                let appUser = new AppUser(request.body);
                appUser.isFacabookUser = true;
                appUser.setPassword(request.body.facebookId);
                
                appUser = await appUser.save();
                return response.ok({user: appUser, token: appUser.generateJwt()});
            }
        } catch (error) {
            handleMongoError(error);
            return response.server_error(error);
        }
    });

    router.post(`${basePath}/registerPushNotifications`, auth, async (request, response) => {
        try {
            let appUser = await AppUser.findById(request.payload._id);
            console.log("request.body: ", request.body);
            appUser.notifications = request.body;
            await appUser.save();

            return response.ok();
        } catch (error) {
            handleMongoError(error);
            return response.server_error(error);
        }
    });

    router.get(`/apns/send/:token`, async (request, response) => {
        let options = {
            token: {
                key: Constants.APNS_KEY_PATH,
                keyId: Constants.APNS_KEY_ID,
                teamId: Constants.APNS_TEAM_ID
            }
        };

        const apnProvider = new apn.Provider(options);
        const notif = new apn.Notification();
        notif.expiry = Math.floor(Date.now() / 1000) + 3600;
        notif.badge = 1;
        notif.sound = 'ping.aiff';
        notif.alert = "You have a new message";
        notif.payload = {'messageFrom': 'Jose Lion'};
        notif.topic = 'com.elevision.shank';

        const result = await apnProvider.send(notif, request.params.token);
        return response.ok(result);
    });

    return router;
}