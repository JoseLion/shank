let mongoose = require('mongoose');

let AppSettingSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true
  },
  name: String,
  value: String,
  type: String
},
{ timestamps: { createdAt: 'created_at' , updatedAt: 'updated_at' }});

mongoose.model('AppSetting', AppSettingSchema);
