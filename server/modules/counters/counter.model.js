let mongoose = require('mongoose');

let CounterSchema = new mongoose.Schema({
    _id: String,
    seq: Number
});

CounterSchema.statics.getNextSequence = function(name, callBack) {
    return this.findByIdAndUpdate(name, {$inc: {seq: 1}}, {new: true}, callBack);
}

mongoose.model('Counter', CounterSchema);
