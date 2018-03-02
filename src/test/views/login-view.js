'use strict';

/* login views file */

var Utils = require('../lib/utils/shared-utils');

function Login() {
	this.utils = new Utils();

	this.timeout = 20000;
	
	this.login = {};
	this.login.header = by.id('login-header');
	this.login.username = by.id('username');
	this.login.password = by.id('password');
	this.login.submit = by.id('login-btn');
	this.login.errorMessage = by.id('error-message');

	this.login.goRegister = by.id('go-register');
	this.login.goHome = by.id('go-home');
}

Login.prototype.getLoginText = function() {
	return element(this.login.header).getText();
};

Login.prototype.enterUsername = function(username) {
	return this.utils.clearThenSendKeys(element(this.login.username), username);
};

Login.prototype.enterPassword = function(password) {
	return this.utils.clearThenSendKeys(element(this.login.password), password);
};

Login.prototype.clickLogIn = function() {
	return element(this.login.submit).click();
};

Login.prototype.getErrorMessage = function() {
	return element(this.login.errorMessage).getText();
};

Login.prototype.goHome = function() {
	return this.utils.waitForElementClickable(this.login.goHome, this.timeout)
		.then(element(this.login.goHome).click());
};

Login.prototype.goRegister = function() {
	return this.utils.waitForElementClickable(this.login.goRegister, this.timeout)
		.then(element(this.login.goRegister).click());
};

Login.prototype.fullSignIn = function(credentials) {
	var username = credentials.username;
	var password = credentials.password;

	return this.utils.clearThenSendKeys(element(this.login.username), username)
		.then(this.utils.clearThenSendKeys.call(this.utils, element(this.login.
			password), password))
		.then(element(this.login.submit).click());
};

module.exports = Login;
