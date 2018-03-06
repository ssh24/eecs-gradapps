'use strict';

var Utils = require('../lib/utils/shared-utils');

var Filter = function(timeout) {
	this.utils = new Utils();
	this.timeout = timeout;

	this.filter = {};
	this.filter.modal = by.css('.modal-content');
	this.filter.open = by.id('filter-btn');
	this.filter.close = by.id('close-btn');
	this.filter.submit = by.id('filter-submit');
	this.filter.dismiss = by.id('filter-close');

	this.filter.refresh = by.id('refresh-table');
	this.filter.reset = by.id('reset-table');

	this.filter.cols = {};
	this.filter.cols.active = by.css('.btn.btn-default.active');

	this.filter.cols.applicant = by.id('btn_col_name');
	this.filter.cols.applicant.index = by.css('#btn_col_name > span');

	this.filter.cols.gender = by.id('btn_col_gender');
	this.filter.cols.gender.index = by.css('#btn_col_gender > span');

	this.filter.cols.foi = by.id('btn_col_foi');
	this.filter.cols.foi.index = by.css('#btn_col_foi > span');

	this.filter.cols.professor = by.id('btn_col_prof');
	this.filter.cols.professor.index = by.css('#btn_col_prof > span');

	this.filter.cols.crank = by.id('btn_col_ranking');
	this.filter.cols.crank.index = by.css('#btn_col_ranking > span');

	this.filter.cols.gpa = by.id('btn_col_gpa');
	this.filter.cols.gpa.index = by.css('#btn_col_gpa > span');

	this.filter.cols.degree = by.id('btn_col_degree');
	this.filter.cols.degree.index = by.css('#btn_col_degree > span');

	this.filter.cols.vstatus = by.id('btn_col_visa');
	this.filter.cols.vstatus.index = by.css('#btn_col_visa > span');

	this.filter.cols.pdecision = by.id('btn_col_program_decision');
	this.filter.cols.pdecision.index = by.css('#btn_col_program_decision > span');

	this.filter.cols.contacted = by.id('btn_col_contacted_status');
	this.filter.cols.contacted.index = by.css('#btn_col_contacted_status > span');

	this.filter.cols.requested = by.id('btn_col_requested_status');
	this.filter.cols.requested.index = by.css('#btn_col_requested_status > span');

	this.filter.cols.interested = by.id('btn_col_interest');
	this.filter.cols.interested.index = by.css('#btn_col_interest > span');

	this.filter.cols.actions = by.id('btn_col_actions');
	this.filter.cols.actions.index = by.css('#btn_col_actions > span');

	this.filter.fields = {};
	this.filter.fields.hideDD = by.css('.dropdown-backdrop');

	this.filter.fields.searchBox = by.css('.btn-group.bootstrap-select.form-control.open > .dropdown-menu.open > .bs-searchbox > input');

	this.filter.fields.selected = by.id('selectedFilter');
	this.filter.fields.selected.active = by.css('.btn-group.bootstrap-select.form-control > button');

	this.filter.fields.applicant = by.id('btn_filter_name');
	this.filter.fields.applicant.openDD = by.css('button[data-id="btn_filter_name"]');
	
	this.filter.fields.foi = by.id('btn_filter_foi');
	this.filter.fields.foi.openDD = by.css('button[data-id="btn_filter_foi"]');

	this.filter.fields.professor = by.id('btn_filter_prof');
	this.filter.fields.professor.openDD = by.css('button[data-id="btn_filter_prof"]');

	this.filter.fields.gender = by.id('btn_filter_gender');
	this.filter.fields.gender.openDD = by.css('button[data-id="btn_filter_gender"]');

	this.filter.fields.crank = by.id('btn_filter_ranking');
	this.filter.fields.crank.openDD = by.css('button[data-id="btn_filter_ranking"]');

	this.filter.fields.gpa = by.id('btn_filter_gpa');
	this.filter.fields.gpa.openDD = by.css('button[data-id="btn_filter_gpa"]');

	this.filter.fields.degree = by.id('btn_filter_degree');
	this.filter.fields.degree.openDD = by.css('button[data-id="btn_filter_degree"]');

	this.filter.fields.vstatus = by.id('btn_filter_visa');
	this.filter.fields.vstatus.openDD = by.css('button[data-id="btn_filter_visa"]');

	this.filter.fields.pdecision = by.id('btn_filter_program_decision');
	this.filter.fields.pdecision.openDD = by.css('button[data-id="btn_filter_program_decision"]');

	this.filter.fields.contacted = by.id('btn_filter_contacted_by');
	this.filter.fields.contacted.openDD = by.css('button[data-id="btn_filter_contacted_by"]');

	this.filter.fields.requested = by.id('btn_filter_requested_by');
	this.filter.fields.requested.openDD = by.css('button[data-id="btn_filter_requested_by"]');

	this.filter.fields.interested = by.id('btn_filter_interest');
	this.filter.fields.interested.openDD = by.css('button[data-id="btn_filter_interest"]');
};

