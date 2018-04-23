'use strict';

/* admin views file */

var Utils = require('../lib/utils/shared-utils');

function Admin(timeout) {
	this.utils = new Utils();
	this.timeout = timeout;
    
	this.admin = {};
	this.admin.manage = {};

	this.admin.manage.users = by.id('manage-user');
	this.admin.manage.apps = by.id('manage-app');
	this.admin.manage.reviews = by.id('manage-review');
    
	this.admin.goBack = by.id('go-back');
}

Admin.prototype.manageUsers = function() {
	return this.utils.waitForElementClickable(this.admin.manage.users, this.timeout)
		.then(element(this.admin.manage.users).click());
};

Admin.prototype.manageApps = function() {
	return this.utils.waitForElementClickable(this.admin.manage.apps, this.timeout)
		.then(element(this.admin.manage.apps).click());
};

Admin.prototype.manageReviews = function() {
	return this.utils.waitForElementClickable(this.admin.manage.reviews, this.timeout)
		.then(element(this.admin.manage.reviews).click());
};

Admin.prototype.goToDashboard = function() {
	return this.utils.waitForElementClickable(this.admin.goBack, this.timeout)
		.then(element(this.admin.goBack).click());
};

module.exports = Admin;
