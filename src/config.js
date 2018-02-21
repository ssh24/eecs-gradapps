'use strict';

/* config file for running test suite */

exports.config = {
  baseUrl: 'http://localhost:3000',
  framework: 'mocha',
  specs: ['test/specs/unit/*'],
  capabilities: {
    browserName: 'chrome'
  }
};
