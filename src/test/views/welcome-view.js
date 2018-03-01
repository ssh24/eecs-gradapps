'use strict';

/* login views file */

var Utils = require('../lib/utils/shared-utils');

function Welcome() {
	this.utils = new Utils();
	
	this.timeout = 20000;

	this.welcome = {};
	this.welcome.header = by.id('welcome-header');
    
	this.signin = {};
	this.signin.note = by.id('sign-in-note');
	this.signin.button = by.id('sign-in-btn');

	this.signup = {};
	this.signup.note = by.id('sign-up-note');
	this.signup.button = by.id('sign-up-btn');

	this.extra = {
		h1: by.id('h1'),
		p1: by.id('p1'),
		h2: by.id('h2'),
		p2: by.id('p2'),
		h3: by.id('h3'),
		p3: by.id('p3')
	};
}

Welcome.prototype.getWelcomeText = function() {
	return element(this.welcome.header).getText();
};

Welcome.prototype.getSignInNote = function() {
	return element(this.signin.note).getText();
};

Welcome.prototype.getSignInBtnText = function() {
	return element(this.signin.button).getText();
};

Welcome.prototype.clickSignInButton = function() {
	return this.utils.waitForElementClickable(this.signin.button, this.timeout)
		.then(element(this.signin.button).click());
};

Welcome.prototype.getSignUpNote = function() {
	return element(this.signup.note).getText();
};

Welcome.prototype.getSignUpBtnText = function() {
	return element(this.signup.button).getText();
};

Welcome.prototype.clickSignUpButton = function() {
	return this.utils.waitForElementClickable(this.signup.button, this.timeout)
		.then(element(this.signup.button).click());
};

Welcome.prototype.isFirstMessageDisplayed = function() {
	var self = this;
	return browser.findElement(this.extra.h1).isDisplayed()
		.then(function(isDisplayed) {
			if(!isDisplayed)
				return false;
			return browser.findElement(self.extra.p1).isDisplayed();
		});
};

Welcome.prototype.isSecondMessageDisplayed = function() {
	var self = this;
	return browser.findElement(this.extra.h2).isDisplayed()
		.then(function(isDisplayed) {
			if(!isDisplayed)
				return false;
			return browser.findElement(self.extra.p2).isDisplayed();
		});
};

Welcome.prototype.isThirdMessageDisplayed = function() {
	var self = this;
	return browser.findElement(this.extra.h3).isDisplayed()
		.then(function(isDisplayed) {
			if(!isDisplayed)
				return false;
			return browser.findElement(self.extra.p3).isDisplayed();
		});
};

module.exports = Welcome;
