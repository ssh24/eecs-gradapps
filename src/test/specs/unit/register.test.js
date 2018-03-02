'use strict';

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var Login = require('../../views/login-view');
var Register = require('../../views/register-view');
var Role = require('../../views/role-view');
var Utils = require('../../lib/utils/shared-utils');
var Welcome = require('../../views/welcome-view');

var config = require('../../lib/utils/config');

describe('Register Test', function() {
	this.timeout(20000);

	var login = new Login();
	var register = new Register();
	var role = new Role();
	var utils = new Utils();
	var welcome = new Welcome();
    
	before(function () {
		require('../../pretest');
		utils.startApp();
		utils.openView('#');
		utils.maximizeBrowserWindow();
		welcome.clickSignUpButton();
	});

	after(function (done) {
		require('../../pretest');
		browser.restart();
		utils.stopApp(done);
	});
    
	it('- get register text', function() {
		expect(register.getRegisterText.call(register)).to.eventually
			.equal('Register');
	});

	it('- return to home page', function() {
		register.goHome()
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('/'))
			.then(welcome.clickSignUpButton.call(welcome))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('register'));
	});

	it('- return to login page', function() {
		register.goLogin()
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('login'))
			.then(utils.openView.call(utils, '#'))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('/'))
			.then(welcome.clickSignUpButton.call(welcome))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('register'));
	});
    
	it('- register user whose password does not match', function() {
		register.enterFName(config.credentials.signup.fname)
			.then(register.enterLName.call(register, config.credentials.signup.lname))
			.then(register.enterEmail.call(register, config.credentials.signup.email))
			.then(register.enterUsername.call(register, config.credentials.signup.username))
			.then(register.enterPassword.call(register, config.credentials.signup.password))
			.then(register.enterConfirmPassword.call(register, ''))
			.then(expect(register.getPasswordMatchesMessage.call(register)).to.eventually
				.equal('Password does not match'));
	});
    
	it('- register user whose password matches', function() {
		register.enterFName(config.credentials.signup.fname)
			.then(register.enterLName.call(register, config.credentials.signup.lname))
			.then(register.enterEmail.call(register, config.credentials.signup.email))
			.then(register.enterUsername.call(register, config.credentials.signup.username))
			.then(register.enterPassword.call(register, config.credentials.signup.password))
			.then(register.enterConfirmPassword.call(register, config.credentials.signup.password))
			.then(expect(register.getPasswordMatchesMessage.call(register)).to.eventually
				.equal('Password matches'));
	});
    
	it('- register user without a first name', function() {
		register.enterFName('')
			.then(register.enterLName.call(register, config.credentials.signup.lname))
			.then(register.enterEmail.call(register, config.credentials.signup.email))
			.then(register.enterUsername.call(register, config.credentials.signup.username))
			.then(register.enterPassword.call(register, config.credentials.signup.password))
			.then(register.enterConfirmPassword.call(register, config.credentials.signup.password))
			.then(expect(register.getPasswordMatchesMessage.call(register)).to.eventually
				.equal('Password matches'))
			.then(register.clickRegister.call(register))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('register'));
	});
    
	it('- register user without a last name', function() {
		register.enterFName(config.credentials.signup.fname)
			.then(register.enterLName.call(register, ''))
			.then(register.enterEmail.call(register, config.credentials.signup.email))
			.then(register.enterUsername.call(register, config.credentials.signup.username))
			.then(register.enterPassword.call(register, config.credentials.signup.password))
			.then(register.enterConfirmPassword.call(register, config.credentials.signup.password))
			.then(expect(register.getPasswordMatchesMessage.call(register)).to.eventually
				.equal('Password matches'))
			.then(register.clickRegister.call(register))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('register'));
	});
    
	it('- register user without a username', function() {
		register.enterFName(config.credentials.signup.fname)
			.then(register.enterLName.call(register, config.credentials.signup.lname))
			.then(register.enterEmail.call(register, config.credentials.signup.email))
			.then(register.enterUsername.call(register, ''))
			.then(register.enterPassword.call(register, config.credentials.signup.password))
			.then(register.enterConfirmPassword.call(register, config.credentials.signup.password))
			.then(expect(register.getPasswordMatchesMessage.call(register)).to.eventually
				.equal('Password matches'))
			.then(register.clickRegister.call(register))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('register'));
	});
    
	it('- register an existing user', function() {
		register.enterFName(config.credentials.signup.fname)
			.then(register.enterLName.call(register, config.credentials.signup.lname))
			.then(register.enterEmail.call(register, config.credentials.signup.email))
			.then(register.enterUsername.call(register, config.credentials.app.username))
			.then(register.enterPassword.call(register, config.credentials.app.password))
			.then(register.enterConfirmPassword.call(register, config.credentials.app.password))
			.then(expect(register.getPasswordMatchesMessage.call(register)).to.eventually
				.equal('Password matches'))
			.then(register.clickRegister.call(register))
			.then(expect(register.getErrorMessage.call(register)).to.eventually
				.equal('User with username "' + config.credentials.app.username 
				+ '" already exists.'));
	});

	it('- register an user without an email', function() {
		register.enterFName(config.credentials.signup.fname)
			.then(register.enterLName.call(register, config.credentials.signup.lname))
			.then(register.enterUsername.call(register, config.credentials.signup.username + '1'))
			.then(register.enterPassword.call(register, config.credentials.signup.password))
			.then(register.enterConfirmPassword.call(register, config.credentials.signup.password))
			.then(expect(register.getPasswordMatchesMessage.call(register)).to.eventually
				.equal('Password matches'))
			.then(register.clickRegister.call(register))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('/'))
			.then(expect(register.getSuccessMessage.call(register)).to.eventually
				.equal('User "' + config.credentials.signup.username + '1'
				+ '" has been registered. Please contact the system ' 
				+ 'administrator to get roles assigned.'))
			.then(welcome.clickSignUpButton.call(welcome))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('/register'));
	});
    
	it('- register an user with an email', function() {
		register.enterFName(config.credentials.signup.fname)
			.then(register.enterLName.call(register, config.credentials.signup.lname))
			.then(register.enterEmail.call(register, config.credentials.signup.email))
			.then(register.enterUsername.call(register, config.credentials.signup.username + '2'))
			.then(register.enterPassword.call(register, config.credentials.signup.password))
			.then(register.enterConfirmPassword.call(register, config.credentials.signup.password))
			.then(expect(register.getPasswordMatchesMessage.call(register)).to.eventually
				.equal('Password matches'))
			.then(register.clickRegister.call(register))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('/'))
			.then(expect(register.getSuccessMessage.call(register)).to.eventually
				.equal('User "' + config.credentials.signup.username + '2' 
				+ '" has been registered. Please contact the system ' 
				+ 'administrator to get roles assigned.'))
			.then(welcome.clickSignUpButton.call(welcome))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('/register'));
	});

	it('- register an user, login and then logout', function() {
		register.fullRegister(config.credentials.signup)
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('/'))
			.then(expect(register.getSuccessMessage.call(register)).to.eventually
				.equal('User "' + config.credentials.signup.username 
				+ '" has been registered. Please contact the system ' 
				+ 'administrator to get roles assigned.'))
			.then(welcome.clickSignInButton.call(welcome))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('/login'))
			.then(login.fullSignIn.call(login, config.credentials.signup))
			.then(expect(browser.getCurrentUrl()).to.eventually.contain('/roles'))
			.then(expect(role.getRoleMissingText.call(role)).to.eventually
				.equal('Oops! Looks like you have not been assigned a role yet. ' + 
				'Please contact a system administrator.'))
			.then(utils.logOut.call(utils))
			.then(expect(browser.getCurrentUrl()).to.eventually
				.contain('/'));
	});
});
