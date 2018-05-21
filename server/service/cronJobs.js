import { CronJob } from 'cron';
import mongoose from 'mongoose';
import handleMongoError from './handleMongoError';
import PushNotiications from './pushNotification';

const Job = mongoose.model('Job');

export default class {
    constructor() {

    }

    static async create({ cronTime, functionName, reference, args } = new Object()) {
        try {
            if (functionName ==null || functionName == '') {
                throw "The name of the function to excecute is required";
            }

            if (this[functionName] == null) {
                throw `The function ${functionName} could not be found in cronJobs.js`;
            }

            const cronJob = new CronJob({
                cronTime: cronTime,
                onTick: function() {
                    const shouldContinue = this[functionName](...args);

                    if (!shouldContinue) {
                        this.stop();
                    }
                },
                onComplete: async function() {
                    let index;
                    global.runningJobs.forEach((job, i) => {
                        if (job._id === this._id) {
                            index = i;
                            return;
                        }
                    });

                    if (index) {
                        global.runningJobs.splice(index, 1);
                    }

                    await Job.remove({_id: this._id}).catch(handleMongoError);
                },
                start: false,
                timeZone: 'Atlantic/Reykjavik'
            });

            cronJob.start();
            const job = await Job.create({
                cronTime: cronTime,
                onTick: functionName,
                reference: reference
            }).catch(handleMongoError);

            cronJob._id = job._id;
            global.runningJobs.push(cronJob);
            return cronJob;
        } catch (error) {
            throw "CronJobs Error: " + error;
        }
    }

    static async remove({ cronTime, onTick, reference } = new Object()) {
        try {
            const job = await Job.findOne(arguments[0]).catch(handleMongoError);

            if (job) {
                let index;
                global.runningJobs.forEach((running, i) => {
                    if (running._id === job._id) {
                        index = i;
                        return;
                    }
                });

                if (index > -1) {
                    global.runningJobs.splice(index, 0);
                }
                
                job.remove();
            }
        } catch (error) {
            throw "CronJobs Error: " + error;
        }
    }

    static async restoreRunningJobs() {
        const jobs = await Job.find().catch(handleMongoError);

        jobs.forEach(job => {
            const cronJob = new CronJob({
                cronTime: job.cronTime,
                onTick: this[job.onTick],
                onComplete: async function() {
                    let index;
                    global.runningJobs.forEach((job, i) => {
                        if (job._id === this._id) {
                            index = i;
                            return;
                        }
                    });

                    if (index) {
                        global.runningJobs.splice(index, 1);
                    }

                    await Job.remove({_id: this._id}).catch(handleMongoError);
                },
                start: false,
                timeZone: 'America/Guayaquil'
            });

            cronJob.start();
            cronJob._id = job._id;
            global.runningJobs.push(cronJob);
        });
        
        return true;
    }

    /**
     * FUNCTION TO BE EXCECUTED BY JOBS
     */

    tournamentStartReminder(id) {
        try {
            const pushNotifications = new PushNotiications();
            const Tournament = mongoose.model('Tournament');
            const Group = mongoose.model('Group');
            const tournament = Tournament.findById(id).catch(handleMongoError);
            const group = Group.find({'tournaments.tournament': id}).populate('tournaments.leaderboard.user').catch(handleMongoError);
            const startDate = new Date(tournament.startDate);

            group.tournaments.forEach(tournamentCross => {
                tournamentCross.leaderboard.forEach(leaderboardCross => {
                    leaderboardCross.user.notifications.forEach(pushObj => {
                        pushNotifications.send({
                            token: pushObj.token,
                            os: pushObj.os,
                            alert: `Roster alert: Remember to make your picks before the tournament starts: Tomorrow at ${startDate.getUTCHours()}:${startDate.getUTCMinutes()}. It’s time to make your picks for this week’s tournament`
                        });
                    });
                });
            });
        } catch (error) {
            throw "Exception: tournamentStartReminder(id) -> " + error;
        }
        
    }
}