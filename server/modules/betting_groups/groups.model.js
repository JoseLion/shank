let mongoose = require('mongoose');

let BettingGroupSchema = new mongoose.Schema({
  status: { type: Boolean, default: true },
  name: String,
  bet: String,
  tournaments: [
    {
      tournamentId: Number,
      tournamentName: String,
      users: [
        {
          _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          fullName: String,
          isWinner: Boolean,
          score: { type: Number, default: 0 },
          ranking: { type: Number, default: 0 },
          playerRanking: [
            {
              position: { type: Number },
              playerId: { type: Number },
              fullName: { type: String },
              photoUrl: { type: String },
              tournamentPosition: { type: Number, default: 0 },
              score: { type: Number, default: 0 },
              daySaved: { type: Date, default: new Date() },
              scoreAdded: {type: Boolean, default: false}
            }
          ],
        }
      ],
      status: { type: Boolean, default: true },
      myScore: Number,
      myRanking: Number
    }
  ],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  users: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
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
},
{ timestamps: { createdAt: 'created_at' , updatedAt: 'updated_at' }});

BettingGroupSchema.pre('save', function(next) {
  let self = this;
  self.bet = self.bet.trim();
  self.name = self.name.trim();
  next();
});

mongoose.model('BettingGroup', BettingGroupSchema);
