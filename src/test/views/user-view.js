'use strict';

var Utils = require('../lib/utils/shared-utils');

function User(timeout) {
	this.utils = new Utils();
	this.timeout = timeout;
    
	this.tables = {};
	this.tables.table = by.id('user-table');
	this.tables.table.header = by.id('table-head');
	this.tables.table.body = by.id('table-body');

	this.tables.table.columns = by.css('#table-head > tr > th');
    
	this.tables.refresh = by.id('refresh-table');

	this.tables.error = by.id('error-message');

	this.user = {};
	this.user.new = by.id('new-user');
	this.user.new.close = by.id('new-close');
	this.user.new.submit = by.id('new-submit');

	this.user.edit = {};
	this.user.edit.delete = by.id('delete-user');
	this.user.edit.close = by.id('edit-close');
	this.user.edit.submit = by.id('edit-submit');

	this.user.fields = {};

	this.user.fields.username = by.id('fm_Username');
	this.user.fields.password = by.id('set-pass');
	this.user.fields.password.generate = by.id('gen-pass');
	this.user.fields.password.copy = by.id('copy-pass');


	this.user.fields.lname = by.id('fm_Lname');
	this.user.fields.fname = by.id('fm_Fname');
	this.user.fields.email = by.id('fm_Email');

	this.user.fields.fos = by.css('button[data-id="fm_FOS"]');
	this.user.fields.roles = by.css('button[data-id="fm_Roles"]');

	this.user.fields.preset = {};
	this.user.fields.preset.admin = by.css('button[data-id="presetAdmin"]');
	this.user.fields.preset.committee = by.css('button[data-id="presetCommittee"]');
	this.user.fields.preset.professor = by.css('button[data-id="presetProf"]');

	this.user.selected = by.css('.btn-group.bootstrap-select.form-control > button');
}

User.prototype.openNewUserForm = function() {
	return this.utils.waitForElementClickable(this.user.new, this.timeout)
		.then(element(this.user.new).click());
};

User.prototype.closeNewUserForm = function() {
	return this.utils.waitForElementClickable(this.user.new.close, this.timeout)
		.then(element(this.user.new.close).click());
};

User.prototype.closeEditUserForm = function() {
	return this.utils.waitForElementClickable(this.user.edit.close, this.timeout)
		.then(element(this.user.edit.close).click());
};

User.prototype.submitUser = function() {
	return this.utils.waitForElementClickable(this.user.new.submit, this.timeout)
		.then(element(this.user.new.submit).click());
};

User.prototype.isSubmitBtnEnabled = function() {
	return element(this.user.new.submit).isEnabled();
};

User.prototype.saveUser = function() {
	return this.utils.waitForElementClickable(this.user.edit.submit, this.timeout)
		.then(element(this.user.edit.submit).click());
};

User.prototype.isSaveBtnEnabled = function() {
	return element(this.user.edit.submit).isEnabled();
};

