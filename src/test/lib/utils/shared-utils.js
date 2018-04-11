'use strict';

var protractor = require('protractor');
var EC = protractor.ExpectedConditions;

// Utility functions that are shared across views and specs

var Utils = function() {
	this.shared = {};
	this.shared.logout = by.id('logout-btn');
	this.shared.user = by.id('logged-in-as');
	this.shared.role = by.id('role-selected');
	this.userManual = by.id('system-manual');
};

var server;

Utils.prototype.startApp = function() {
	delete require.cache[require.resolve('../../../bin/www')];
	server = require('../../../bin/www');
	browser.ignoreSynchronization = true;
};

Utils.prototype.stopApp = function(done) {
	server.close(done);
};

Utils.prototype.openView = function(link) {
	return browser.get(link);
};

Utils.prototype.logOut = function() {
	return this.waitForElementClickable(this.shared.logout, 2000)
		.then(element(this.shared.logout).click());
};

Utils.prototype.getUser = function() {
	return element(this.shared.user).getText();
};

Utils.prototype.getRole = function() {
	return element(this.shared.role).getText();
};

Utils.prototype.openRoleDropDown = function() {
	return element(this.shared.role).click();
};

Utils.prototype.getButtonEnableStatus = function(element) {
	return browser.findElement(element).isEnabled();
};

Utils.prototype.maximizeBrowserWindow = function() {
	return browser.driver.manage().window().maximize();
};

Utils.prototype.openNewTab = function(newPageToOpen) {
	return browser.executeScript('window.open()').then(function () {
		return browser.getAllWindowHandles().then(function (handles) {
			var secondWindow = handles[1];
			return browser.switchTo().window(secondWindow).then(function () {
				return browser.get(newPageToOpen);
			});
		});
	});
};

Utils.prototype.switchTab = function(goToIndex) {
	return browser.getAllWindowHandles().then(function (handles) {
		browser.driver.switchTo().window(handles[goToIndex]);
	});
};

Utils.prototype.openUserManual = function(elem) {
	return this.waitForElementClickable(elem, 5000)
		.then(element(elem).click());
};

Utils.prototype.clearBrowserCache = function() {
	return browser.executeScript('window.localStorage.clear();')
		.then(browser.executeScript('window.sessionStorage.clear();'))
		.then(browser.driver.manage().deleteAllCookies()); 
};

Utils.prototype.goToTab = function(goToIndex) {
	return browser.getAllWindowHandles().then(function (handles) {
		browser.driver.close();
		browser.driver.switchTo().window(handles[goToIndex]);
	});
};

Utils.prototype.switchTab = function(goToIndex) {
	return browser.getAllWindowHandles().then(function (handles) {
		browser.driver.switchTo().window(handles[goToIndex]);
	});
};

Utils.prototype.openUserManual = function(elem) {
	return this.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Utils.prototype.clearThenSendKeys = function(elem, keys) {
	return elem.clear()
		.then(function() {
			return elem.sendKeys(keys);
		});
};

Utils.prototype.waitForElement = function(element, timeout) {
	return browser.wait(function() {
		return browser.isElementPresent(element);
	}, timeout);
};

Utils.prototype.waitForElementEnabled = function(element, timeout) {
	return browser.wait(function() {
		return browser.findElement(element).isEnabled();
	}, timeout);
};

Utils.prototype.waitForElementDisplayed = function(element, timeout) {
	return browser.wait(function() {
		return browser.findElement(element).isDisplayed();
	}, timeout);
};

Utils.prototype.waitUntilReady = function(element, timeout) {
	timeout = timeout || 10000;

	return this.waitForElement(element, timeout)
		.then(this.waitForElementDisplayed.bind(this, element, timeout));
};

Utils.prototype.waitForElementClickable = function(e1, timeout) {
	return browser.wait(EC.elementToBeClickable(element(e1)), timeout);
};

Utils.prototype.closeBrowserAlert = function() {
	return browser.switchTo().alert().then(function (alert) {
		return alert.accept();
	});
};

module.exports = Utils;
