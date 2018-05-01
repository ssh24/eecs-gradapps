'use strict';

var Utils = require('../lib/utils/shared-utils');

function Review(timeout) {
	this.utils = new Utils();
	this.timeout = timeout;
    
	this.tables = {};
	this.tables.table = by.id('review-table');
	this.tables.table.header = by.id('table-head');
	this.tables.table.body = by.id('table-body');

	this.tables.table.columns = by.css('#table-head > tr > th');
    
	this.tables.refresh = by.id('refresh-table');
	this.tables.default = by.id('reset-table');

	this.tables.error = by.id('error-message');

	this.review = {};

	this.review.edit = {};
	this.review.edit.close = by.id('edit-close');

	this.review.fields = {};
	this.review.fields.sid = by.id('sid'); 
	this.review.fields.lname = by.id('lname'); 
	this.review.fields.fname = by.id('fname'); 
	this.review.fields.vstatus = by.id('visa'); 
	this.review.fields.foi = by.id('foi'); 
	this.review.fields.prefProfs = by.id('prefProfs');

	this.review.fields.tables = {};
	this.review.fields.tables.table = by.id('assigned-reviewers');

	this.review.selected = by.css('.btn-group.bootstrap-select.form-control > button');
}

Review.prototype.closeReviewForm = function() {
	return this.utils.waitForElementClickable(this.review.edit.close, this.timeout)
		.then(element(this.review.edit.close).click());
};

Review.prototype.selectReviewer = function(app, index, multi) {
	var elem = 'button[data-id="cms-' + app + '"]';
	var self = this;
	return this.toggleDD(by.css(elem))
		.then(this.selectIthElement.call(this, index))
		.then(function() {
			if(multi)
				return self.toggleDD.call(self, by.css('.btn-group.bootstrap-select.form-control.dropup.open'));
		});
};

Review.prototype.assignReview = function(app) {
	var elem = 'assign-review-' + app;
	return this.utils.waitForElementClickable(by.id(elem), this.timeout)
		.then(element(by.id(elem)).click());
};

Review.prototype.unassignReview = function(index) {
	var elem = 'unassign-review-' + index;
	return this.utils.waitForElementClickable(by.id(elem), this.timeout)
		.then(element(by.id(elem)).click());
};

Review.prototype.dismissReview = function(index) {
	var elem = 'dismiss-review-' + index;
	return this.utils.waitForElementClickable(by.id(elem), this.timeout)
		.then(element(by.id(elem)).click());
};

Review.prototype.manageReview = function(app) {
	var elem = 'manage-review-' + app;
	return this.utils.waitForElementClickable(by.id(elem), this.timeout)
		.then(element(by.id(elem)).click());
};

Review.prototype.viewApp = function(app) {
	var elem = 'view-app-' + app;
	return this.utils.waitForElementClickable(by.id(elem), this.timeout)
		.then(element(by.id(elem)).click());
};

Review.prototype.getReviewAssigned = function(app) {
	var elem = 'data-' + app + '-4';
	return element(by.id(elem)).getText();
};

Review.prototype.getReviewPending = function(app) {
	var elem = 'data-' + app + '-5';
	return element(by.id(elem)).getText();
};

