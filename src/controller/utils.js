'use strict';

var _ = require('lodash');
var assert = require('assert');

var Promise = require('bluebird');

var Utils = function(connection) {
	this.conn = connection;
};

/**
 * Create an insert statement given the table name, field names and their corresponding values.
 * @param {String} tableName
 * @param {Array} fieldNames
 * @param {Array} values
 */
Utils.prototype.createInsertStatement = function(tableName, fieldNames, values) {
	assert(typeof tableName === 'string');
	assert(Array.isArray(fieldNames));
	assert(Array.isArray(values));
	assert(fieldNames.length === values.length);

	var statement = 'INSERT INTO ' + tableName + ' (';
	var commaDelimeter = ',';

	var fnStatement = '';
	for (var i = 0; i < fieldNames.length; i++) {
		if (i < fieldNames.length - 1) {
			fnStatement = fnStatement + fieldNames[i] + commaDelimeter;
		} else {
			fnStatement = fnStatement + fieldNames[i] + ') VALUES (';
		}
	}

	var valueStatement = '';
	for (var j = 0; j < values.length; j++) {
		if (j < values.length - 1) {
			valueStatement = valueStatement + values[j] + commaDelimeter;
		} else {
			valueStatement = valueStatement + values[j] + ')';
		}
	}

	statement = statement + fnStatement + valueStatement;
	return statement;
};

/**
 * Create an update statement given the table name, field names and their corresponding values.
 * @param {String} tableName
 * @param {Array} fieldNames
 * @param {Array} values
 * @param {Array} whereFields
 * @param {Array} whereValues
 */
Utils.prototype.createUpdateStatement = function(tableName, fieldNames, values,
	whereFields, whereValues) {
	assert(typeof tableName === 'string');
	assert(Array.isArray(fieldNames));
	assert(Array.isArray(values));
	assert(fieldNames.length === values.length);
	assert(Array.isArray(whereFields));
	assert(Array.isArray(whereValues));
	assert(whereFields.length === whereValues.length);

	var statement = 'UPDATE ' + tableName + ' SET ';
	var commaDelimeter = ',';
	var andDelimeter = ' AND ';

	var fnStatement = '';
	for (var i = 0; i < fieldNames.length; i++) {
		if (i < fieldNames.length - 1) {
			fnStatement = fnStatement + fieldNames[i] + '=' + values[i] +
        commaDelimeter;
		} else {
			fnStatement = fnStatement + fieldNames[i] + '=' + values[i] +
        ' WHERE ';
		}
	}

	var whereStatement = '';
	for (var j = 0; j < whereFields.length; j++) {
		if (j < whereFields.length - 1) {
			whereStatement = whereStatement + whereFields[j] + '=' +
        whereValues[j] + andDelimeter;
		} else {
			whereStatement = whereStatement + whereFields[j] + '=' +
        whereValues[j];
		}
	}

	statement = statement + fnStatement + whereStatement;
	return statement;
};

/**
 * Create a delete statement given the table name, field names and their corresponding values.
 * @param {String} tableName
 * @param {Array} fieldNames
 * @param {Array} values
 */
Utils.prototype.createDeleteStatement = function(tableName, fieldNames, values) {
	assert(typeof tableName === 'string');
	assert(Array.isArray(fieldNames));
	assert(Array.isArray(values));
	assert(fieldNames.length === values.length);

	var statement = 'DELETE FROM ' + tableName + ' WHERE ';
	var andDelimeter = ' AND ';

	var fnStatement = '';
	for (var i = 0; i < fieldNames.length; i++) {
		if (i < fieldNames.length - 1) {
			fnStatement = fnStatement + fieldNames[i] + '=' + values[i] +
        andDelimeter;
		} else {
			fnStatement = fnStatement + fieldNames[i] + '=' + values[i];
		}
	}
	statement = statement + fnStatement;
	return statement;
};

/**
 * Returns true if member is a member of the grad apps system.
 * @param {Number} memberId
 * @param {Function} cb
 */
Utils.prototype.isMember = function(memberId, cb) {
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	this.conn.query('Select * from faculty_member where fm_Id = ?', [memberId], function(err, results) {
		if (err) return cb(err);
		return cb(err, results.length === 1);
	});
};

/**
 * Returns true if a member is logged in.
 * @param {Number} memberId
 * @param {Function} cb
 */
Utils.prototype.isLoggedIn = function(memberId, cb) {
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	var self = this;

	this.isMember(memberId, function(err, result) {
		if (err) return cb(err);
		if (result) {
			self.conn.query('Select is_LoggedIn from faculty_member where fm_Id ' +
        '= ?', [memberId],
			function(err, result) {
				if (err) return cb(err);
				assert(result, 'Result should exist');
				assert.equal(1, result.length, 'Result should exist');
				return cb(err, result[0]['is_LoggedIn'] === 1);
			});
		} else {
			err = new Error('Member ' + memberId + ' is not a valid member');
			return cb(err);
		}
	});
};

