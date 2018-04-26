module.exports = {
	'test': process.env.TEST_MYSQL_DATABASE || 'testdb', // default test database
	'app': process.env.MYSQL_DATABASE || 'gradapps' // default app database
};
