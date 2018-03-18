'use strict';

var assert = require('assert');
var Utils = require('./utils');

var Faculty_Member = function(connection) {
  this.conn = connection;
  this.utils = new Utils(this.conn);
};

/**
 * Update faculty_member presets.
 * If a preset exists with the same name it will update it to match the new values
 * // NOTE: escape input to prevent sql injections
 * @param {Number} memberId
 * @param {Number} preset_name
 * @param {Array} column_names
 * @param {Array} column_val
 * @param {Array} filter_name
 * @param {Array} filter_val
 */
Faculty_Member.prototype.updatePreset = function(memberId, role, preset_name, column_name, column_val, filter_name, filter_val, cb) {
  assert(typeof memberId === 'number');
  assert(typeof role === 'string');
  assert(role === 'Professor' || role === 'Committee Member' || role === 'Admin');
  assert(typeof preset_name === 'string');
  assert(Array.isArray(column_name));
  assert(Array.isArray(column_val));
  assert(column_name.length === column_val.length);
  assert(Array.isArray(filter_name));
  assert(Array.isArray(filter_val));
  assert(filter_name.length === filter_val.length);

  var tableName = 'faculty_member';
  var commaDelimeter = ',';
  var presetRole;
  //check if the user has the roles
  this.utils.hasRole(memberId, role, function(err, result) {
    if (err) return cb(err);
    //checks which role was selected and if the member has the role.
    if (role === 'Professor' && result) {
      presetRole = 'presetProf';
    } else if (role === 'Admin' && result) {
      presetRole = 'presetCommittee';
    } else if (role === 'Committee Member' && result) {
      presetRole = 'presetAdmin';
    } else {
      err = new Error('Member ' + memberId + 'could not save the preset for role ' + role + '. This may be because you are not assigned the role or the role does not exist.');
      return cb(err, result);
    }

    var whereField = 'fm_Id';
    //to be used for inserting in JSON_OBJECT for sql
    var col = 'JSON_OBJECT(';
    for (var i = 0; i < column_name.length; i++) {
      if (i < column_name.length - 1) {
        col = col + '\'' + column_name[i] + '\'' + commaDelimeter + '\'' + column_val[i] + '\'' + commaDelimeter;
      } else {
        col = col + '\'' + column_name[i] + '\'' + commaDelimeter + '\'' + column_val[i] + '\'' + ')';
      }
    }
    var filt = 'JSON_OBJECT(';
    for (i = 0; i < filter_name.length; i++) {
      if (i < filter_name.length - 1) {
        filt = filt + '\'' + filter_name[i] + '\'' + commaDelimeter + '\'' + filter_val[i] + '\'' + commaDelimeter;
      } else {
        filt = filt + '\'' + filter_name[i] + '\'' + commaDelimeter + '\'' + filter_val[i] + '\'' + ')';
      }
    }

    var preset_json = 'JSON_OBJECT(\'cols\'' + commaDelimeter + col + commaDelimeter + '\'filt\'' + commaDelimeter + filt + ')';
    var presetRoleVal = 'IF(' + presetRole + ' is NULL, JSON_OBJECT(\'' + preset_name + '\'' + commaDelimeter + preset_json + ')' + commaDelimeter + 'JSON_SET(' + presetRole + commaDelimeter + '\'$.' + preset_name + '\'' + commaDelimeter + preset_json + '))';
    var updateStatement = this.utils.createUpdateStatement(tableName, [presetRole], [presetRoleVal], [whereField], memberId);

    this.conn.query(updateStatement, cb);
  });

};

module.exports = Faculty_Member;
