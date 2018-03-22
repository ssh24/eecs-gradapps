'use strict';

var Utils = require('../lib/utils/shared-utils');

function Review(timeout) {
	this.utils = new Utils();
	this.timeout = timeout;
    
	this.review = {};
	this.review.start = 'start-rev';
	this.review.continue = 'continue-rev';
	this.review.view = 'view-rev';
    
	this.review.status = by.id('data-0-4');
    
	this.review.form = by.id('review-form');

	this.review.form.lname = by.id('lname');
	this.review.form.fname = by.id('fname');
	this.review.form.degree = by.id('degree');
	this.review.form.gpa = by.id('gpa');
	this.review.form.gre = by.id('gre');

	this.review.form.prev_uni_id = by.id('prev_uni');
	this.review.form.prev_uni = by.css('button[data-id="prev_uni"]');
	this.review.form.new_uni = by.id('new_uni');
	this.review.form.new_uni_name = by.id('new_uni_name');
	this.review.form.new_uni_btn = by.id('new_uni_btn');
	this.review.form.new_uni_error = by.id('inst_exists');

	this.review.form.uni_desc_id = by.id('uni_desc');
	this.review.form.uni_desc = by.css('button[data-id="uni_desc"]');
	this.review.form.add_assessment = by.id('add_assessment');
	this.review.form.select_add_assessment_id = by.id('select_add_assessment');
	this.review.form.select_add_assessment = by.css('button[data-id="select_add_assessment"]');
	this.review.form.assessment = by.id('assessment');
	this.review.form.assessment_btn = by.id('assessment_btn');
	this.review.form.assmt_error = by.id('assmt_exists');

	this.review.form.background = by.id('background');
	this.review.form.research = by.id('research');
	this.review.form.comments = by.id('comments');

	this.review.form.rank_id = by.id('rank');
	this.review.form.rank = by.css('button[data-id="rank"]');

	this.review.form.close = by.id('review-close');
	this.review.form.save = by.id('review-save');
	this.review.form.submit = by.id('review-submit');

	this.review.form.select = {};
	this.review.form.select.active = by.css('.btn-group.bootstrap-select.show-tick.form-control.show-menu-arrow > button');
}

