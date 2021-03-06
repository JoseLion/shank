let mongoose = require('mongoose');

let ProfileSchema = new mongoose.Schema({
  status: {type: Boolean, default: true},
  name: {type: String},
  acronyms: {type: String, unique: true}
},
{ timestamps: { createdAt: 'created_at' , updatedAt: 'updated_at' }});

ProfileSchema.methods.changeStatus = function() {
  this.status = !this.status;
};

mongoose.model('Profile', ProfileSchema);
