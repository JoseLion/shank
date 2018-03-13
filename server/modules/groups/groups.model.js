let mongoose = require('mongoose');

let GroupSchema = new mongoose.Schema({
	status: {type: Boolean, default: true},
	name: String,
	bet: String,
	photoUrl: String,
	tournaments: [{
		tournament: {type: mongoose.Schema.Types.ObjectId, ref: 'Tournament'},
	}]
}, {
	timestamps: {
		creationDate: 'creationDate',
		updateDate: 'updateDate'
	}
});

GroupSchema.pre('save', next => {
	this.name = this.name.trim();
	this.bet = this.bet.trim();
	next();
});

mongoose.model('Group', GroupSchema);