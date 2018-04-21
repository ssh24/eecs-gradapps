'use strict';

var _ = require('lodash');

var async = require('async');

module.exports = function(config, fns) {
	var app = config.app;
	var application = config.application;
	var review = config.review;
	var utils = config.utils;
	var role = config.role;
	var route = config.route;
	var main = '/edit';
	var appId, assignees, cms;
    
	var getEditApplication = fns.concat([getApplicationData]);
	var postEditApplication = fns.concat([updateAppl]);
    
	// editing an application route - GET
	app.get(route + main, getEditApplication, function(req, res) {
		var userInfo = req.user;
		res.render('edit-app', { 
			title: 'Edit Application',
			user: userInfo.id,
			fullname: userInfo.fullname,
			roles: userInfo.roles,
			role: role,
			gpa: req.apps.gpa || [],
			foi: req.apps.foi || [],
			profs: req.apps.profs || [],
			appId: parseInt(req.query.appId),
			sid: req.apps.edit.student_Id,
			session: req.apps.edit.app_Session,
			lname: req.apps.edit.LName,
			fname: req.apps.edit.FName,
			email: req.apps.edit.Email,
			gender: req.apps.edit.Gender,
			selected_gpa: req.apps.edit.GPA,
			gpa_final: req.apps.edit.GPA_FINAL,
			gre: req.apps.edit.GRE,
			toefl: req.apps.edit.TOEFL,
			ielts: req.apps.edit.IELTS,
			yelt: req.apps.edit.YELT,
			degree: req.apps.edit.Degree,
			vstatus: req.apps.edit.VStatus,
			rank: req.apps.edit.Rank,
			reviewed: req.apps.edit.committeeReviewed,
			selected_foi: req.apps.edit.FOI,
			selected_profs: req.apps.edit.prefProfs,
			profContacted: req.apps.edit.profContacted,
			profRequested: req.apps.edit.profRequested,
			programDecision: req.apps.edit.programDecision,
			studentDecision: req.apps.edit.studentDecision,
			declineReason: req.apps.edit.declineReason,
			ygsAwarded: req.apps.edit.ygsAwarded,
			app_file: req.apps.edit.app_file,
			assignees: req.apps.edit.assignees,
			cms: req.apps.edit.cms,
			showfilter: false,
		});
	});

	// editing an application route - POST
	app.post(route + main, postEditApplication, function(req, res) {
		res.redirect(route);
	});
    
	function getApplicationData(req, res, next) {
		appId = parseInt(req.query.appId);
		if (!appId)
			res.redirect(route);
		else {
			application.getApplicationData(appId, req.user.id, function(err, result) {
				if (err) {
					res.redirect(route);
				}
				req.apps.edit = {};
				
				req.apps.edit.student_Id = result['student_Id'];
				req.apps.edit.app_Session = result['app_Session'];
				req.apps.edit.LName = result['LName'];
				req.apps.edit.FName = result['FName'];
				req.apps.edit.Email = result['Email'];
				
				req.apps.edit.Gender = result['Gender'];
				req.apps.edit.GPA = result['GPA'];
				req.apps.edit.GPA_FINAL = result['GPA_FINAL'];
				req.apps.edit.GRE = result['GRE'];
				req.apps.edit.TOEFL = result['TOEFL'];
				
				req.apps.edit.IELTS = result['IELTS'];
				req.apps.edit.YELT = result['YELT'];
				req.apps.edit.Degree = result['Degree'];
				req.apps.edit.VStatus = result['VStatus'];
				req.apps.edit.Rank = result['Rank'];
				
				req.apps.edit.committeeReviewed = result['committeeReviewed'];
				req.apps.edit.FOI = result['FOI'];
				req.apps.edit.prefProfs = result['prefProfs'];
				req.apps.edit.profContacted = result['profContacted'];
				req.apps.edit.profRequested = result['profRequested'];
				
				req.apps.edit.programDecision = result['programDecision'];
				req.apps.edit.studentDecision = result['studentDecision'];
				req.apps.edit.declineReason = result['declineReason'];
				req.apps.edit.ygsAwarded = result['ygsAwarded'];
				req.apps.edit.app_file = result['app_file'];
	
				req.apps.edit.assignees = assignees = [];

				utils.getAllCommitteeMembers(function(err, rcms) {
					if (err) res.redirect(route);
					req.apps.edit.cms = cms = rcms;

					review.getReviewAssigneeID(appId, function(err, ids) {
						if (err) res.redirect(route);
						ids = _.map(ids, 'committeeId');
	
						async.each(ids, getMemberName, next);
					});
				});

				function getMemberName(id, cb) {
					utils.getMemberFullName(id, function(err, res1) {
						if (err) return cb(err);
						req.apps.edit.assignees.push(res1);
						cb();
					});
				}
			});
		}
	}

	function updateAppl(req, res, next) {
		var body = req.body;
		var reviewers = body['Reviewers'] && Array.isArray(body['Reviewers']) ? body['Reviewers'] : [body['Reviewers']];
		delete body['Reviewers'];

		if (body.create === '') {
			var data = {};

			if (req.files.app_file) 
				data.app_file = req.files.app_file.data;
				
			for(var keys in body) {
				if (keys === 'Gender') {
					var gender = body[keys] === 'Male' ? 'M' : (body[keys] === 
						'Female' ? 'F' : null);
					data[keys] = gender;
				} else if (keys === 'FOI' || keys === 'prefProfs' || 
					keys === 'profContacted' || keys === 'profRequested' || keys === 'Rank') {
					data[keys] = JSON.stringify(body[keys]);
				} else if (body[keys] != '') {
					data[keys] = body[keys];
				}
			}
			
			application.updateApplication(data, appId, req.user.id, function(err) {
				if (err) res.redirect(route);
				var rev_ids = [];
				var diff = _.difference(reviewers, assignees);

				if (!(_.isEmpty(diff))) { // assign a review
					async.each(cms, function(cm, cb1) {
						if (diff.includes(cm['name'])) rev_ids.push(cm['id']);
						cb1();
					}, function() {
						async.each(rev_ids, function(id, cb2) {
							review.assignReview(appId, id, req.user.id, cb2);
						}, next);
					});
				} else {
					// unassign or dismiss a review
					diff = _.difference(assignees, reviewers);
					async.each(cms, function(cm, cb1) {
						if (diff.includes(cm['name'])) rev_ids.push(cm['id']);
						cb1();
					}, function() {
						async.each(rev_ids, function(id, cb2) {
							review.getReviewStatus(appId, id, function(err, status) {
								if (err) return cb2(err);
								else if (status === 'Submitted')
									review.dismissReview(appId, id, req.user.id, cb2);
								else review.unassignReview(appId, id, req.user.id, cb2);
							});	
						}, next);
					});
				}
			});
		} else if (body.delete === '') {
			application.deleteApplication(appId, req.user.id, next);
		}
	}
};
