'use strict';

var Utils = require('../lib/utils/shared-utils');

function Application(timeout) {
	this.utils = new Utils();
	this.timeout = timeout;
    
	this.tables = {};
	this.tables.table = by.id('applicant-table');
	this.tables.table.header = by.id('table-head');
	this.tables.table.body = by.id('table-body');

	this.tables.table.columns = by.css('#table-head > tr > th');
    
	this.tables.refresh = by.id('refresh-table');

	this.tables.error = by.id('error-message');

	this.app = {};
	this.app.new = by.id('new-app');
	this.app.new.close = by.id('new-close');
	this.app.new.submit = by.id('new-submit');

	this.app.edit = {};
	this.app.edit.delete = by.id('delete-app');
	this.app.edit.close = by.id('edit-close');
	this.app.edit.submit = by.id('edit-submit');

	this.app.fields = {};
	this.app.fields.upload = by.id('app_file');
	this.app.fields.upload.error = by.id('error-file');

	this.app.fields.session = by.css('button[data-id="app_Session"]');
	this.app.fields.sid = by.id('student_Id');
	this.app.fields.lname = by.id('LName');
	this.app.fields.fname = by.id('FName');
	this.app.fields.email = by.id('Email');
	this.app.fields.gender = by.css('button[data-id="Gender"]');

	this.app.fields.gpa = by.css('button[data-id="GPA"]');
	this.app.fields.gpa.final = by.id('final');
	this.app.fields.gpa.interim = by.id('interim');
	this.app.fields.gre = by.id('GRE');
	this.app.fields.toefl = by.id('TOEFL');
	this.app.fields.ielts = by.id('IELTS');
	this.app.fields.yelt = by.id('YELT');

	this.app.fields.vstatus = by.css('button[data-id="VStatus"]');
	this.app.fields.degree = by.css('button[data-id="Degree"]');
	this.app.fields.foi = by.css('button[data-id="FOI"]');
	this.app.fields.prefProfs = by.css('button[data-id="prefProfs"]');
	this.app.fields.profContacted = by.css('button[data-id="profContacted"');
	this.app.fields.profRequested = by.css('button[data-id="profRequested"');

	this.app.fields.rank = by.css('button[data-id="Rank"]');
	this.app.fields.committeeReviewed = {};
	this.app.fields.committeeReviewed.yes = by.id('yes-reviewed');
	this.app.fields.committeeReviewed.no = by.id('no-reviewed');
	this.app.fields.ygs = {};
	this.app.fields.ygs.yes = by.id('yes-ygs');
	this.app.fields.ygs.no = by.id('no-ygs');
	this.app.fields.pdecision = by.css('button[data-id="programDecision"');
	this.app.fields.sdecision = by.css('button[data-id="studentDecision"');
	this.app.fields.declineReason = by.id('declineReason');

	this.app.selected = by.css('.btn-group.bootstrap-select.form-control > button');
}

Application.prototype.openNewApplicationForm = function() {
	return this.utils.waitForElementClickable(this.app.new, this.timeout)
		.then(element(this.app.new).click());
};

Application.prototype.closeNewApplicationForm = function() {
	return this.utils.waitForElementClickable(this.app.new.close, this.timeout)
		.then(element(this.app.new.close).click());
};

Application.prototype.closeEditApplicationForm = function() {
	return this.utils.waitForElementClickable(this.app.edit.close, this.timeout)
		.then(element(this.app.edit.close).click());
};

Application.prototype.submitApplication = function() {
	return this.utils.waitForElementClickable(this.app.new.submit, this.timeout)
		.then(element(this.app.new.submit).click());
};

Application.prototype.isSubmitBtnEnabled = function() {
	return element(this.app.new.submit).isEnabled();
};

Application.prototype.saveApplication = function() {
	return this.utils.waitForElementClickable(this.app.edit.submit, this.timeout)
		.then(element(this.app.edit.submit).click());
};

Application.prototype.isSaveBtnEnabled = function() {
	return element(this.app.edit.submit).isEnabled();
};

