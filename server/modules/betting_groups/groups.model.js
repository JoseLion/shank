/**
 * Created by MnMistake on 9/26/2017.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

let BettingGroupSchema = new mongoose.Schema({
    name: String,
    users: [{type: ObjectId, ref: 'User'}],
    tournament: String,
    city: String,
    photo: {
        name: {type: String},
        path: {type: String}
    },
});

/*
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
*/

BettingGroupSchema.methods.setSomething = function (some) {
    this.surname = some;
};

mongoose.model('BettingGroup', BettingGroupSchema);