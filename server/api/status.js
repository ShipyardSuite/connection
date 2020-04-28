'use strict';

module.exports = (app, logger, serviceName) => {
	app.get(`/${serviceName}/api/status`, (req, res) => {
		res.status(200).json({ success: true, message: `Hello from service "${serviceName}"` });

		res.end(
			logger.log({
				level: 'info',
				message: `Hello from service "${serviceName}"`,
				reason: 'check status',
				status: res.statusCode
			})
		);
	});
};
