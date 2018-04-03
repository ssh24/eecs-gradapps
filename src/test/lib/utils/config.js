'use strict';

var db = require('../../../config/db-type');

module.exports = {
	'credentials' :{
		'app' : {
			'admin': {
				'username': 'admin',
				'password': 'admin',
				'fullname': 'John Doe'
			},
			'committee': {
				'username': 'von',
				'password': 'committee',
				'fullname': 'Von Brakespear'
			}
		},
		'database' : {
			'host': process.env.MYSQL_HOST,
			'port': process.env.MYSQL_PORT,
			'user': process.env.MYSQL_USER,
			'password': process.env.MYSQL_PASSWORD,
			'database': db.test,
			'multipleStatements': true
		}
	},
	'app': {
		'foi': ['Artificial Intelligence', 'Bioinformatics', 
			'Biomedical Engineering', 'Computational Neuroscience', 
			'Computational Biology', 'Computer Graphics and Media', 
			'Computer Security and Networks', 'Computer Vision', 
			'Data Science', 'Data Mining', 'Distributed Computing', 
			'Embedded Systems', 'History of Computing', 
			'Human-Computer Interaction', 'Graph Mining', 
			'Integrated Circuits and Systems', 
			'Large-scale Software Systems', 
			'Micro/Nano Electronic Systems', 'Machine Learning', 
			'Performance Engineering', 
			'Power and Renewable Energy Systems', 'Robotics', 
			'Signal Processing', 'Software Engineering', 
			'Theory of Computation']
	},
	'database': {
		'tables': ['application', 'application_review', 
			'application_seen', 'faculty_member', 'university', 'foi', 'gpa', 
			'sessions'],
		'fields': {
			'faculty_member': ['fm_Id', 'fm_Username', 'fm_Lname', 'fm_Fname', 
				'fm_Email', 'fm_Roles', 'presetProf', 'presetCommittee', 
				'presetAdmin'],
			'application': ['app_Id', 'student_Id', 'app_Date', 'app_Session', 
				'LName', 'FName', 'Email', 'Gender', 'GPA', 'GPA_FINAL', 'GRE',
				'Degree', 'VStatus', 'committeeReviewed', 'FOI', 'prefProfs', 
				'profContacted', 'profRequested', 'letterDate', 'Rank',
				'programDecision', 'studentDecision', 'declineReason', 
				'ygsAwarded', 'TOEFL', 'IELTS', 'YELT', 'app_file'],
			'application_review': ['committeeId', 'appId', 'assignDate', 
				'Background', 'researchExp', 'Letter', 'Comments', 'c_Rank', 'Status', 
				'lastReminded', 'PreviousInst', 'UniAssessment'],
			'application_seen': ['fmId', 'appId', 'seen'],
			'university': ['u_Id', 'u_Name', 'u_Assessments'],
			'foi': ['field_Id', 'field_Name'],
			'sessions': ['session_id', 'expires', 'data'],
			'gpa': ['letter_grade', 'grade_point']
		}
	}
};
