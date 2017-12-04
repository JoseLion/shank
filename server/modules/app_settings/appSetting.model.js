let mongoose = require('mongoose'),
    Counter = mongoose.model('Counter');

let AppSettingSchema = new mongoose.Schema({
    _id: Number,
    code: {
        type: String,
        unique: true
    },
    name: String,
    value: String,
    type: String
});

AppSettingSchema.pre('save', function(next) {
    let self = this;
    Counter.getNextSequence('appSettings', function(err, counter) {
        if(err) {
            self._id = -1;
            next(err)
        } else {
            self._id = counter.seq
            next();
        }
    });
});

mongoose.model('AppSetting', AppSettingSchema);
