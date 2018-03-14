let express = require('express');
let router = express.Router();

let jwt = require('express-jwt');
let jwtConfig = require('../../config/jwt');

let auth = jwt({
	secret: jwtConfig.TOKEN_SECRET,
	userProperty: 'payload'
});

module.exports = function (model, path) {

	router.route(path)
	.post(function (req, res) {
		let data = req.body;
		let currentModel = new model(data);
		currentModel.save(function (err, res_data) {
			if (err) {
				res.ok({}, 'data not created.');
			} else {
				res.ok(res_data);
			}
		});
	})
	.get(auth, function (req, res) {
		model.find(function (err, data) {
			if (err) {
				res.send(err);
			}
			res.ok(data);
		});
	});

	router.route(path.concat('/:_id'))
	.put(auth, function (req, res) {
		model.findByIdAndUpdate(req.params, req.body, function (err, data) {
			if (err) {
				res.ok({}, 'Data not updated');
			} else {
				res.ok(data);
			}
		});
	})
	.get(function (req, res) {
		model.findById(req.params, function (err, data) {
			if (err) {
				res.ok({}, 'Data not found');
			} else {
				res.ok(data);
			}
		});
	})
	.delete(auth, function (req, res) {
		model.remove(req.params, function (err, data) {
			if (err) {
				res.ok({}, 'Data not removed');
			} else {
				res.ok([data]);
			}
		});
	});

	return router;
};