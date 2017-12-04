let mongoose = require('mongoose');
let Counter = mongoose.model('Counter');
let Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

let BettingGroupSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    groupStatus: Boolean,
    users: [{
        userId: {type: Number},
        isWinner: Boolean,
        name: {type: String},
        score: {type: Number},
        currentRanking: {type: Number},
        currentDailyMovements: {type: Number},
        dailyMovementsDone: {type: Boolean},
        playerRanking: [{
            name: {type: String},
            lastName: {type: String},
            urlPhoto: {type: String},
            playerId: {type: String},
            TR: {type: Number},
            score: {type: Number},
            position: {type: Number}
        }],
    }],
    prize: String,
    groupToken: String,
    tournament: String,
    tournamentName: String,
    city: String,
    photo: {
        name: {type: String},
        path: {type: String}
    },
});

BettingGroupSchema.pre('save', function(next) {
    let self = this;
    Counter.getNextSequence('bettingGroups', function(err, counter) {
        if(err) {
            self._id = -1;
            next(err)
        } else {
            self._id = counter.seq
            next();
        }
    });
});

BettingGroupSchema.methods.setSomething = function (some) {
    this.surname = some;
};

mongoose.model('BettingGroup', BettingGroupSchema);
