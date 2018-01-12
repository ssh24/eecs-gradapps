'use strict';

/* login views file */

var Utils = require('../lib/utils/shared-utils');

function Login() {
	this.utils = new Utils();
    
	this.welcome = {};
	this.welcome.header = by.id('welcome-header');
    
	this.signin = {};
	this.signin.message = by.id('sign-in-message');
	this.signin.note = by.id('sign-in-note');
	this.signin.button = by.id('sign-in-btn');
}

Login.prototype.getWelcomeText = function() {
	return element(this.welcome.header).getText();
};

Login.prototype.getSignInMessage = function() {
	return element(this.signin.message).getText();
};

Login.prototype.getSignInNote = function() {
	return element(this.signin.note).getText();
};

Login.prototype.clickSignInButton = function() {
	return element(this.signin.button).click();
};

Login.prototype.getSignInBtnText = function() {
	return element(this.signin.button).getText();
};

Login.prototype.signIn = function(credentials, route) {
	var username = credentials.username;
	var password = credentials.password;
	var address = this.utils.getAppAddress();
	var host = address.address === '::' ? 'localhost' : address.address;
	var port = address.port;
	var link = 'http://' + username + ':' + password + '@' + host + ':' + port 
        + '/' + route;
	return browser.get(link);
};

module.exports = Login;
