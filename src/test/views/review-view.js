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
    
	this.review.form = {};

	this.review.form.lname = by.id('lname');
	this.review.form.fname = by.id('fname');
	this.review.form.degree = by.id('degree');
	this.review.form.gpa = by.id('gpa');
	this.review.form.gre = by.id('gre');

	this.review.form.prev_uni = by.css('button[data-id="prev_uni"]');
	this.review.form.new_uni = by.id('new_uni');
	this.review.form.new_uni_name = by.id('new_uni_name');
	this.review.form.new_uni_btn = by.id('new_uni_btn');
	this.review.form.uni_desc = by.css('button[data-id="uni_desc"]');

	this.review.form.add_assessment = by.id('add_assessment');
	this.review.form.assessment = by.id('assessment');
	this.review.form.assessment_btn = by.id('assessment_btn');

	this.review.form.assessment_txt = by.id('assessment_txt');

	this.review.form.background = by.id('background');
	this.review.form.research = by.id('research');
	this.review.form.comments = by.id('comments');

	this.review.form.rank = by.css('button[data-id="rank"]');

	this.review.form.close = by.id('review-close');
	this.review.form.save = by.id('review-save');
	this.review.form.submit = by.id('review-submit');
}

Review.prototype.startReview = function(appId) {
	var elem = by.id(this.review.start + '-' + appId);
	return this.utils.waitForElementClickable(elem, this.timeout)
		.then(element(elem).click());
};

Review.prototype.closeReview = function() {
	return browser.executeScript('window.scrollTo(0,document.body.scrollHeight)')
		.then(element(this.review.form.close).click());
};

Review.prototype.getStatus = function() {
	return element(this.review.status).getText();
};

Review.prototype.isLNameDisplayed = function() {
	return element(this.review.form.lname).isDisplayed();
};

Review.prototype.isFNameDisplayed = function() {
	return element(this.review.form.fname).isDisplayed();
};

Review.prototype.isDegreeDisplayed = function() {
	return element(this.review.form.degree).isDisplayed();
};

Review.prototype.isGPADisplayed = function() {
	return element(this.review.form.gpa).isDisplayed();
};

Review.prototype.isGREDisplayed = function() {
	return element(this.review.form.gre).isDisplayed();
};

Review.prototype.isPrevUniDisplayed = function() {
	return element(this.review.form.prev_uni).isDisplayed();
};

Review.prototype.isNewUniCheckDisplayed = function() {
	return element(this.review.form.new_uni).isDisplayed();
};

Review.prototype.isNewUniNameDisplayed = function() {
	return element(this.review.form.new_uni_name).isDisplayed();
};

Review.prototype.isNewUniBtnDisplayed = function() {
	return element(this.review.form.new_uni_btn).isDisplayed();
};

Review.prototype.isUniAssessmentDisplayed = function() {
	return element(this.review.form.uni_desc).isDisplayed();
};

Review.prototype.isAddAssessmentCheckDisplayed = function() {
	return element(this.review.form.add_assessment).isDisplayed();
};

Review.prototype.isAddAssessmentFormDisplayed = function() {
	return element(this.review.form.assessment).isDisplayed();
};

Review.prototype.isAddAssessmentBtnDisplayed = function() {
	return element(this.review.form.assessment_btn).isDisplayed();
};

Review.prototype.isChosenAssessmentDisplayed = function() {
	return element(this.review.form.assessment_txt).isDisplayed();
};

Review.prototype.isBackgroundDisplayed = function() {
	return element(this.review.form.background).isDisplayed();
};

Review.prototype.isResearchDisplayed = function() {
	return element(this.review.form.research).isDisplayed();
};

Review.prototype.isCommentsDisplayed = function() {
	return element(this.review.form.comments).isDisplayed();
};

Review.prototype.isRankDisplayed = function() {
	return element(this.review.form.rank).isDisplayed();
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
