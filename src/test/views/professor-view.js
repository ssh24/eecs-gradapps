'use strict';

var Utils = require('../lib/utils/shared-utils');

function Professor(timeout) {
	this.utils = new Utils();
	this.timeout = timeout;
    
	this.tables = {};
	this.tables.table = by.id('applicant-table');
	this.tables.table.header = by.id('table-head');
	this.tables.table.body = by.id('table-body');

	this.tables.table.columns = by.css('#table-head > tr > th');
    
	this.tables.refresh = by.id('refresh-table');

	this.tables.error = by.id('error-message');
    
	this.tables.actions = {};

	this.tables.actions.setTo = {};
	this.tables.actions.setTo.show = by.id('set-to-0');
	this.tables.actions.setTo.hide = by.css('.navbar.navbar-default.navbar-fixed-top');
	this.tables.actions.setTo.contacted = by.id('contacted-0');
	this.tables.actions.setTo.requested = by.id('requested-0');
	this.tables.actions.setTo.interested = by.id('interested-0');
	this.tables.actions.setTo.notContacted = by.id('not-contacted-0');
	this.tables.actions.setTo.notRequested = by.id('not-requested-0');
	this.tables.actions.setTo.notInterested = by.id('not-interested-0');

	this.tables.data = {};
	this.tables.data.contacted = by.id('data-0-10');
	this.tables.data.requested = by.id('data-0-11');
	this.tables.data.interested = by.id('data-0-12');
}

Professor.prototype.applicationTableIsDisplayed = function() {
	return element(this.tables.table).isPresent();
};

Professor.prototype.tableHeaderExists = function() {
	return element(this.tables.table.header).isPresent();
};

Professor.prototype.tableBodyExists = function() {
	return element(this.tables.table.body).isPresent();
};

Professor.prototype.getTableColumns = function() {
	return element.all(this.tables.table.columns).count();
};

Professor.prototype.getColumnName = function(index) {
	return element.all(this.tables.table.columns).get(index).getText();
};

Professor.prototype.openSetToDropDown = function() {
	return this.utils.waitForElementClickable(this.tables.actions.setTo.show, 
		this.timeout)
		.then(element(this.tables.actions.setTo.show).click());
};

Professor.prototype.isSetToDDOpen = function() {
	return element(this.tables.actions.setTo.show).getAttribute('aria-expanded')
		.then(function(value) {
			return value === 'true';
		});
};

Professor.prototype.closeSetToDropDown = function() {
	return element(this.tables.actions.setTo.hide).click();
};

Professor.prototype.setContacted = function(status) {
	if (status)
		return this.utils.waitForElementClickable(this.tables.actions.setTo.contacted, 
			this.timeout)
			.then(element(this.tables.actions.setTo.contacted).click());
	return this.utils.waitForElementClickable(this.tables.actions.setTo.notContacted, 
		this.timeout)
		.then(element(this.tables.actions.setTo.notContacted).click());
};

Professor.prototype.getContactedText = function(status) {
	if (status)
		return element(this.tables.actions.setTo.contacted).getText();
	return element(this.tables.actions.setTo.notContacted).getText();
};

Professor.prototype.setRequested = function(status) {
	if (status)
		return this.utils.waitForElementClickable(this.tables.actions.setTo.requested, 
			this.timeout)
			.then(element(this.tables.actions.setTo.requested).click());
	return this.utils.waitForElementClickable(this.tables.actions.setTo.notRequested, 
		this.timeout)
		.then(element(this.tables.actions.setTo.notRequested).click());
};

Professor.prototype.getRequestedText = function(status) {
	if (status)
		return element(this.tables.actions.setTo.requested).getText();
	return element(this.tables.actions.setTo.notRequested).getText();
};

Professor.prototype.setInterested = function(status) {
	if (status)
		return element(this.tables.actions.setTo.interested).click();
	return element(this.tables.actions.setTo.notInterested).click();
};

Professor.prototype.getInterestedText = function(status) {
	if (status)
		return element(this.tables.actions.setTo.interested).getText();
	return element(this.tables.actions.setTo.notInterested).getText();
};

Professor.prototype.getContactedData = function() {
	return element(this.tables.data.contacted).getText();
};

Professor.prototype.getRequestedData = function() {
	return element(this.tables.data.requested).getText();
};

Professor.prototype.getInterestedData = function() {
	return element(this.tables.data.interested).getText();
};

Professor.prototype.getRefreshTableText = function() {
	return element(this.tables.refresh).getText();
};

Professor.prototype.refreshTable = function() {
	return this.utils.waitForElementClickable(this.tables.refresh, this.timeout)
		.then(element(this.tables.refresh).click());
};

Professor.prototype.getTableError = function() {
	return element(this.tables.error).getText();
};

Professor.prototype.orderColumn = function(index, sort) {
	var self = this;
	return element.all(this.tables.table.columns).get(index).getAttribute('aria-sort')
		.then(function(type) {
			if (type === 'none' && sort === -1)
				return element.all(self.tables.table.columns).get(index).click()
					.then(self.orderColumn.bind(self, index, sort));
			return element.all(self.tables.table.columns).get(index).click();
		});
};

Professor.prototype.getSortType = function(index) {
	return element.all(this.tables.table.columns).get(index).getAttribute('aria-sort');
};

module.exports = Professor;