User.prototype.editUser = function(appId) {
	var elem = by.id('edit-user-'+appId);

	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

User.prototype.deleteUser = function() {
	return this.utils.waitForElementClickable(this.user.edit.delete, this.timeout)
		.then(element(this.user.edit.delete).click());
};

User.prototype.getApplicantLName = function(appId) {
	var elem = by.id('data-'+appId+'-3');
	return element(elem).getText();
};

User.prototype.checkForUsername = function() {
	return this.utils.waitForElementDisplayed(this.user.fields.username, this.timeout);
};

User.prototype.checkForPassword = function() {
	return this.utils.waitForElementDisplayed(this.user.fields.password, this.timeout);
};

User.prototype.checkForPasswordGenerate = function() {
	return this.utils.waitForElementDisplayed(this.user.fields.password.generate, this.timeout);
};

User.prototype.checkForPasswordCopy = function() {
	return this.utils.waitForElementDisplayed(this.user.fields.password.copy, this.timeout);
};

User.prototype.checkForLName = function() {
	return this.utils.waitForElementDisplayed(this.user.fields.lname, this.timeout);
};

User.prototype.checkForFName = function() {
	return this.utils.waitForElementDisplayed(this.user.fields.fname, this.timeout);
};

User.prototype.checkForEmail = function() {
	return this.utils.waitForElementDisplayed(this.user.fields.email, this.timeout);
};

User.prototype.checkForFOS = function() {
	return this.utils.waitForElementDisplayed(this.user.fields.fos, this.timeout);
};

User.prototype.checkForRoles = function() {
	return this.utils.waitForElementDisplayed(this.user.fields.roles, this.timeout);
};

User.prototype.toggleDD = function(elem) {
	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

User.prototype.selectIthElement = function(index) {
	var elem = by.css('.btn-group.bootstrap-select.form-control.open > .dropdown-menu.open > .dropdown-menu.inner > li[data-original-index="'+index+'"] > a');
	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

User.prototype.isOptionSelected = function(option) {
	return element.all(this.user.selected).getAttribute('title')
		.then(function(titles) {
			return titles.toString().indexOf(option) > -1;
		});
};

User.prototype.setUsername = function(uname) {
	return this.utils.clearThenSendKeys(element(this.user.fields.username), uname);
};

User.prototype.getUsername = function() {
	return element(this.user.fields.username).getAttribute('value');
};

User.prototype.setPassword = function(password) {
	return this.utils.clearThenSendKeys(element(this.user.fields.password), password);
};

User.prototype.getPassword = function() {
	return element(this.user.fields.password).getAttribute('value');
};

User.prototype.generatePassword = function() {
	return this.utils.waitForElementClickable(this.user.fields.password.generate, this.timeout)
		.then(element(this.user.fields.password.generate).click());
};

User.prototype.copyPassword = function() {
	return this.utils.waitForElementClickable(this.user.fields.password.copy, this.timeout)
		.then(element(this.user.fields.password.copy).click());
};

User.prototype.setLName = function(lname) {
	return this.utils.clearThenSendKeys(element(this.user.fields.lname), lname);
};

User.prototype.getLName = function() {
	return element(this.user.fields.lname).getAttribute('value');
};

User.prototype.setFName = function(fname) {
	return this.utils.clearThenSendKeys(element(this.user.fields.fname), fname);
};

User.prototype.getFName = function() {
	return element(this.user.fields.fname).getAttribute('value');
};

User.prototype.setEmail = function(email) {
	return this.utils.clearThenSendKeys(element(this.user.fields.email), email);
};

User.prototype.getEmail = function() {
	return element(this.user.fields.email).getAttribute('value');
};

User.prototype.selectFOS = function(index) {
	return this.toggleDD(this.user.fields.fos)
		.then(this.selectIthElement.call(this, index))
		.then(this.toggleDD.call(this, by.css('.btn-group.bootstrap-select.form-control.open')));
};

User.prototype.selectRoles = function(index) {
	return this.toggleDD(this.user.fields.roles)
		.then(this.selectIthElement.call(this, index))
		.then(this.toggleDD.call(this, by.css('.btn-group.bootstrap-select.form-control.open')));
};

User.prototype.selectAdminPreset = function(index) {
	return this.toggleDD(this.user.fields.preset.admin)
		.then(this.selectIthElement.call(this, index))
		.then(this.toggleDD.call(this, by.css('.btn-group.bootstrap-select.form-control.open')));
};

User.prototype.selectCommitteePreset = function(index) {
	return this.toggleDD(this.user.fields.preset.committee)
		.then(this.selectIthElement.call(this, index))
		.then(this.toggleDD.call(this, by.css('.btn-group.bootstrap-select.form-control.open')));
};

User.prototype.selectProfessorPreset = function(index) {
	return this.toggleDD(this.user.fields.preset.professor)
		.then(this.selectIthElement.call(this, index))
		.then(this.toggleDD.call(this, by.css('.btn-group.bootstrap-select.form-control.open')));
};

User.prototype.fillUser = function(data) {
	return this.setUsername(data.username)
		.then(this.setPassword.call(this, data.password))
		.then(this.setLName.call(this, data.lname))
		.then(this.setFName.call(this, data.fname))
		.then(this.setEmail.call(this, data.email));
};

User.prototype.applicationTableIsDisplayed = function() {
	return element(this.tables.table).isPresent();
};

User.prototype.tableHeaderExists = function() {
	return element(this.tables.table.header).isPresent();
};

User.prototype.tableBodyExists = function() {
	return element(this.tables.table.body).isPresent();
};

User.prototype.getTableColumns = function() {
	return element.all(this.tables.table.columns).count();
};

User.prototype.getColumnName = function(index) {
	return element.all(this.tables.table.columns).get(index).getText();
};

User.prototype.openSetToDropDown = function() {
	return this.utils.waitForElementClickable(this.tables.actions.setTo.show, 
		this.timeout)
		.then(element(this.tables.actions.setTo.show).click());
};

User.prototype.isSetToDDOpen = function() {
	return element(this.tables.actions.setTo.show).getAttribute('aria-expanded')
		.then(function(value) {
			return value === 'true';
		});
};

User.prototype.closeSetToDropDown = function() {
	return element(this.tables.actions.setTo.hide).click();
};

User.prototype.getRefreshTableText = function() {
	return element(this.tables.refresh).getText();
};

User.prototype.refreshTable = function() {
	return this.utils.waitForElementClickable(this.tables.refresh, this.timeout)
		.then(element(this.tables.refresh).click());
};

User.prototype.getTableError = function() {
	return element(this.tables.error).getText();
};

User.prototype.orderColumn = function(index, sort) {
	var self = this;
	return element.all(this.tables.table.columns).get(index).getAttribute('aria-sort')
		.then(function(type) {
			if (type === 'none' && sort === -1)
				return element.all(self.tables.table.columns).get(index).click()
					.then(self.orderColumn.bind(self, index, sort));
			return element.all(self.tables.table.columns).get(index).click();
		});
};

User.prototype.getSortType = function(index) {
	return element.all(this.tables.table.columns).get(index).getAttribute('aria-sort');
};

User.prototype.isHighlighted = function(row, column) {
	var elem = by.css('#data-' + row + '-' + column + ' > span[style="color:red"]');
	return element(elem).getText();
};

module.exports = User;
