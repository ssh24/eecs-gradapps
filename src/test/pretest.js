'use strict';

process.env.TEST_MYSQL_HOST =
  process.env.TEST_MYSQL_HOST || process.env.MYSQL_HOST || 'localhost';
process.env.TEST_MYSQL_PORT =
  process.env.TEST_MYSQL_PORT || process.env.MYSQL_PORT || 3306;
process.env.TEST_MYSQL_USER =
  process.env.TEST_MYSQL_USER || process.env.MYSQL_USER || 'root';
process.env.TEST_MYSQL_PASSWORD =
  process.env.TEST_MYSQL_PASSWORD || process.env.MYSQL_PASSWORD || 'pass';

var fs = require('fs');
var cp = require('child_process');

var sql = fs.createReadStream(require.resolve('./lib/database/seed.sql'));
var stdio = ['pipe', process.stdout, process.stderr];
var args = ['--user=' + process.env.TEST_MYSQL_USER];

if (process.env.TEST_MYSQL_HOST) {
	args.push('--host=' + process.env.TEST_MYSQL_HOST);
}
if (process.env.TEST_MYSQL_PORT) {
	args.push('--port=' + process.env.TEST_MYSQL_PORT);
}
if (process.env.TEST_MYSQL_PASSWORD) {
	args.push('--password=' + process.env.TEST_MYSQL_PASSWORD);
}

console.log('seeding DB ...');
var mysql = cp.spawn('mysql', args, {stdio: stdio});
sql.pipe(mysql.stdin);
mysql.on('exit', function(code) {
	console.log('done seeding DB');
	setTimeout(function() {
		process.exit(code);
	}, 200);
});