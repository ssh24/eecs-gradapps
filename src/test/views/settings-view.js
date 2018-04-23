'use strict';

var Utils = require('../lib/utils/shared-utils');

function Settings(timeout) {
	this.utils = new Utils();
	this.timeout = timeout;

	this.settings = {};

	this.settings.edit = {};
	this.settings.edit.close = by.id('edit-close');
	this.settings.edit.submit = by.id('edit-submit');

	this.settings.fields = {};

	this.settings.fields.username = by.id('fm_Username');
	
	this.settings.fields.password = {};
	this.settings.fields.password.first = by.id('set-pass-1');
	this.settings.fields.password.confirm = by.id('set-pass-2');
	this.settings.fields.password.message = by.id('pass-message');

	this.settings.fields.lname = by.id('fm_Lname');
	this.settings.fields.fname = by.id('fm_Fname');
	this.settings.fields.email = by.id('fm_Email');

	this.settings.fields.fos = by.css('button[data-id="fm_FOS"]');

	this.settings.fields.preset = {};
	this.settings.fields.preset.admin = by.css('button[data-id="presetAdmin"]');
	this.settings.fields.preset.committee = by.css('button[data-id="presetCommittee"]');
	this.settings.fields.preset.professor = by.css('button[data-id="presetProf"]');

	this.settings.selected = by.css('.btn-group.bootstrap-select.form-control > button');
}

Settings.prototype.getPasswordMessage = function() {
	return element(this.settings.fields.password.message).getText();
};

Settings.prototype.closeEditUserForm = function() {
	return this.utils.waitForElementClickable(this.settings.edit.close, this.timeout)
		.then(element(this.settings.edit.close).click());
};

Settings.prototype.saveUser = function() {
	return this.utils.waitForElementClickable(this.settings.edit.submit, this.timeout)
		.then(element(this.settings.edit.submit).click());
};

Settings.prototype.isSaveBtnEnabled = function() {
	return element(this.settings.edit.submit).isEnabled();
};

Settings.prototype.checkForUsername = function() {
	return this.utils.waitForElementDisplayed(this.settings.fields.username, this.timeout);
};

Settings.prototype.checkForPassword = function() {
	return this.utils.waitForElementDisplayed(this.settings.fields.password.first, this.timeout);
};

Settings.prototype.checkForPasswordConfirmation = function() {
	return this.utils.waitForElementDisplayed(this.settings.fields.password.confirm, this.timeout);
};

Settings.prototype.checkForLName = function() {
	return this.utils.waitForElementDisplayed(this.settings.fields.lname, this.timeout);
};

Settings.prototype.checkForFName = function() {
	return this.utils.waitForElementDisplayed(this.settings.fields.fname, this.timeout);
};

Settings.prototype.checkForEmail = function() {
	return this.utils.waitForElementDisplayed(this.settings.fields.email, this.timeout);
};

Settings.prototype.checkForFOS = function() {
	return this.utils.waitForElementDisplayed(this.settings.fields.fos, this.timeout);
};

Settings.prototype.checkForAdminPreset = function() {
	return this.utils.waitForElementDisplayed(this.settings.fields.preset.admin, this.timeout);
};

Settings.prototype.checkForCommitteeePreset = function() {
	return this.utils.waitForElementDisplayed(this.settings.fields.preset.committee, this.timeout);
};

Settings.prototype.checkForProfessorPreset = function() {
	return this.utils.waitForElementDisplayed(this.settings.fields.preset.professor, this.timeout);
};

Settings.prototype.toggleDD = function(elem) {
	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Settings.prototype.selectIthElement = function(index) {
	var elem = by.css('.btn-group.bootstrap-select.form-control.open > .dropdown-menu.open > .dropdown-menu.inner > li[data-original-index="'+index+'"] > a');
	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Settings.prototype.isOptionSelected = function(option) {
	return element.all(this.settings.selected).getAttribute('title')
		.then(function(titles) {
			return titles.toString().indexOf(option) > -1;
		});
};

Settings.prototype.setUsername = function(uname) {
	return this.utils.clearThenSendKeys(element(this.settings.fields.username), uname);
};

Settings.prototype.getUsername = function() {
	return element(this.settings.fields.username).getAttribute('value');
};

Settings.prototype.setPassword = function(password) {
	return this.utils.clearThenSendKeys(element(this.settings.fields.password.first), password);
};

Settings.prototype.getPassword = function() {
	return element(this.settings.fields.password.first).getAttribute('value');
};

Settings.prototype.setPasswordConfirmation = function(password) {
	return this.utils.clearThenSendKeys(element(this.settings.fields.password.confirm), password);
};

Settings.prototype.getPasswordConfirmation = function() {
	return element(this.settings.fields.password.confirm).getAttribute('value');
};

Settings.prototype.setLName = function(lname) {
	return this.utils.clearThenSendKeys(element(this.settings.fields.lname), lname);
};

Settings.prototype.getLName = function() {
	return element(this.settings.fields.lname).getAttribute('value');
};

Settings.prototype.setFName = function(fname) {
	return this.utils.clearThenSendKeys(element(this.settings.fields.fname), fname);
};

Settings.prototype.getFName = function() {
	return element(this.settings.fields.fname).getAttribute('value');
};

Settings.prototype.setEmail = function(email) {
	return this.utils.clearThenSendKeys(element(this.settings.fields.email), email);
};

Settings.prototype.getEmail = function() {
	return element(this.settings.fields.email).getAttribute('value');
};

Settings.prototype.selectFOS = function(index) {
	return this.toggleDD(this.settings.fields.fos)
		.then(this.selectIthElement.call(this, index))
		.then(this.toggleDD.call(this, by.css('.btn-group.bootstrap-select.form-control.open')));
};

Settings.prototype.selectAdminPreset = function(index) {
	return this.toggleDD(this.settings.fields.preset.admin)
		.then(this.selectIthElement.call(this, index))
		.then(this.toggleDD.call(this, by.css('.btn-group.bootstrap-select.form-control.open')));
};

Settings.prototype.selectCommitteePreset = function(index) {
	return this.toggleDD(this.settings.fields.preset.committee)
		.then(this.selectIthElement.call(this, index))
		.then(this.toggleDD.call(this, by.css('.btn-group.bootstrap-select.form-control.open')));
};

Settings.prototype.selectProfessorPreset = function(index) {
	return this.toggleDD(this.settings.fields.preset.professor)
		.then(this.selectIthElement.call(this, index))
		.then(this.toggleDD.call(this, by.css('.btn-group.bootstrap-select.form-control.open')));
};

Settings.prototype.fillUser = function(data) {
	return this.setUsername(data.username)
		.then(this.setPassword.call(this, data.password))
		.then(this.setLName.call(this, data.lname))
		.then(this.setFName.call(this, data.fname))
		.then(this.setEmail.call(this, data.email));
};

module.exports = Settings;
