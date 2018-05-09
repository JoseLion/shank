let mongoose = require('mongoose');

let AppSettingSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true
  },
  name: String,
  values: [String]
},
{ timestamps: { createdAt: 'created_at' , updatedAt: 'updated_at' }});

mongoose.model('AppSetting', AppSettingSchema);