/**
 * Returns true if memberId is assigned to the given role.
 * @param {Number} memberId
 * @param {String} role
 * @param {Function} cb
 */
Utils.prototype.hasRole = function(memberId, role, cb) {
	assert(typeof memberId === 'number');
	assert(typeof role === 'string');
	assert(typeof cb === 'function');

	this.conn.query('Select fm_Roles from faculty_member where fm_Id = ?', [memberId], function(err, results) {
		if (err) return cb(err);
		if (results.length === 0) {
			err = new Error('Member with id ' + memberId +
        ' does not exist');
			return cb(err);
		}
		assert(1, results.length);
		var roles = results[0]['fm_Roles'];
		return cb(err, roles.includes(role));
	});
};

/**
 * Returns an array of the roles of the selected member.
 * @param {Number} memberId
 * @param {Function} cb
 */
Utils.prototype.getRoles = function(memberId, cb) {
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	this.conn.query('Select fm_Roles from faculty_member where fm_Id = ?', [memberId], function(err, results) {
		if (err) return cb(err);
		if (results.length === 0) {
			err = new Error('Member with id ' + memberId +
        ' does not exist');
			return cb(err);
		}
		assert(1, results.length);
		var roles = results[0]['fm_Roles'];
		return cb(err, roles);
	});
};

/**
 * Get selected role
 * @param {Number} memberId
 * @param {Function} cb
 */
Utils.prototype.getSelectedRole = function(memberId, cb) {
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	var self = this;

	this.isLoggedIn(memberId, function(err, result) {
		if (err) return cb(err);
		if (result) {
			self.conn.query('Select selectedRole from faculty_member where fm_Id = ?', [memberId], function(err, results) {
				if (err) return cb(err);
				assert(1, results.length);
				var role = results[0]['selectedRole'];
				return cb(err, role);
			});
		} else {
			err = new Error('Member ' + memberId + ' is not logged in');
			return cb(err);
		}
	});
};

/**
 * Get the member id of the associated member username
 * @param {String} username
 * @param {Function} cb
 */
Utils.prototype.getMemberId = function(username, cb) {
	assert(typeof username === 'string');
	assert(typeof cb === 'function');

	this.conn.query('Select fm_Id from faculty_member where fm_Username="' +
    username + '"',
	function(err, result) {
		if (err) return cb(err);
		if (result.length === 0) {
			err = new Error('Member with username ' + JSON.stringify(username) +
          ' does not exist');
			return cb(err);
		} else {
			return cb(err, result[0]['fm_Id']);
		}
	});
};

/**
 * Get member username
 * @param {Number} memberId
 * @param {Function} cb
 */
Utils.prototype.getMemberUsername = function(memberId, cb) {
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	this.conn.query('Select fm_Username from faculty_member where fm_Id=?', [memberId], function(err, result) {
		if (err) return cb(err);
		if (result.length === 0) {
			err = new Error('Member with id ' + memberId +
        ' does not exist');
			return cb(err);
		} else {
			return cb(err, result[0]['fm_Username']);
		}
	});
};

/**
 * Get member first name
 * @param {Number} memberId
 * @param {Function} cb
 */
Utils.prototype.getMemberFirstName = function(memberId, cb) {
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	this.conn.query('Select fm_FName from faculty_member where fm_Id=?', [memberId], function(err, result) {
		if (err) return cb(err);
		if (result.length === 0) {
			err = new Error('Member with id ' + memberId +
        ' does not exist');
			return cb(err);
		} else {
			return cb(err, result[0]['fm_FName']);
		}
	});
};

/**
 * Get member last name
 * @param {Number} memberId
 * @param {Function} cb
 */
Utils.prototype.getMemberLastName = function(memberId, cb) {
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	this.conn.query('Select fm_LName from faculty_member where fm_Id=?', [memberId], function(err, result) {
		if (err) return cb(err);
		if (result.length === 0) {
			err = new Error('Member with id ' + memberId +
        ' does not exist');
			return cb(err);
		} else {
			return cb(err, result[0]['fm_LName']);
		}
	});
};

/**
 * Get member full name
 * @param {Number} memberId
 * @param {Function} cb
 */
Utils.prototype.getMemberFullName = function(memberId, cb) {
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	var fullname = '';
	var self = this;

	this.getMemberFirstName(memberId, function(err, result) {
		if (err) return cb(err);
		if (result) {
			fullname = fullname + result + ' ';
			self.getMemberLastName(memberId, function(err, result) {
				if (err) return cb(err);
				if (result) {
					fullname = fullname + result;
					return cb(err, fullname);
				}
			});
		}
	});
};

/**
 * Unlock an account that has been blocked. Only avaliable to admins.
 * @param {Number} adminId
 * @param {Number} memberId
 * @param {Function} cb
 */
