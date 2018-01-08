let mongoose = require('mongoose');
let Counter = mongoose.model('Counter');

let BettingGroupSchema = new mongoose.Schema({
    _id: Number,
    creationDate: { type: Date, default: Date.now() },
    updateDate: Date,
    status: { type: Boolean, default: true },

    name: String,
    bet: String,
    tournaments: [
        {
            tournamentId: Number,
            tournamentName: String,
            users: [
                {
                    _id: { type: Number, ref: 'User' },
                    fullName: String,
                    isWinner: Boolean,
                    score: { type: Number, default: 0 },
                    ranking: { type: Number, default: 0 },
                    playerRanking: [
                        {
                            position: { type: Number },
                            playerId: { type: Number },
                            firstName: { type: String },
                            lastName: { type: String },
                            photoUrl: { type: String },
                            tournamentPosition: { type: Number },
                            score: { type: Number }
                        }
                    ],
                }
            ],
            status: { type: Boolean, default: true },
            myScore: Number,
            myRanking: Number
        }
    ],
    owner: { type: Number, ref: 'User' },
    users: [
        { type: Number, ref: 'User' }
    ],
    groupToken: String,
    photo: {
        name: {type: String},
        path: {type: String}
    },
    activeTournaments: { type: Number, default: 1},
    myScore: Number,
    myRanking: Number,
    isOwner: Boolean
});

BettingGroupSchema.pre('save', function(next) {
    let self = this;
    self.bet = self.bet.trim();
    self.name = self.name.trim();
    if(self._id == null) {
        Counter.getNextSequence('bettingGroups', function(err, counter) {
            if(err) {
                self._id = -1;
                next(err)
            } else {
                self._id = counter.seq
                next();
            }
        });
    } else {
        self.updateDate = new Date();
        next();
    }
});

mongoose.model('BettingGroup', BettingGroupSchema);