Review.prototype.editApplication = function(appId) {
	var elem = by.id('edit-app-'+appId);

	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Review.prototype.checkForSID = function() {
	return this.utils.waitForElementDisplayed(this.review.fields.sid, this.timeout);
};

Review.prototype.checkForLName = function() {
	return this.utils.waitForElementDisplayed(this.review.fields.lname, this.timeout);
};

Review.prototype.checkForFName = function() {
	return this.utils.waitForElementDisplayed(this.review.fields.fname, this.timeout);
};

Review.prototype.checkForVStatus = function() {
	return this.utils.waitForElementDisplayed(this.review.fields.vstatus, this.timeout);
};

Review.prototype.checkForFOI = function() {
	return this.utils.waitForElementDisplayed(this.review.fields.foi, this.timeout);
};

Review.prototype.checkForPrefProfs = function() {
	return this.utils.waitForElementDisplayed(this.review.fields.prefProfs, this.timeout);
};

Review.prototype.checkForAssignedTable = function() {
	return this.utils.waitForElementDisplayed(this.review.fields.tables.table, this.timeout);
};

Review.prototype.toggleDD = function(elem) {
	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Review.prototype.selectIthElement = function(index) {
	var elem = by.css('.btn-group.bootstrap-select.form-control.open > .dropdown-menu.open > .dropdown-menu.inner > li[data-original-index="'+index+'"] > a');
	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Review.prototype.isOptionSelected = function(option) {
	return element.all(this.review.selected).getAttribute('title')
		.then(function(titles) {
			return titles.toString().indexOf(option) > -1;
		});
};

Review.prototype.selectSession = function(index) {
	return this.toggleDD(this.review.fields.session)
		.then(this.selectIthElement.call(this, index));
};

Review.prototype.setStudentNumber = function(sid) {
	return this.utils.clearThenSendKeys(element(this.review.fields.sid), sid);
};

Review.prototype.getStudentNumber = function() {
	return element(this.review.fields.sid).getAttribute('value');
};

Review.prototype.setLName = function(lname) {
	return this.utils.clearThenSendKeys(element(this.review.fields.lname), lname);
};

Review.prototype.getLName = function() {
	return element(this.review.fields.lname).getAttribute('value');
};

Review.prototype.setFName = function(fname) {
	return this.utils.clearThenSendKeys(element(this.review.fields.fname), fname);
};

Review.prototype.getFName = function() {
	return element(this.review.fields.fname).getAttribute('value');
};

Review.prototype.setEmail = function(email) {
	return this.utils.clearThenSendKeys(element(this.review.fields.email), email);
};

Review.prototype.getEmail = function() {
	return element(this.review.fields.email).getAttribute('value');
};

Review.prototype.selectGender = function(index) {
	return this.toggleDD(this.review.fields.gender)
		.then(this.selectIthElement.call(this, index));
};

Review.prototype.selectGPA = function(index) {
	return this.toggleDD(this.review.fields.gpa)
		.then(this.selectIthElement.call(this, index));
};

Review.prototype.setGPAStatus = function(status) {
	var elem;
	if (status === 'final')
		elem = this.review.fields.gpa.final;
	else if (status === 'interim')
		elem = this.review.fields.gpa.interim;

	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Review.prototype.isGPAFinal = function() {
	return element(this.review.fields.gpa.final).isSelected();
};

Review.prototype.setGRE = function(gre) {
	return this.utils.clearThenSendKeys(element(this.review.fields.gre), gre);
};

Review.prototype.getGRE = function() {
	return element(this.review.fields.gre).getAttribute('value');
};

Review.prototype.setTOEFL = function(toefl) {
	return this.utils.clearThenSendKeys(element(this.review.fields.toefl), toefl);
};

Review.prototype.getTOEFL = function() {
	return element(this.review.fields.toefl).getAttribute('value');
};

Review.prototype.setIELTS = function(ielts) {
	return this.utils.clearThenSendKeys(element(this.review.fields.ielts), ielts);
};

Review.prototype.getIELTS = function() {
	return element(this.review.fields.ielts).getAttribute('value');
};

Review.prototype.setYELT = function(yelt) {
	return this.utils.clearThenSendKeys(element(this.review.fields.yelt), yelt);
};

Review.prototype.getYELT = function() {
	return element(this.review.fields.yelt).getAttribute('value');
};

Review.prototype.setApplicationReviewed = function(reviewed) {
	var elem;
	if (reviewed === 'yes')
		elem = this.review.fields.committeeReviewed.yes;
	else if (reviewed === 'no')
		elem = this.review.fields.committeeReviewed.no;

	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Review.prototype.isApplicationReviewed = function() {
	return element(this.review.fields.committeeReviewed.yes).isSelected();
};

Review.prototype.setYGSAward = function(awarded) {
	var elem;
	if (awarded === 'yes')
		elem = this.review.fields.ygs.yes;
	else if (awarded === 'no')
		elem = this.review.fields.ygs.no;

	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Review.prototype.applicationTableIsDisplayed = function() {
	return element(this.tables.table).isPresent();
};

Review.prototype.tableHeaderExists = function() {
	return element(this.tables.table.header).isPresent();
};

Review.prototype.tableBodyExists = function() {
	return element(this.tables.table.body).isPresent();
};

Review.prototype.getTableColumns = function() {
	return element.all(this.tables.table.columns).count();
};

Review.prototype.getColumnName = function(index) {
	return element.all(this.tables.table.columns).get(index).getText();
};

Review.prototype.openSetToDropDown = function() {
	return this.utils.waitForElementClickable(this.tables.actions.setTo.show, 
		this.timeout)
		.then(element(this.tables.actions.setTo.show).click());
};

Review.prototype.isSetToDDOpen = function() {
	return element(this.tables.actions.setTo.show).getAttribute('aria-expanded')
		.then(function(value) {
			return value === 'true';
		});
};

Review.prototype.closeSetToDropDown = function() {
	return element(this.tables.actions.setTo.hide).click();
};

Review.prototype.getRefreshTableText = function() {
	return element(this.tables.refresh).getText();
};

Review.prototype.refreshTable = function() {
	return this.utils.waitForElementClickable(this.tables.refresh, this.timeout)
		.then(element(this.tables.refresh).click());
};

Review.prototype.loadDefaultTable = function() {
	return this.utils.waitForElementClickable(this.tables.default, this.timeout)
		.then(element(this.tables.refresh).click());
};

Review.prototype.getTableError = function() {
	return element(this.tables.error).getText();
};

Review.prototype.orderColumn = function(index, sort) {
	var self = this;
	return element.all(this.tables.table.columns).get(index).getAttribute('aria-sort')
		.then(function(type) {
			if (type === 'none' && sort === -1)
				return element.all(self.tables.table.columns).get(index).click()
					.then(self.orderColumn.bind(self, index, sort));
			return element.all(self.tables.table.columns).get(index).click();
		});
};

Review.prototype.getSortType = function(index) {
	return element.all(this.tables.table.columns).get(index).getAttribute('aria-sort');
};

Review.prototype.isHighlighted = function(row, column) {
	var elem = by.css('#data-' + row + '-' + column + ' > span[style="color:red"]');
	return element(elem).getText();
};

module.exports = Review;
