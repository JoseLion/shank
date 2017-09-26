module.exports = function() {
  return require('express-jwt-permissions')({
		requestProperty: 'payload',
		permissionsProperty: 'permissions',
	});
};