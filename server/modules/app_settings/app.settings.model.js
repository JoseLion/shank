let mongoose = require('mongoose');

let App_SettingSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true
  },
  name: String,
  values: [String]
},
{ timestamps: { createdAt: 'created_at' , updatedAt: 'updated_at' }});

mongoose.model('App_Setting', App_SettingSchema);
