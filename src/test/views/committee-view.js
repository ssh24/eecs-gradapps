'use strict';

var Utils = require('../lib/utils/shared-utils');

function Committee(timeout) {
	this.utils = new Utils();
	this.timeout = timeout;
    
	this.tables = {};
	this.tables.table = by.id('applicant-table');
	this.tables.table.header = by.id('table-head');
	this.tables.table.body = by.id('table-body');

	this.tables.table.columns = by.css('#table-head > tr > th');
    
	this.tables.refresh = by.id('refresh-table');

	this.tables.error = by.id('error-message');
}

Committee.prototype.applicationTableIsDisplayed = function() {
	return element(this.tables.table).isPresent();
};

Committee.prototype.tableHeaderExists = function() {
	return element(this.tables.table.header).isPresent();
};

Committee.prototype.tableBodyExists = function() {
	return element(this.tables.table.body).isPresent();
};

Committee.prototype.getTableColumns = function() {
	return element.all(this.tables.table.columns).count();
};

Committee.prototype.getColumnName = function(index) {
	return element.all(this.tables.table.columns).get(index).getText();
};

Committee.prototype.openSetToDropDown = function() {
	return this.utils.waitForElementClickable(this.tables.actions.setTo.show, 
		this.timeout)
		.then(element(this.tables.actions.setTo.show).click());
};

Committee.prototype.isSetToDDOpen = function() {
	return element(this.tables.actions.setTo.show).getAttribute('aria-expanded')
		.then(function(value) {
			return value === 'true';
		});
};

Committee.prototype.closeSetToDropDown = function() {
	return element(this.tables.actions.setTo.hide).click();
};

Committee.prototype.getRefreshTableText = function() {
	return element(this.tables.refresh).getText();
};

Committee.prototype.refreshTable = function() {
	return this.utils.waitForElementClickable(this.tables.refresh, this.timeout)
		.then(element(this.tables.refresh).click());
};

Committee.prototype.getTableError = function() {
	return element(this.tables.error).getText();
};

Committee.prototype.orderColumn = function(index, sort) {
	var self = this;
	return element.all(this.tables.table.columns).get(index).getAttribute('aria-sort')
		.then(function(type) {
			if (type === 'none' && sort === -1)
				return element.all(self.tables.table.columns).get(index).click()
					.then(self.orderColumn.bind(self, index, sort));
			return element.all(self.tables.table.columns).get(index).click();
		});
};

Committee.prototype.getSortType = function(index) {
	return element.all(this.tables.table.columns).get(index).getAttribute('aria-sort');
};

module.exports = Committee;
