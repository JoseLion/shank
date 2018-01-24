let mongoose = require('mongoose');

let CounterSchema = new mongoose.Schema({
  seq: Number
},
{ timestamps: { createdAt: 'created_at' , updatedAt: 'updated_at' }});

CounterSchema.statics.getNextSequence = function(name, callBack) {
  return this.findByIdAndUpdate(name, {$inc: {seq: 1}}, {new: true}, callBack);
}

mongoose.model('Counter', CounterSchema);