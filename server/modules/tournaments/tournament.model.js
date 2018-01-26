let mongoose = require('mongoose');

let TournamentSchema = new mongoose.Schema({
  tournamentId: { type: Number, unique: true},
  tournamentName: String,
  startDate: Date,
  endDate: Date,
  rounds: [
    {
      roundId: Number,
      number: Number,
      day: Date,
      player: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
    }
  ],
  status: {type: Boolean, default: true}
},
{ timestamps: { createdAt: 'created_at' , updatedAt: 'updated_at' }});

mongoose.model('Tournament', TournamentSchema);