Filter.prototype.waitForModalOpen = function() {
	return this.utils.waitForElementDisplayed(this.filter.modal, this.timeout);
};

Filter.prototype.openFilterModal = function() {
	return this.utils.waitForElementClickable(this.filter.open, this.timeout)
		.then(element(this.filter.open).click());
};

Filter.prototype.closeFilterModal = function() {
	return this.utils.waitForElementClickable(this.filter.close, this.timeout)
		.then(element(this.filter.close).click());
};

Filter.prototype.toggleColumn = function(elem) {
	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Filter.prototype.columnIsSelected = function(col) {
	return element.all(this.filter.cols.active).getText()
		.then(function(columns) {
			var isSelected = false;
			for (var i = 0; i < columns.length; i++) {
				if (columns[i].indexOf(col) > -1) {
					isSelected = true;
				}
			}
			return isSelected;
		});
};

Filter.prototype.getColumnIndex = function(elem) {
	return element(elem).getText();
};

Filter.prototype.getField = function(elem) {
	return this.utils.waitForElement(element(elem), this.timeout);
};

Filter.prototype.openFieldDD = function(elem) {
	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Filter.prototype.isFieldDDOpen = function(elem) {
	return element(elem).getAttribute('aria-expanded').then(function(value) {
		return value === 'true';
	});
};

Filter.prototype.closeDD = function() {
	return this.utils.waitForElementClickable(this.filter.fields.hideDD, 
		this.timeout)
		.then(element(this.filter.fields.hideDD).click());
};

Filter.prototype.getSelectedFilter = function() {
	return element(this.filter.fields.selected).getText();
};

Filter.prototype.getSelectedElement = function() {
	return element.all(this.filter.fields.selected.active).getAttribute('title');
};

Filter.prototype.selectIthElement = function(index) {
	var elem = by.css('.btn-group.bootstrap-select.form-control.open > .dropdown-menu.open > .dropdown-menu.inner > li[data-original-index="'+index+'"] > a');
	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Filter.prototype.searchText = function(text) {
	return this.utils.waitForElement(element(this.filter.fields.searchBox), 
		this.timeout)
		.then(this.utils.clearThenSendKeys(element(this.filter.fields.searchBox), 
			text));
};

Filter.prototype.submitFilter = function() {
	return this.utils.waitForElementClickable(this.filter.submit, this.timeout)
		.then(element(this.filter.submit).click());
};

Filter.prototype.resetFilteredTable = function() {
	return this.utils.waitForElementClickable(this.filter.reset, this.timeout)
		.then(element(this.filter.reset).click());
};

Filter.prototype.refreshFilteredTable = function() {
	return this.utils.waitForElementClickable(this.filter.refresh, this.timeout)
		.then(element(this.filter.refresh).click());
};

module.exports = Filter;
