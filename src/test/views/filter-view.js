'use strict';

var Utils = require('../lib/utils/shared-utils');

var Filter = function() {
	this.utils = new Utils();

	this.filter = {};
	this.filter.open = by.id('filter-btn');
	this.filter.close = by.className('close');

	this.filter.fields = {};
	this.filter.fields.hideDD = by.css('.dropdown-backdrop');

	this.filter.fields.searchBox = by.css('.btn-group.bootstrap-select.dropup > .dropdown-menu.open > .bs-searchbox > input');

	this.filter.fields.selected = {};
	this.filter.fields.selected.active = by.css('.btn-group.bootstrap-select.dropup > button');
	this.filter.fields.selected.inner = by.css('.btn-group.bootstrap-select.dropup > .dropdown-menu.open > .dropdown-menu.inner');

	this.filter.fields.applicant = by.id('applicant-picker');
	this.filter.fields.applicant.openDD = by.css('button[data-id="applicant-picker"]');
	
	this.filter.fields.foi = by.id('foi-picker');
	this.filter.fields.foi.openDD = by.css('button[data-id="foi-picker"]');

	this.filter.fields.professor = by.id('professor-picker');
	this.filter.fields.professor.openDD = by.css('button[data-id="professor-picker"]');
};

Filter.prototype.openFilterModal = function() {
	return this.utils.waitForElementClickable(this.filter.open, this.timeout)
		.then(element(this.filter.open).click());
};

Filter.prototype.closeFilterModal = function() {
	return this.utils.waitForElementClickable(this.filter.close, this.timeout)
		.then(element(this.filter.close).click());
};

Filter.prototype.getApplicantNameFilter = function() {
	return this.utils.waitForElement(element(this.filter.fields.applicant), 
		this.timeout);
};

Filter.prototype.openApplicantDD = function() {
	return this.utils.waitForElementClickable(this.filter.fields.applicant.openDD, 
		this.timeout)
		.then(element(this.filter.fields.applicant.openDD).click());
};

Filter.prototype.isApplicantDDOpen = function() {
	return element(this.filter.fields.applicant.openDD).getAttribute('aria-expanded')
		.then(function(value) {
			return value === 'true';
		});
};

Filter.prototype.getFoiFilter = function() {
	return this.utils.waitForElement(element(this.filter.fields.foi), 
		this.timeout);
};

Filter.prototype.openFoiDD = function() {
	return this.utils.waitForElementClickable(this.filter.fields.foi.openDD, 
		this.timeout)
		.then(element(this.filter.fields.foi.openDD).click());
};

Filter.prototype.isFoiDDOpen = function() {
	return element(this.filter.fields.foi.openDD).getAttribute('aria-expanded')
		.then(function(value) {
			return value === 'true';
		});
};

Filter.prototype.getProfessorNameFilter = function() {
	return this.utils.waitForElement(element(this.filter.fields.professor), 
		this.timeout);
};

Filter.prototype.openProfessorDD = function() {
	return this.utils.waitForElementClickable(this.filter.fields.professor.openDD, 
		this.timeout)
		.then(element(this.filter.fields.professor.openDD).click());
};

Filter.prototype.isProfessorDDOpen = function() {
	return element(this.filter.fields.professor.openDD).getAttribute('aria-expanded')
		.then(function(value) {
			return value === 'true';
		});
};

Filter.prototype.closeDD = function() {
	return this.utils.waitForElementClickable(this.filter.fields.hideDD, 
		this.timeout)
		.then(element(this.filter.fields.hideDD).click());
};

Filter.prototype.getSelectedElement = function() {
	return element.all(this.filter.fields.selected.active).getAttribute('title');
};

Filter.prototype.selectIthElement = function(index) {
	var elem = by.css('.btn-group.bootstrap-select.dropup.open > .dropdown-menu.open > .dropdown-menu.inner > li[data-original-index="'+index+'"] > a');
	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Filter.prototype.searchText = function(text) {
	return this.utils.clearThenSendKeys(element(this.filter.fields.searchBox), 
		text);
};

module.exports = Filter;