Application.prototype.editApplication = function(appId) {
	var elem = by.id('edit-app-'+appId);

	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Application.prototype.viewApplication = function(appId) {
	var elem = by.id('view-app-'+appId);

	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Application.prototype.deleteApplication = function() {
	return this.utils.waitForElementClickable(this.app.edit.delete, this.timeout)
		.then(element(this.app.edit.delete).click());
};

Application.prototype.getApplicantLName = function(appId) {
	var elem = by.id('data-'+appId+'-3');
	return element(elem).getText();
};

Application.prototype.selectFile = function(path) {
	return this.checkForUploadFile()
		.then(element(this.app.fields.upload).sendKeys(path));  
};

Application.prototype.getFileError = function() {
	return element(this.app.fields.upload.error).getText();
};

Application.prototype.checkForUploadFile = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.upload, this.timeout);
};

Application.prototype.checkForSession = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.session, this.timeout);
};

Application.prototype.checkForSID = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.sid, this.timeout);
};

Application.prototype.checkForLName = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.lname, this.timeout);
};

Application.prototype.checkForFName = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.fname, this.timeout);
};

Application.prototype.checkForEmail = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.email, this.timeout);
};

Application.prototype.checkForGender = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.gender, this.timeout);
};

Application.prototype.checkForGPA = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.gpa, this.timeout);
};

Application.prototype.checkForGPAFinal = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.gpa.final, 
		this.timeout)
		.then(this.utils.waitForElementDisplayed(this.app.fields.gpa.interim, 
			this.timeout));
};

Application.prototype.checkForGRE = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.gre, this.timeout);
};

Application.prototype.checkForTOEFL = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.toefl, this.timeout);
};

Application.prototype.checkForIELTS = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.ielts, this.timeout);
};

Application.prototype.checkForYELT = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.yelt, this.timeout);
};

Application.prototype.checkForVStatus = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.vstatus, this.timeout);
};

Application.prototype.checkForDegree = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.degree, this.timeout);
};

Application.prototype.checkForFOI = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.foi, this.timeout);
};

Application.prototype.checkForPrefProfs = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.prefProfs, this.timeout);
};

Application.prototype.checkForProfContacted = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.profContacted, this.timeout);
};

Application.prototype.checkForProfRequested = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.profRequested, this.timeout);
};

Application.prototype.checkForRank = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.rank, this.timeout);
};

Application.prototype.checkForAppReviewed = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.committeeReviewed.yes, this.timeout)
		.then(this.utils.waitForElementDisplayed(this.app.fields.committeeReviewed.no, this.timeout));
};

Application.prototype.checkForPDecision = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.pdecision, this.timeout);
};

Application.prototype.checkForSDecision = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.sdecision, this.timeout);
};

Application.prototype.checkForDeclineReason = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.declineReason, this.timeout);
};

Application.prototype.checkForYGS = function() {
	return this.utils.waitForElementDisplayed(this.app.fields.ygs.yes, this.timeout)
		.then(this.utils.waitForElementDisplayed(this.app.fields.ygs.no, this.timeout));
};

