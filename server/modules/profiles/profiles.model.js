import mongoose from 'mongoose';

let ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  role: {type: Number, default: 1},
  permissions: [String],
  enabled: {type: Boolean, default: true }
},
{ timestamps: { createdAt: 'created_at' , updatedAt: 'updated_at' }});

mongoose.model('Profile', ProfileSchema);