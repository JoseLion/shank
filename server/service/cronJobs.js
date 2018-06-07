import { CronJob } from 'cron';
import mongoose from 'mongoose';
import handleMongoError from './handleMongoError';
import PushNotiications from './pushNotification';
import Fantasy from './fantasy';
import AssignPoints from './assignPoints';

const Job = mongoose.model('Job');
const pushNotifications = new PushNotiications();

export default class {
    constructor() {

    }

    static async create({ cronTime, functionName, reference, args } = new Object()) {
        try {
            const self = this;

            if (functionName ==null || functionName == '') {
                throw "The name of the function to excecute is required";
            }

            if (this[functionName] == null) {
                throw `The static function ${functionName} could not be found in cronJobs.js`;
            }

            const cronJob = new CronJob({
                cronTime: cronTime,
                onTick: function() {
                    const shouldContinue = self[functionName](args);

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
                args: JSON.stringify(args),
                reference: reference
            }).catch(handleMongoError);

            cronJob._id = job._id;
            global.runningJobs.push(cronJob);
            return cronJob;
        } catch (error) {
            throw "CronJobs [create] Error: " + error;
        }
    }

    static async remove({ reference } = new Object()) {
        try {
            const job = await Job.findOne({ reference }).catch(handleMongoError);

            if (job) {
                let index;
                global.runningJobs.forEach((running, i) => {
                    if (String(running._id) === String(job._id)) {
                        index = i;
                        return;
                    }
                });

                if (index > -1) {
                    global.runningJobs[index].stop();
                    global.runningJobs.splice(index, 0);
                }
                
                job.remove();
            }
        } catch (error) {
            throw "CronJobs [remove] Error: " + error;
        }
    }

    static async restoreRunningJobs() {
        try {
            const self = this;
            const jobs = await Job.find().catch(handleMongoError);

            jobs.forEach(job => {
                if (job.onTick ==null || job.onTick == '') {
                    throw "The name of the function to excecute is required";
                }
    
                if (self[job.onTick] == null || typeof self[job.onTick] !== 'function') {
                    throw `The static function ${onTick} could not be found in cronJobs.js`;
                }

                const cronJob = new CronJob({
                    cronTime: job.cronTime,
                    onTick: function() {
                        const args = job.args ? JSON.parse(job.args) : null;
                        const shouldContinue = self[job.onTick](JSON.parse(args));

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
                cronJob._id = job._id;
                global.runningJobs.push(cronJob);
            });
        } catch (error) {
            throw "CronJob [restore] error: " + error;
        }
    }

    /**
     * FUNCTION TO BE EXCECUTED BY JOBS
     */

    static async tournamentStartReminder(id) {
        try {
            const Tournament = mongoose.model('Tournament');
            const Group = mongoose.model('Group');

            const tournament = await Tournament.findById(id).catch(handleMongoError);
            const groups = await Group.find({'tournaments.tournament': id}).populate('tournaments.leaderboard.user').catch(handleMongoError);
            await Fantasy.update_leaderboard(tournament.tournamentID).catch(error => console.error(error));

            groups.forEach(group => {
                group.tournaments.forEach(tournamentCross => {
                    if (String(tournamentCross.tournament) == String(tournament.id)) {
                        tournamentCross.leaderboard.forEach(leaderboardCross => {
                            leaderboardCross.user.notifications.forEach(pushObj => {
                                pushNotifications.send({
                                    token: pushObj.token,
                                    os: pushObj.os,
                                    alert: `Roster alert: Remember to make your picks before the tournament starts: Tomorrow in 15 hours. It’s time to make your picks for this week’s tournament`
                                });
                            });
                        });

                        return;
                    }
                }); 
            });
        } catch (error) {
            throw "Exception[tournamentStartReminder(id)]: " + error;
        }
    }

    static async tournamentAboutToBegin(id) {
        try {
            const Tournament = mongoose.model('Tournament');
            const Group = mongoose.model('Group');
            const tournament = await Tournament.findById(id).catch(handleMongoError);
            const groups = await Group.find({'tournaments.tournament': id}).populate('tournaments.leaderboard.user').catch(handleMongoError);
            const startDate = new Date(tournament.startDate);

            await Fantasy.update_leaderboard(tournament.tournamentID).catch(error => console.error(error));

            groups.forEach(group => {
                group.tournaments.forEach(tournamentCross => {
                    tournamentCross.leaderboard.forEach(leaderboardCross => {
                        leaderboardCross.user.notifications.forEach(pushObj => {
                            pushNotifications.send({
                                token: pushObj.token,
                                os: pushObj.os,
                                alert: `Don’t forget that the tournament starts today`
                            });
                        });
                    });
                });
            });
        } catch (error) {
            throw "Exception[tournamentStartReminder(id)]: " + error;
        }
    }

    static async assignPoints({ tournamentId, round }) {
        try {
            const Group = mongoose.model('Group');
            const Tournament = mongoose.model('Tournament');
            const tournament = await Tournament.findById(tournamentId).catch(handleMongoError);
            const groups = await Group.find({'tournaments.tournament': tournamentId}).populate('tournaments.leaderboard.user').catch(handleMongoError);

            await Fantasy.update_leaderboard(tournament.tournamentID).catch(error => console.error(error));
            await AssignPoints(tournamentId, round);
            
            groups.forEach(group => {
                group.tournaments.forEach(tournamentCross => {
                    tournamentCross.leaderboard.forEach(leaderboardCross => {
                        leaderboardCross.user.notifications.forEach(pushObj => {
                            pushNotifications.send({
                                token: pushObj.token,
                                os: pushObj.os,
                                alert: `The results of round ${round} are already. Look at your score`
                            });
                        });
                    });
                });
            });
        } catch (error) {
            throw "Exception[assignPoints({ tournamentId, round })]: " + error;
        }
    }
}