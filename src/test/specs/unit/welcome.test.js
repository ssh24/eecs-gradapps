'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var Utils = require('../../lib/utils/shared-utils');
var Welcome = require('../../views/welcome-view');

describe('Welcome Test', function() {
	this.timeout(20000);

	var utils = new Utils();
	var welcome = new Welcome();

	before(function setUp() {
		require('../../pretest');
		utils.startApp();
		utils.openView('#');
		utils.maximizeBrowserWindow();
	});

	after(function cleanUp(done) {
		browser.restart();
		utils.stopApp(done);
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
