import { CronJob } from 'cron';
import mongoose from 'mongoose';
import handleMongoError from './handleMongoError';

const Job = mongoose.model('Job');

export default class {
    constructor() {
        if (global.runningJobs == null) {
            global.runningJobs = [];
        }
    }

    async create(cronTime, functionName, reference) {
        try {
            if (functionName ==null || functionName == '') {
                throw "The name of the function to excecute is required";
            }

            if (this[functionName] == null) {
                throw `The function ${functionName} could not be found in cronJobs.js`;
            }

            const cronJob = new CronJob({
                cronTime: cronTime,
                onTick: this[functionName],
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
            const job = await Job.create({
                cronTime: cronTime,
                onTick: functionName,
                reference: reference
            }).catch(handleMongoError);

            cronJob._id = job._id;
            global.runningJobs.push(cronJob);
            return cronJob;
        } catch (error) {
            console.log("CronJobs Error: ", error);
            return null;
        }
    }

    async restoreRunningJobs() {
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
}