Utils.prototype.unlockAccount = function(adminId, memberId, cb) {
	assert(typeof adminId === 'number');
	assert(typeof memberId === 'number');
	assert(typeof cb === 'function');

	var self = this;
	var updateStmt;

	this.isLoggedIn(adminId, function(err, result) {
		if (err) return cb(err);
		if (result) {
			self.getSelectedRole(adminId, function(err, result) {
				if (err) return cb(err);
				if (result.indexOf('Admin') > -1) {
					self.isMember(memberId, function(err, result) {
						if (err) return cb(err);
						if (result) {
							updateStmt = self.createUpdateStatement(
								'faculty_member', ['is_LoggedIn', 'selectedRole'], [0, null], ['fm_Id'], [memberId]);
							self.conn.query(updateStmt, function(err, result) {
								if (err) return cb(err);
								return cb(err, result.affectedRows === 1);
							});
						} else {
							err = new Error('Member ' + memberId +
                ' does not exist');
							return cb(err);
						}
					});
				} else {
					err = new Error('Member ' + adminId + ' is logged in as ' +
            result);
					return cb(err);
				}
			});
		} else {
			err = new Error('Member ' + adminId + ' is not logged in');
			return cb(err);
		}
	});
};

/**
 * Get all professor names
 * @param {Function} cb 
 */
Utils.prototype.getAllProfessors = function(cb) {
	var sql = 'SELECT CONCAT_WS(\' \', `fm_Fname`, `fm_Lname`) AS `Professor Name`' 
	+ ', fm_Roles from faculty_member where fm_Roles is not null';
	var professors = [];
	this.conn.query(sql, function(err, result) {
		if (err) return cb(err);
		if(result.length > 0) {
			_.forEach(result, function(res) {
				if(res['fm_Roles'].includes('Professor'))
					professors.push(res['Professor Name']);
			});
			return cb(err, professors.sort());
		} else {
			err = new Error('No professors found');
			return cb(err);
		}
	});
};

/**
 * Get list of all field of interests
 * @param {Function} cb 
 */
Utils.prototype.getFieldOfInterests = function(cb) {
	var sql = 'SELECT field_Name from foi';
	var foi;
	this.conn.query(sql, function(err, result) {
		if (err) return cb(err);
		if(result.length > 0) {
			foi = _.map(result, 'field_Name');
			return cb(err, foi.sort());
		} else {
			err = new Error('No field of interest found');
			return cb(err);
		}
	});
};

/**
 * Get all applicant names
 * @param {Function} cb 
 */
Utils.prototype.getApplicantNames = function(cb) {
	var sql = 'SELECT CONCAT_WS(\' \', `FName`, `LName`) AS `Applicant Name`' + 
	' FROM APPLICATION where committeeReviewed=1 and Rank is not null';
	var applicants;
	this.conn.query(sql, function(err, result) {
		if (err) return cb(err);
		if(result.length > 0) {
			applicants = _.map(result, 'Applicant Name');
			return cb(err, applicants.sort());
		} else {
			err = new Error('No applicants found');
			return cb(err);
		}
	});
};

/**
 * Get all gpa
 * @param {Function} cb 
 */
Utils.prototype.getGPA = function(cb) {
	var sql = 'SELECT letter_grade as `GPA` from gpa';
	var gpas;
	this.conn.query(sql, function(err, result) {
		if (err) return cb(err);
		if(result.length > 0) {
			gpas = _.map(result, 'GPA');
			return cb(err, gpas);
		} else {
			err = new Error('No applicants found');
			return cb(err);
		}
	});
};

Utils.prototype.buildCommitteeRankFilter = function(operand, grade, cb) {
	cb = cb || this.createPromiseCallback();
	
	assert(typeof operand === 'string');
	assert(typeof grade === 'string');
	assert(typeof cb === 'function');

	var selectSql = 'Select letter_grade from gpa where grade_point ' + operand + 
	' (select grade_point from gpa where letter_grade="' + grade + '")';
	var resultSql = '(';

	this.conn.query(selectSql, function(err, grades) {
		if (err) return cb(err);
		if (grades.length > 0) {
			for(var i = 0; i < grades.length; i++) {
				var chosen = grades[i]['letter_grade'];
				resultSql += ('JSON_CONTAINS(Rank, \'"'+chosen+'"\')');
				if (i != grades.length - 1)
					resultSql += (' OR ');
				else
					resultSql += ')';
			}
			return cb(err, resultSql);
		} else {
			err = new Error('No grades found with range %s %s', operand, grade);
			return cb(err);
		}
	});
};

Utils.prototype.createPromiseCallback = function() {
	var cb;
	var promise = new Promise(function(resolve, reject) {
		cb = function(err, data) {
			if (err) return reject(err);
			return resolve(data);
		};
	});
	cb.promise = promise;
	return cb;
};

module.exports = Utils;
