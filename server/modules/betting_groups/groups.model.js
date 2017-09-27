/**
 * Created by MnMistake on 9/26/2017.
 */
let mongoose = require('mongoose');

let BettingGroupSchema = new mongoose.Schema({
    name: String,
    users: [{type: ObjectId, ref: 'User'}],
    tournament: {type: ObjectId, ref: 'Tournament'},
    city: String,
    photo: {
        name: {type: String},
        path: {type: String}
    },
});

BettingGroupSchema.methods.setSomething = function (some) {
    this.surname = some;
};

mongoose.model('BettingGroup', BettingGroupSchema);