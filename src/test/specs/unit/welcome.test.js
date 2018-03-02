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

	before(function () {
		utils.startApp();
		utils.openView('#');
		utils.maximizeBrowserWindow();
	});

	after(function (done) {
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

	it('- get sign in note', function() {
		expect(welcome.getSignInNote.call(welcome)).to.eventually
			.equal('Have an account? Sign in to get started');
	});

	it('- get sign in button text', function() {
		expect(welcome.getSignInBtnText.call(welcome)).to.eventually
			.contain('Sign In');
	});

	it('- click sign in button and return back', function() {
		welcome.clickSignInButton()
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('/login'))
			.then(utils.openView.call(utils, '#'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('#'));
	});

	it('- get sign up note', function() {
		expect(welcome.getSignUpNote.call(welcome)).to.eventually
			.equal('Need an account? Register as a new user to get started');
	});

	it('- get sign up button text', function() {
		expect(welcome.getSignUpBtnText.call(welcome)).to.eventually
			.contain('Register');
	});

	it('- click sign up button and return back', function() {
		welcome.clickSignUpButton()
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('/register'))
			.then(utils.openView.call(utils, '#'))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('#'));
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
