let jwt = require('express-jwt');

module.exports = jwt({
  secret: process.env.TOKEN_SECRET || "secretTokenForDevelopment",
  userProperty: 'payload'
});