Review.prototype.startReview = function(appId) {
	var elem = by.id(this.review.start + '-' + appId);
	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Review.prototype.continueReview = function(appId) {
	var elem = by.id(this.review.continue + '-' + appId);
	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Review.prototype.viewReview = function(appId) {
	var elem = by.id(this.review.view + '-' + appId);
	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Review.prototype.closeReview = function() {
	return browser.executeScript('window.scrollTo(0,document.body.scrollHeight)')
		.then(element(this.review.form.close).click());
};

Review.prototype.saveReview = function() {
	return browser.executeScript('window.scrollTo(0,document.body.scrollHeight)')
		.then(element(this.review.form.save).click());
};

Review.prototype.submitReview = function() {
	return browser.executeScript('window.scrollTo(0,document.body.scrollHeight)')
		.then(element(this.review.form.submit).click());
};

Review.prototype.getStatus = function() {
	return element(this.review.status).getText();
};

Review.prototype.setGre = function(value) {
	return this.utils.clearThenSendKeys(element(this.review.form.gre), value);
};

Review.prototype.getGre = function() {
	return element(this.review.form.gre).getAttribute('value');
};

Review.prototype.setBackground = function(value) {
	return this.utils.clearThenSendKeys(element(this.review.form.background), value);
};

Review.prototype.getBackground = function() {
	return element(this.review.form.background).getAttribute('value');
};

Review.prototype.setResearch = function(value) {
	return this.utils.clearThenSendKeys(element(this.review.form.research), value);
};

Review.prototype.getResearch = function() {
	return element(this.review.form.research).getAttribute('value');
};

Review.prototype.setComments = function(value) {
	return this.utils.clearThenSendKeys(element(this.review.form.comments), value);
};

Review.prototype.getComments = function() {
	return element(this.review.form.comments).getAttribute('value');
};

Review.prototype.selectUniversity = function(index) {
	var elem = by.css('.btn-group.bootstrap-select.show-tick.form-control.show-menu-arrow.open > .dropdown-menu.open > .dropdown-menu.inner > li[data-original-index="'+index+'"] > a');
	return this.toggleUniversityDD()
		.then(this.utils.waitForElementClickable(elem, this.timeout))
		.then(element(elem).click())
		.then(this.toggleUniversityDD.call(this));
};

Review.prototype.selectAssessment = function(index) {
	var elem = by.css('.btn-group.bootstrap-select.show-tick.form-control.show-menu-arrow.open > .dropdown-menu.open > .dropdown-menu.inner > li[data-original-index="'+index+'"] > a');
	return this.toggleAssessmentDD()
		.then(this.utils.waitForElementClickable(elem, this.timeout))
		.then(element(elem).click())
		.then(this.toggleAssessmentDD.call(this));
};

Review.prototype.selectUniversityForAssessment = function(index) {
	var elem = by.css('.btn-group.bootstrap-select.form-control.show-menu-arrow.open > .dropdown-menu.open > .dropdown-menu.inner > li[data-original-index="'+index+'"] > a');
	return this.toggleSelectUniversityForAssessmentDD()
		.then(this.utils.waitForElementClickable(elem, this.timeout))
		.then(element(elem).click());
};

Review.prototype.selectRank = function(index) {
	var elem = by.css('.btn-group.bootstrap-select.form-control.show-menu-arrow.open > .dropdown-menu.open > .dropdown-menu.inner > li[data-original-index="'+index+'"] > a');
	return this.toggleRankDD()
		.then(this.utils.waitForElementClickable(elem, this.timeout))
		.then(element(elem).click());
};

Review.prototype.toggleUniversityDD = function() {
	return this.utils.waitForElementClickable(this.review.form.prev_uni, this.timeout)
		.then(element(this.review.form.prev_uni).click());
};

Review.prototype.toggleAssessmentDD = function() {
	return this.utils.waitForElementClickable(this.review.form.uni_desc, this.timeout)
		.then(element(this.review.form.uni_desc).click());
};

Review.prototype.toggleSelectUniversityForAssessmentDD = function() {
	return this.utils.waitForElementClickable(this.review.form.select_add_assessment, this.timeout)
		.then(element(this.review.form.select_add_assessment).click());
};

Review.prototype.toggleRankDD = function() {
	return this.utils.waitForElementClickable(this.review.form.rank, this.timeout)
		.then(element(this.review.form.rank).click());
};

Review.prototype.getSelectedUniversity = function() {
	return element.all(this.review.form.select.active).get(0).getAttribute('title');
};

Review.prototype.getSelectedAssessment = function() {
	return element.all(this.review.form.select.active).get(1).getAttribute('title');
};

Review.prototype.getSelectedRank = function() {
	return element.all(by.css('.btn-group.bootstrap-select.form-control.show-menu-arrow > button')).get(3).getAttribute('title');
};

Review.prototype.addNewUniversity = function(university) {
	return this.utils.waitForElementClickable(this.review.form.new_uni, this.timeout)
		.then(element(this.review.form.new_uni).click())
		.then(this.utils.clearThenSendKeys(element(this.review.form.new_uni_name), university))
		.then(this.utils.waitForElementClickable(this.review.form.new_uni_btn), this.timeout)
		.then(element(this.review.form.new_uni_btn).click());
};

Review.prototype.getAddUniversityError = function() {
	return element(this.review.form.new_uni_error).getText();
};

Review.prototype.addUniversityAssessment = function(index, assessment) {
	return this.utils.waitForElementClickable(this.review.form.add_assessment, this.timeout)
		.then(element(this.review.form.add_assessment).click())
		.then(this.selectUniversityForAssessment.call(this, index))
		.then(this.utils.clearThenSendKeys(element(this.review.form.assessment), assessment))
		.then(this.utils.waitForElementClickable(this.review.form.assessment_btn), this.timeout)
		.then(element(this.review.form.assessment_btn).click());
};

Review.prototype.getAddAssessmentError = function() {
	return element(this.review.form.assmt_error).getText();
};

Review.prototype.isLNameDisplayed = function() {
	return element(this.review.form.lname).isDisplayed();
};

Review.prototype.isLNameEnabled = function() {
	return element(this.review.form.lname).isEnabled();
};

Review.prototype.isFNameDisplayed = function() {
	return element(this.review.form.fname).isDisplayed();
};

Review.prototype.isFNameEnabled = function() {
	return element(this.review.form.fname).isEnabled();
};

Review.prototype.isDegreeDisplayed = function() {
	return element(this.review.form.degree).isDisplayed();
};

Review.prototype.isDegreeEnabled = function() {
	return element(this.review.form.degree).isEnabled();
};

Review.prototype.isGPADisplayed = function() {
	return element(this.review.form.gpa).isDisplayed();
};

Review.prototype.isGPAEnabled = function() {
	return element(this.review.form.gpa).isEnabled();
};

Review.prototype.isGREDisplayed = function() {
	return element(this.review.form.gre).isDisplayed();
};

Review.prototype.isGREEnabled = function() {
	return element(this.review.form.gre).isEnabled();
};

Review.prototype.isPrevUniDisplayed = function() {
	return element(this.review.form.prev_uni).isDisplayed();
};

Review.prototype.isPrevUniEnabled = function() {
	return element(this.review.form.prev_uni_id).isEnabled();
};

Review.prototype.isNewUniCheckDisplayed = function() {
	return element(this.review.form.new_uni).isDisplayed();
};

Review.prototype.isNewUniCheckEnabled = function() {
	return element(this.review.form.new_uni).isEnabled();
};

Review.prototype.isNewUniNameDisplayed = function() {
	return element(this.review.form.new_uni_name).isDisplayed();
};

Review.prototype.isNewUniNameEnabled = function() {
	return element(this.review.form.new_uni_name).isEnabled();
};

Review.prototype.isNewUniBtnDisplayed = function() {
	return element(this.review.form.new_uni_btn).isDisplayed();
};

Review.prototype.isNewUniBtnEnabled = function() {
	return element(this.review.form.new_uni_btn).isEnabled();
};

Review.prototype.isUniAssessmentDisplayed = function() {
	return element(this.review.form.uni_desc).isDisplayed();
};

Review.prototype.isUniAssessmentEnabled = function() {
	return element(this.review.form.uni_desc_id).isEnabled();
};

Review.prototype.isAddAssessmentCheckDisplayed = function() {
	return element(this.review.form.add_assessment).isDisplayed();
};

Review.prototype.isAddAssessmentCheckEnabled = function() {
	return element(this.review.form.add_assessment).isEnabled();
};

Review.prototype.isAddAssessmentFormDisplayed = function() {
	return element(this.review.form.assessment).isDisplayed();
};

Review.prototype.isAddAssessmentFormEnabled = function() {
	return element(this.review.form.assessment).isEnabled();
};

Review.prototype.isUniAssessmentDDDisplayed = function() {
	return element(this.review.form.select_add_assessment).isDisplayed();
};

Review.prototype.isUniAssessmentDDEnabled = function() {
	return element(this.review.form.select_add_assessment_id).isEnabled();
};

Review.prototype.isAddAssessmentBtnDisplayed = function() {
	return element(this.review.form.assessment_btn).isDisplayed();
};

Review.prototype.isAddAssessmentBtnEnabled = function() {
	return element(this.review.form.assessment_btn).isEnabled();
};

Review.prototype.isBackgroundDisplayed = function() {
	return element(this.review.form.background).isDisplayed();
};

Review.prototype.isBackgroundEnabled = function() {
	return element(this.review.form.background).isEnabled();
};

Review.prototype.isResearchDisplayed = function() {
	return element(this.review.form.research).isDisplayed();
};

Review.prototype.isResearchEnabled = function() {
	return element(this.review.form.research).isEnabled();
};

Review.prototype.isCommentsDisplayed = function() {
	return element(this.review.form.comments).isDisplayed();
};

Review.prototype.isCommentsEnabled = function() {
	return element(this.review.form.comments).isEnabled();
};

Review.prototype.isRankDisplayed = function() {
	return element(this.review.form.rank).isDisplayed();
};

Review.prototype.isRankEnabled = function() {
	return element(this.review.form.rank_id).isEnabled();
};

Review.prototype.isCancelBtnDisplayed = function() {
	var self = this;
	return browser.executeScript('window.scrollTo(0,document.body.scrollHeight)')
		.then(function() {
			return element(self.review.form.close).isDisplayed();
		});
};

Review.prototype.isDraftBtnDisplayed = function() {
	var self = this;
	return browser.executeScript('window.scrollTo(0,document.body.scrollHeight)')
		.then(function() {
			return element(self.review.form.save).isDisplayed();
		});
};

Review.prototype.isSubmitBtnDisplayed = function() {
	var self = this;
	return browser.executeScript('window.scrollTo(0,document.body.scrollHeight)')
		.then(function() {
			return element(self.review.form.submit).isDisplayed();
		});
};

module.exports = Review;
