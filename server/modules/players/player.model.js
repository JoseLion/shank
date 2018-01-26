let mongoose = require('mongoose');

let PlayerSchema = new mongoose.Schema({
  playerId: { type: Number, unique: true},
  fullName: String,
  photoUrl: String,
  status: {type: Boolean, default: true}
},
{ timestamps: { createdAt: 'created_at' , updatedAt: 'updated_at' }});

mongoose.model('Player', PlayerSchema);
