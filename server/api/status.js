'use strict';

module.exports = (app, serviceName) => {
	app.get(`/${serviceName}/api/status`, (req, res) => {
		res.json({ success: true, message: `Hello from service "${serviceName}"` });
	});
};
