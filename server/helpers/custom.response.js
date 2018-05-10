var express = require("express");

express.response.ok = function(response) {
	this.status(200);
	this.json({response: response || {}, error: ''});
};

express.response.bad_request = function(error) {
	this.status(400);
	this.json({response: {}, error: error || 'Request could not be handled.'});
};

express.response.unauthorized = function(error) {
	this.status(401);
	this.json({response: {}, error: error || 'Unauthorized.'});
};

express.response.forbidden = function(error) {
	this.status(403);
	this.json({response: {}, error: error || 'This request is forbidden.'});
};

express.response.not_found = function(error) {
	this.status(404);
	this.json({response: {}, error: error});
};

express.response.unprocessable_entity = function(error) {
	this.status(422);
	this.json({response: {}, error: error || 'The request is logically intact. However, it asks the server to execute an action which is not allowed by application logic.'});
};

express.response.server_error = function(error) {
	this.status(500);
	this.json({response: {}, error: error || 'We\'re sorry, a server error occurred. Please wait a bit and try again.'});
};