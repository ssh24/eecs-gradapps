'use strict';

module.exports = function(config) {
	var app = config.app;
	var application = config.application;
	var route = config.route;
    
	// viewing an application pdf route
	app.get(route + '/view', getApplicationFile, function(req, res) {
		res.contentType('application/pdf');
		res.send(req.apps.file);
	});
    
	function getApplicationFile(req, res, next) {
		var appId = parseInt(req.query.appId);
		application.getApplicationFile(appId, req.user.id, 
			function(err, result) {
				if (err) next(err);
				req.apps = {};
				req.apps.file = result;
				next();
			});
	}
};