Application.prototype.toggleDD = function(elem) {
	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Application.prototype.selectIthElement = function(index) {
	var elem = by.css('.btn-group.bootstrap-select.form-control.open > .dropdown-menu.open > .dropdown-menu.inner > li[data-original-index="'+index+'"] > a');
	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Application.prototype.isOptionSelected = function(option) {
	return element.all(this.app.selected).getAttribute('title')
		.then(function(titles) {
			return titles.toString().indexOf(option) > -1;
		});
};

Application.prototype.selectSession = function(index) {
	return this.toggleDD(this.app.fields.session)
		.then(this.selectIthElement.call(this, index));
};

Application.prototype.setStudentNumber = function(sid) {
	return this.utils.clearThenSendKeys(element(this.app.fields.sid), sid);
};

Application.prototype.getStudentNumber = function() {
	return element(this.app.fields.sid).getAttribute('value');
};

Application.prototype.setLName = function(lname) {
	return this.utils.clearThenSendKeys(element(this.app.fields.lname), lname);
};

Application.prototype.getLName = function() {
	return element(this.app.fields.lname).getAttribute('value');
};

Application.prototype.setFName = function(fname) {
	return this.utils.clearThenSendKeys(element(this.app.fields.fname), fname);
};

Application.prototype.getFName = function() {
	return element(this.app.fields.fname).getAttribute('value');
};

Application.prototype.setEmail = function(email) {
	return this.utils.clearThenSendKeys(element(this.app.fields.email), email);
};

Application.prototype.getEmail = function() {
	return element(this.app.fields.email).getAttribute('value');
};

Application.prototype.selectGender = function(index) {
	return this.toggleDD(this.app.fields.gender)
		.then(this.selectIthElement.call(this, index));
};

Application.prototype.selectGPA = function(index) {
	return this.toggleDD(this.app.fields.gpa)
		.then(this.selectIthElement.call(this, index));
};

Application.prototype.setGPAStatus = function(status) {
	var elem;
	if (status === 'final')
		elem = this.app.fields.gpa.final;
	else if (status === 'interim')
		elem = this.app.fields.gpa.interim;

	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Application.prototype.isGPAFinal = function() {
	return element(this.app.fields.gpa.final).isSelected();
};

Application.prototype.setGRE = function(gre) {
	return this.utils.clearThenSendKeys(element(this.app.fields.gre), gre);
};

Application.prototype.getGRE = function() {
	return element(this.app.fields.gre).getAttribute('value');
};

Application.prototype.setTOEFL = function(toefl) {
	return this.utils.clearThenSendKeys(element(this.app.fields.toefl), toefl);
};

Application.prototype.getTOEFL = function() {
	return element(this.app.fields.toefl).getAttribute('value');
};

Application.prototype.setIELTS = function(ielts) {
	return this.utils.clearThenSendKeys(element(this.app.fields.ielts), ielts);
};

Application.prototype.getIELTS = function() {
	return element(this.app.fields.ielts).getAttribute('value');
};

Application.prototype.setYELT = function(yelt) {
	return this.utils.clearThenSendKeys(element(this.app.fields.yelt), yelt);
};

Application.prototype.getYELT = function() {
	return element(this.app.fields.yelt).getAttribute('value');
};

Application.prototype.selectVisa = function(index) {
	return this.toggleDD(this.app.fields.vstatus)
		.then(this.selectIthElement.call(this, index));
};

Application.prototype.selectDegree = function(index) {
	return this.toggleDD(this.app.fields.degree)
		.then(this.selectIthElement.call(this, index));
};

Application.prototype.selectFOI = function(index) {
	return this.toggleDD(this.app.fields.foi)
		.then(this.selectIthElement.call(this, index))
		.then(this.toggleDD.call(this, by.css('.btn-group.bootstrap-select.form-control.dropup.open')));
};

Application.prototype.selectProfs = function(index) {
	return this.toggleDD(this.app.fields.prefProfs)
		.then(this.selectIthElement.call(this, index))
		.then(this.toggleDD.call(this, by.css('.btn-group.bootstrap-select.form-control.dropup.open')));
};

Application.prototype.selectProfContacted = function(index) {
	return this.toggleDD(this.app.fields.profContacted)
		.then(this.selectIthElement.call(this, index))
		.then(this.toggleDD.call(this, by.css('.btn-group.bootstrap-select.form-control.dropup.open')));
};

Application.prototype.selectProfRequested = function(index) {
	return this.toggleDD(this.app.fields.profRequested)
		.then(this.selectIthElement.call(this, index))
		.then(this.toggleDD.call(this, by.css('.btn-group.bootstrap-select.form-control.dropup.open')));
};

Application.prototype.selectRank = function(index) {
	return this.toggleDD(this.app.fields.rank)
		.then(this.selectIthElement.call(this, index))
		.then(this.toggleDD.call(this, by.css('.btn-group.bootstrap-select.form-control.dropup.open')));
};

Application.prototype.setApplicationReviewed = function(reviewed) {
	var elem;
	if (reviewed === 'yes')
		elem = this.app.fields.committeeReviewed.yes;
	else if (reviewed === 'no')
		elem = this.app.fields.committeeReviewed.no;

	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Application.prototype.isApplicationReviewed = function() {
	return element(this.app.fields.committeeReviewed.yes).isSelected();
};

Application.prototype.setYGSAward = function(awarded) {
	var elem;
	if (awarded === 'yes')
		elem = this.app.fields.ygs.yes;
	else if (awarded === 'no')
		elem = this.app.fields.ygs.no;

	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Application.prototype.isYGSAwarded = function() {
	return element(this.app.fields.ygs.yes).isSelected();
};

Application.prototype.selectPDecision = function(index) {
	return this.toggleDD(this.app.fields.pdecision)
		.then(this.selectIthElement.call(this, index));
};

Application.prototype.selectSDecision = function(index) {
	return this.toggleDD(this.app.fields.sdecision)
		.then(this.selectIthElement.call(this, index));
};

Application.prototype.setDeclineReason = function(reason) {
	return this.utils.clearThenSendKeys(element(this.app.fields.declineReason), reason);
};

Application.prototype.getDeclineReason = function() {
	return element(this.app.fields.declineReason).getAttribute('value');
};

Application.prototype.fillApplication = function(data) {
	return this.selectFile(data.file)
		.then(this.selectSession.call(this, data.session.index))
		.then(this.setStudentNumber.call(this, data.sid))
		.then(this.setLName.call(this, data.lname))
		.then(this.setFName.call(this, data.fname))
		.then(this.setEmail.call(this, data.email))
		.then(this.selectGender.call(this, data.gender.index))
		.then(this.selectGPA.call(this, data.gpa.index))
		.then(this.setGPAStatus.call(this, data.gpa.status))
		.then(this.setGRE.call(this, data.scores.gre))
		.then(this.setTOEFL.call(this, data.scores.toefl))
		.then(this.setIELTS.call(this, data.scores.ielts))
		.then(this.setYELT.call(this, data.scores.yelt))
		.then(this.selectVisa.call(this, data.visa.index))
		.then(this.selectDegree.call(this, data.degree.index))
		.then(this.setYGSAward.call(this, data.ygs));
};

Application.prototype.applicationTableIsDisplayed = function() {
	return element(this.tables.table).isPresent();
};

Application.prototype.tableHeaderExists = function() {
	return element(this.tables.table.header).isPresent();
};

Application.prototype.tableBodyExists = function() {
	return element(this.tables.table.body).isPresent();
};

Application.prototype.getTableColumns = function() {
	return element.all(this.tables.table.columns).count();
};

Application.prototype.getColumnName = function(index) {
	return element.all(this.tables.table.columns).get(index).getText();
};

Application.prototype.openSetToDropDown = function() {
	return this.utils.waitForElementClickable(this.tables.actions.setTo.show, 
		this.timeout)
		.then(element(this.tables.actions.setTo.show).click());
};

Application.prototype.isSetToDDOpen = function() {
	return element(this.tables.actions.setTo.show).getAttribute('aria-expanded')
		.then(function(value) {
			return value === 'true';
		});
};

Application.prototype.closeSetToDropDown = function() {
	return element(this.tables.actions.setTo.hide).click();
};

Application.prototype.getRefreshTableText = function() {
	return element(this.tables.refresh).getText();
};

Application.prototype.refreshTable = function() {
	return this.utils.waitForElementClickable(this.tables.refresh, this.timeout)
		.then(element(this.tables.refresh).click());
};

Application.prototype.getTableError = function() {
	return element(this.tables.error).getText();
};

Application.prototype.orderColumn = function(index, sort) {
	var self = this;
	return element.all(this.tables.table.columns).get(index).getAttribute('aria-sort')
		.then(function(type) {
			if (type === 'none' && sort === -1)
				return element.all(self.tables.table.columns).get(index).click()
					.then(self.orderColumn.bind(self, index, sort));
			return element.all(self.tables.table.columns).get(index).click();
		});
};

Application.prototype.getSortType = function(index) {
	return element.all(this.tables.table.columns).get(index).getAttribute('aria-sort');
};

Application.prototype.isHighlighted = function(row, column) {
	var elem = by.css('#data-' + row + '-' + column + ' > span[style="color:red"]');
	return element(elem).getText();
};

module.exports = Application;
