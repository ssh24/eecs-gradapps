'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var Login = require('../../views/login-view');
var Utils = require('../../lib/utils/shared-utils');

var config = require('../../lib/utils/config');

describe('Login Test', function() {
	this.timeout(10000);

	var utils = new Utils();
	var login = new Login();

	before(function () {
		utils.startApp();
		utils.maximizeBrowserWindow();
		utils.openView('#');
	});

	after(function (done) {
		utils.stopApp(done);
	});

	it('- load sign in page', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('#');
	});

	it('- get welcome header text', function() {
		expect(login.getWelcomeText.call(login)).to.eventually
			.equal('Welcome to Grad Apps');
	});

	it('- get sign in message', function() {
		expect(login.getSignInMessage.call(login)).to.eventually
			.equal('Sign in to the application to get started');
	});

	it('- get sign in note', function() {
		expect(login.getSignInNote.call(login)).to.eventually
			.equal('Note: Signing into the Grad Apps portal requires a ' + 
			'valid EECS username');
	});

	it('- get sign in button text', function() {
		expect(login.getSignInBtnText.call(login)).to.eventually
			.equal('Sign In');
	});

	it('- success authentication', function() {
		login.signIn(config.credentials.app, 'roles')
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('roles'));
	});
});
