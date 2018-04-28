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

	this.userManual = by.id('prof-manual');

	this.view = {};
	this.view.pdf = by.id('view-app');
}

Professor.prototype.viewApplication = function(appId) {
	var elem = by.id('view-application-'+appId);

	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Professor.prototype.checkForApplicationPDF = function() {
	return this.utils.waitForElementDisplayed(this.view.pdf, this.timeout);
};

Professor.prototype.checkForName = function() {
	var elem = by.id('name');
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForSession = function() {
	var elem = by.id('session');
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForEmail = function() {
	var elem = by.id('email');
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForGender = function() {
	var elem = by.id('gender');
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForGPA = function() {
	var elem = by.id('gpa');
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForGrades = function() {
	var elem = by.id('grades');
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForDegree = function() {
	var elem = by.id('degree');
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForVStatus = function() {
	var elem = by.id('visa');
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForFOI = function() {
	var elem = by.id('foi');
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForProfs = function() {
	var elem = by.id('profs');
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForPDecision = function() {
	var elem = by.id('pdecision');
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForContacted = function() {
	var elem = by.id('contacted');
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForRequested = function() {
	var elem = by.id('requested');
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForBackground = function(id) {
	var elem = by.id('background-' + id);
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForResearch = function(id) {
	var elem = by.id('research-' + id);
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForLetter = function(id) {
	var elem = by.id('letter-' + id);
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForComments = function(id) {
	var elem = by.id('comments-' + id);
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForRank = function(id) {
	var elem = by.id('rank-' + id);
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForUni = function(id1, id2) {
	var elem = by.id('uni-' + id1 + '-' + id2);
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.checkForAsssmt = function(id1, id2, id3) {
	var elem;
	if (!id3) elem = by.id('asssmt-' + id1 + '-' + id2);
	else elem = by.id('asssmt-' + id1 + '-' + id2 + '-' + id3);
	return this.utils.waitForElementDisplayed(elem, this.timeout);
};

Professor.prototype.getName = function() {
	var elem = by.id('name');
	return element(elem).getText();
};

Professor.prototype.getSession = function() {
	var elem = by.id('session');
	return element(elem).getText();
};

Professor.prototype.getEmail = function() {
	var elem = by.id('email');
	return element(elem).getText();
};

Professor.prototype.getGender = function() {
	var elem = by.id('gender');
	return element(elem).getText();
};

Professor.prototype.getGPA = function() {
	var elem = by.id('gpa');
	return element(elem).getText();
};

Professor.prototype.getGrades = function() {
	var elem = by.id('grades');
	return element(elem).getText();
};

Professor.prototype.getDegree = function() {
	var elem = by.id('degree');
	return element(elem).getText();
};

Professor.prototype.getVisa = function() {
	var elem = by.id('visa');
	return element(elem).getText();
};

Professor.prototype.getFOI = function() {
	var elem = by.id('foi');
	return element(elem).getText();
};

Professor.prototype.getProfs = function() {
	var elem = by.id('profs');
	return element(elem).getText();
};

Professor.prototype.getPDecision = function() {
	var elem = by.id('pdecision');
	return element(elem).getText();
};

Professor.prototype.getContacted = function() {
	var elem = by.id('contacted');
	return element(elem).getText();
};

Professor.prototype.getRequested = function() {
	var elem = by.id('requested');
	return element(elem).getText();
};

Professor.prototype.getBackground = function(id) {
	var elem = by.id('background-' + id);
	return element(elem).getText();
};

Professor.prototype.getResearch = function(id) {
	var elem = by.id('research-' + id);
	return element(elem).getText();
};

Professor.prototype.getLetter = function(id) {
	var elem = by.id('letter-' + id);
	return element(elem).getText();
};

Professor.prototype.getComments = function(id) {
	var elem = by.id('comments-' + id);
	return element(elem).getText();
};

Professor.prototype.getRank = function(id) {
	var elem = by.id('rank-' + id);
	return element(elem).getText();
};

Professor.prototype.getUniversity = function(id1, id2) {
	var elem = by.id('uni-' + id1 + '-' + id2);
	return element(elem).getText();
};

Professor.prototype.getAssessment = function(id1, id2, id3) {
	var elem;
	if (!id3) elem = by.id('asssmt-' + id1 + '-' + id2);
	else elem = by.id('asssmt-' + id1 + '-' + id2 + '-' + id3);
	return element(elem).getText();
};

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

Professor.prototype.isHighlighted = function(row, column) {
	var elem = by.css('#data-' + row + '-' + column + ' > span[style="color:red"]');
	return element(elem).getText();
};

module.exports = Professor;
