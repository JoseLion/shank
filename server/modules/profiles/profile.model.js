let mongoose = require('mongoose');
let Counter = mongoose.model('Counter');

let ProfileSchema = new mongoose.Schema({
    _id: Number,
    creationDate: { type: Date, default: Date.now() },
    updateDate: Date,
    status: { type: Boolean, default: true },
    name: { type: String, unique: true}
});

ProfileSchema.pre('save', function(next) {
    let self = this;
    Counter.getNextSequence('profileId', function(err, counter) {
        if(err) {
            self._id = -1;
            next(err)
        } else {
            self._id = counter.seq
            next();
        }
    });
});

ProfileSchema.methods.changeStatus = function() {
    this.status = !this.status;
};

mongoose.model('Profile', ProfileSchema);
