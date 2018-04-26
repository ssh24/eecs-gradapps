'use strict';

var cp = require('child_process');
var db = require('../config/db-type');

var isApp = process.env.NODE_ENV === 'test' ? true : (process.argv[2] ? 
	process.argv[2] : false);
var sql, dbType, dropStmt, createStmt, useStmt, setStmt;

if (isApp) {
	dbType = db.app;
}
else {
	dbType = db.test;
}

dropStmt = 'DROP DATABASE IF EXISTS `' + dbType + '`; ';
createStmt = 'CREATE DATABASE `' + dbType + '`; ';
useStmt = 'USE `' + dbType + '`; ';
setStmt = 'SET autocommit=0; source test/lib/database/seed.sql; COMMIT;';

sql = dropStmt + createStmt + useStmt + setStmt;  

process.env.TEST_MYSQL_HOST =
		process.env.TEST_MYSQL_HOST || process.env.MYSQL_HOST || 
		'localhost';
process.env.TEST_MYSQL_PORT =
		process.env.TEST_MYSQL_PORT || process.env.MYSQL_PORT || 
		3306;
process.env.TEST_MYSQL_USER =
		process.env.TEST_MYSQL_USER || process.env.MYSQL_USER || 
		'root';
process.env.TEST_MYSQL_PASSWORD =
		process.env.TEST_MYSQL_PASSWORD || process.env.MYSQL_PASSWORD || 
		'pass';
	
	
var stdio = ['pipe', process.stdout, process.stderr];
var args = ['--user=' + process.env.TEST_MYSQL_USER, '--execute=' + sql];
	
if (process.env.TEST_MYSQL_HOST) {
	args.push('--host=' + process.env.TEST_MYSQL_HOST);
}
if (process.env.TEST_MYSQL_PORT) {
	args.push('--port=' + process.env.TEST_MYSQL_PORT);
}
if (process.env.TEST_MYSQL_PASSWORD) {
	args.push('--password=' + process.env.TEST_MYSQL_PASSWORD);
}
	
console.log('>> seeding database for ' + (isApp ? 'app ...' : 'test ...'));
cp.spawn('mysql', args, {stdio: stdio});
