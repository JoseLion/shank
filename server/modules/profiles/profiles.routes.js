let mongoose = require('mongoose');
let Profile = mongoose.model('Profile');
let router = require('../core/routes.js')(Profile, '/profiles');

let prepareRouter = function() {  
  return router;
}

module.exports = prepareRouter;