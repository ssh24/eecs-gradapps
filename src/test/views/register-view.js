'use strict';

/* login views file */

var Utils = require('../lib/utils/shared-utils');

function Register() {
	this.utils = new Utils();

	this.timeout = 20000;
	
	this.register = {};
	this.register.header = by.id('signup-header');
    
	this.register.fname = by.id('f_name');
	this.register.lname = by.id('l_name');
	this.register.email = by.id('email');
	this.register.username = by.id('username');
	this.register.password = by.id('password');
	this.register.confirm_pass = by.id('confirm_password');
	this.register.pass_matches = by.id('pass-message');
	this.register.submit = by.id('register-btn');
    
	this.register.errorMessage = by.id('error-message');
	this.register.successMessage = by.id('registration-success');

	this.register.goLogin = by.id('go-login');
	this.register.goHome = by.id('go-home');
}

Register.prototype.getRegisterText = function() {
	return element(this.register.header).getText();
};

Register.prototype.enterFName = function(fname) {
	return this.utils.clearThenSendKeys(element(this.register.fname), fname);
};

Register.prototype.enterLName = function(lname) {
	return this.utils.clearThenSendKeys(element(this.register.lname), lname);
};

Register.prototype.enterEmail = function(email) {
	return this.utils.clearThenSendKeys(element(this.register.email), email);
};

Register.prototype.enterUsername = function(username) {
	return this.utils.clearThenSendKeys(element(this.register.username), username);
};

Register.prototype.enterPassword = function(password) {
	return this.utils.clearThenSendKeys(element(this.register.password), password);
};

Register.prototype.enterConfirmPassword = function(password) {
	return this.utils.clearThenSendKeys(element(this.register.confirm_pass), password);
};

Register.prototype.clickRegister = function() {
	return element(this.register.submit).click();
};

Register.prototype.getErrorMessage = function() {
	return element(this.register.errorMessage).getText();
};

Register.prototype.getSuccessMessage = function() {
	return element(this.register.successMessage).getText();
};

Register.prototype.getPasswordMatchesMessage = function() {
	return element(this.register.pass_matches).getText();
};

Register.prototype.goHome = function() {
	return this.utils.waitForElementClickable(this.register.goHome, this.timeout)
		.then(element(this.register.goHome).click());
};

Register.prototype.goLogin = function() {
	return this.utils.waitForElementClickable(this.register.goLogin, this.timeout)
		.then(element(this.register.goLogin).click());
};

Register.prototype.fullRegister = function(credentials) {
	var fname = credentials.fname;
	var lname = credentials.lname;
	var email = credentials.email || '';
	var username = credentials.username;
	var password = credentials.password;
	var confirm_password = credentials.password;

	return this.enterFName(fname)
		.then(this.enterLName.call(this, lname))
		.then(this.enterEmail.call(this, email))
		.then(this.enterUsername.call(this, username))
		.then(this.enterPassword.call(this, password))
		.then(this.enterConfirmPassword.call(this, confirm_password))
		.then(this.clickRegister.call(this));

};

module.exports = Register;
