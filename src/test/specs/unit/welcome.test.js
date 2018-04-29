'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;
var ms = require('ms');

var Utils = require('../../lib/utils/shared-utils');
var Welcome = require('../../views/welcome-view');

var timeout;

describe('Welcome Test', function() {
	timeout = ms('20s');
	this.timeout(timeout);

	var utils = new Utils(timeout);
	var welcome = new Welcome(timeout);

	before(function setUp() {
		utils.startApp();
		utils.openView('#');
		utils.maximizeBrowserWindow();
	});

	after(function cleanUp(done) {
		browser.restart();
		utils.stopApp(done);
	});

	it('- check system user manual', function() {
		utils.openUserManual(utils.userManual)
			.then(utils.switchTab.call(utils, 1))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('user-manual'))
			.then(utils.goToTab.call(utils, 0));
	});

	it('- load welcome page', function() {
		expect(browser.getCurrentUrl()).to.eventually.contain('#');
	});

	it('- get welcome header text', function() {
		expect(welcome.getWelcomeText.call(welcome)).to.eventually
			.equal('Welcome to Grad Apps');
	});

	it('- get sign in message', function() {
		expect(welcome.getSignInMessage.call(welcome)).to.eventually
			.equal('Sign in to the application to get started');
	});

	it('- get sign in note', function() {
		expect(welcome.getSignInNote.call(welcome)).to.eventually
			.equal('Note: Signing into the Grad Apps portal requires a ' + 
			'valid EECS username');
	});

	it('- get sign in button text', function() {
		expect(welcome.getSignInBtnText.call(welcome)).to.eventually
			.equal('Sign in »');
	});

	describe('- get additional messages', function(){
		it('- get first message', function() {
			expect(welcome.isFirstMessageDisplayed.call(welcome)).to.eventually.be.true;
		});

		it('- get second message', function() {
			expect(welcome.isSecondMessageDisplayed.call(welcome)).to.eventually.be.true;
		});

		it('- get third message', function() {
			expect(welcome.isThirdMessageDisplayed.call(welcome)).to.eventually.be.true;
		});
	});
});
