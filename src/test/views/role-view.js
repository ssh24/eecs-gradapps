'use strict';

/* role views file */

var Utils = require('../lib/utils/shared-utils');

function Role() {
	this.utils = new Utils();
    
	this.roles = {};
	this.roles.admin = by.id('admin-role');
	this.roles.professor = by.id('professor-role');
	this.roles.committee = by.id('committee-role');


	this.roles.switch = {};
	this.roles.switch.admin = by.id('switch-to-admin');
	this.roles.switch.committee = by.id('switch-to-committee');
	this.roles.switch.professor = by.id('switch-to-professor');
}

Role.prototype.getAdminText = function() {
	return element(this.roles.admin).getText();
};

Role.prototype.getProfessorText = function() {
	return element(this.roles.professor).getText();
};

Role.prototype.getCommitteeText = function() {
	return element(this.roles.committee).getText();
};

Role.prototype.selectRole = function(role) {
	var elem;
	if (role === 'Admin') elem = this.roles.admin;
	else if (role === 'Professor') elem = this.roles.professor;
	else if (role === 'Committee Member') elem = this.roles.committee;

	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Role.prototype.changeRole = function(role) {
	var elem;
	if (role === 'Admin') elem = this.roles.switch.admin;
	else if (role === 'Professor') elem = this.roles.switch.professor;
	else if (role === 'Committee Member') elem = this.roles.switch.committee;

	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

module.exports = Role;
