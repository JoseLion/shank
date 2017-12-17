let mongoose = require('mongoose');
let Counter = mongoose.model('Counter');
let Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

let BettingGroupSchema = new mongoose.Schema({
    _id: Number,
    creationDate: { type: Date, default: Date.now() },
    updateDate: Date,
    status: { type: Boolean, default: true },
    name: String,
    bet: String,
    tournamentId: Number,
    tournamentName: String,
    users: [
        {
            userId: { type: Number },
            isWinner: Boolean,
            name: { type: String },
            score: { type: Number, default: 0 },
            currentRanking: { type: Number, default: 0 },
            currentDailyMovements: { type: Number, default: 0 },
            dailyMovementsDone: { type: Boolean, default: false },
            playerRanking: [
                {
                    name: { type: String },
                    lastName: { type: String },
                    urlPhoto: { type: String },
                    playerId: { type: String },
                    TR: { type: Number },
                    score: { type: Number },
                    position: { type: Number }
                }
            ],
        }
    ],
    groupToken: String,
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
