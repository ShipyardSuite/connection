'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');

/**
 * Main application class.
 * @class App
 */
class App {
	/** @constructor */
	constructor() {
		this.app = express();
		this.serviceName = process.env.SERVICE_NAME || 'default';
		this.servicePort = process.env.SERVICE_PORT || 3000;
	}

	/**
	 * Initialize Application.
	 * @method init
	 */
	init() {
		this.config();
		this.apiRoutes();
		this.start();
	}

	/**
	 * Configure Express middleware.
	 * @method config
	 */
	config() {
		this.app.use(require('express').urlencoded({ extended: true }));
		this.app.use(require('express').json());
	}

	/**
	 * Read API routes from /api/directory, if more than 1 route exists.
	 * @method apiRoutes
	 */
	apiRoutes() {
		fs.readdirSync(__dirname + '/api/').forEach((file, i, allRoutes) => {
			if (allRoutes.length > 0) {
				require(`./api/${file.substr(0, file.indexOf('.'))}`)(this.app, this.serviceName);
			}
		});
	}

	/**
	 * Start express server and parse an information message to the console.
	 * @method start
	 */
	start() {
		this.app.listen(this.servicePort, () => {
			console.log(
				`Service "${this.serviceName}" listening on port ${this.servicePort} - http://localhost:${this
					.servicePort}/${this.serviceName}/`
			);
		});
	}
}

// Create an instance of the Application and initialize it.
const application = new App();
application.init();
