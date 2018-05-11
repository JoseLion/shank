'use strict';

var development = 'shank_development';
var testing = 'shank_testing';
var preview = 'shank_preview';
var production = 'shank';

export default {
  development: {uri: 'mongodb://localhost/' + development, name: development},
  testing: {uri: 'mongodb://10.128.0.4:27017/' + testing, name: testing},
  preview: {uri: 'mongodb://localhost/' + preview, name: preview},
  production: {uri: 'mongodb://localhost/' + production, name: production}
};