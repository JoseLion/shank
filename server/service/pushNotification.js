import apn from 'apn';
import mongoose from 'mongoose';
import Constants from '../config/constants';
import * as FireBaseAdmin from 'firebase-admin';
import ServiceAccount from '../certificates/shank-e5ddc-firebase-adminsdk-elcvz-df37323348.json';
import handleMongoError from './handleMongoError';

export default class {
    constructor() {
        if (FireBaseAdmin.apps.length == 0) {
            FireBaseAdmin.initializeApp({
                credential: FireBaseAdmin.credential.cert(ServiceAccount),
                databaseURL: 'https://shank-e5ddc.firebaseio.com'
            });
        }

        let options = {
            token: {
                key: Constants.APNS_KEY_PATH,
                keyId: Constants.APNS_KEY_ID,
                teamId: Constants.APNS_TEAM_ID
            }
        };

        this.apnProvider = new apn.Provider(options);
    }

    async send({ token, os, alert, payload } = new Object()) {
        let response;

        if (!token || token == '') {
            throw "Token cannot be null or empty";
        }

        if (!os || os == '') {
            throw "OS must be passed to send notification";
        }

        if (os === 'ios') {
            const notif = new apn.Notification();
            notif.expiry = Math.floor(Date.now() / 1000) + 3600;
            notif.badge = 1;
            notif.sound = 'ping.aiff';
            notif.alert = alert;
            notif.payload = payload;
            notif.topic = Constants.BUNDLE_ID;
            response = await this.apnProvider.send(notif, token);
        }

        if (os === 'android') {
            const message = {
                token: token,
                android: {
                    data: payload,
                    restrictedPackageName: Constants.BUNDLE_ID,
                    notification: {
                        title: 'Shank',
                        body: alert,
                        sound: 'notification_sound'
                    }
                }
            };

            response = await FireBaseAdmin.messaging().send(message).catch(async error => {
                if (error.code == 'messaging/invalid-argument') {
                    const AppUser = mongoose.model('App_User');
                    const user = await AppUser.findOne({'notifications.token': token}).catch(handleMongoError);
                    
                    if (user) {
                        let index = -1;
                        user.notifications.forEach((notif, i) => {
                            if (notif.token == token) {
                                index = i;
                                return;
                            }
                        });

                        if (index > -1) {
                            user.notifications.splice(index, 1);
                            await user.save().catch(handleMongoError);
                            console.log("Exception[FireBaseAdmin.messaging().send(...)]: ", "Invalid token, it was removed from user register!");
                        }
                    }
                    
                    return;
                }

                console.error("Exception[FireBaseAdmin.messaging().send(...)]: ", error);
            });
        }

        return response;
    }
}