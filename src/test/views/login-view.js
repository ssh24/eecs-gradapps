'use strict';

/* login views file */

var Utils = require('../lib/utils/shared-utils');

function Login(timeout) {
	this.utils = new Utils();
	this.timeout = timeout;
    
	this.login = {};
	this.login.header = by.id('login-header');
	this.login.username = by.id('username');
	this.login.password = by.id('password');
	this.login.submit = by.id('login-btn');
	this.login.errorMessage = by.id('error-message');
}

Login.prototype.getLoginText = function() {
	return element(this.login.header).getText();
};

Login.prototype.enterUsername = function(username) {
	var elem = element(this.login.username);
	return this.utils.waitForElement(elem, this.timeout)
		.then(this.utils.clearThenSendKeys.call(this.utils, elem, username));
};

Login.prototype.enterPassword = function(password) {
	var elem = element(this.login.password);
	return this.utils.waitForElement(elem, this.timeout)
		.then(this.utils.clearThenSendKeys.call(this.utils, elem, password));
};

Login.prototype.clickLogIn = function() {
	return this.utils.waitForElementClickable(this.login.submit, this.timeout)
		.then(element(this.login.submit).click());
};

Login.prototype.getErrorMessage = function() {
	return element(this.login.errorMessage).getText();
};

Login.prototype.fullSignIn = function(credentials) {
	var username = credentials.username;
	var password = credentials.password;

	return this.enterUsername(username)
		.then(this.enterPassword.call(this, password))
		.then(this.clickLogIn.call(this));
};

module.exports = Login;
