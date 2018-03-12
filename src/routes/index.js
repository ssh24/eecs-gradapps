'use strict';

module.exports = function(app) {
	// home page route
	app.get('/', function(req, res) {
		res.render('index', { title: 'Welcome to Grad Apps', user: null, 
			role: null});
	});
};
