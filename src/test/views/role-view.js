'use strict';

/* login views file */

var Utils = require('../lib/utils/shared-utils');

function Role() {
	this.utils = new Utils();
    
	this.roles = {};
	this.roles.admin = by.id('admin-role');
	this.roles.professor = by.id('professor-role');
	this.roles.committee = by.id('committee-role');
	this.roles.missing = by.id('role-missing');

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

Role.prototype.getRoleMissingText = function() {
	return element(this.roles.missing).getText();
};

Role.prototype.selectRole = function(role) {
	if(role === 'Admin')
		return element(this.roles.admin).click();
	else if (role === 'Professor')
		return element(this.roles.professor).click();
	else if (role === 'Committee Member')
		return element(this.roles.committee).click();
	else
		return;
};

Role.prototype.changeRole = function(role) {
	if(role === 'Admin')
		return element(this.roles.switch.admin).click();
	else if (role === 'Professor')
		return element(this.roles.switch.professor).click();
	else if (role === 'Committee Member')
		return element(this.roles.switch.committee).click();
	else
		return;
};

module.exports = Role;
