import { CronJob } from 'cron';

export default class {
    constructor() {
        console.log("global.job: ", global.job);
    }

    create(cronTime, functionName) {
        global.job = new CronJob({
            cronTime: cronTime,
            onTick: this[functionName],
            onComplete: function() {
                console.log("ID: ", this._id);
            },
            start: true,
            timeZone: 'America/Guayaquil'
        });

        global.job._id = 'sdf4dfgad43456wefgzd'
    }

    test() {
        console.log('FIRE!');
    }
}