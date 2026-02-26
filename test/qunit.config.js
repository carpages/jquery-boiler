/* global requirejs */

// Require config
requirejs.config({
  baseUrl: '.',
  paths: {
    qunit: 'node_modules/qunit/qunit/qunit',
    jquery: 'node_modules/jquery/dist/jquery',
    'jquery.boiler': '../dist/jquery.boiler',
  },
});
