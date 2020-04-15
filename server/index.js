'use strict';

const express = require('express');
const expressWs = require('express-ws');
const fs = require('fs');
const mongoose = require('mongoose');

/**
 * Main application class.
 * @class App
 */
class App {
	/** @constructor */
	constructor() {
		this.socketServer = new expressWs(express());
		this.app = this.socketServer.app;
		this.serviceName = process.env.SERVICE_NAME || 'default';
		this.servicePort = process.env.SERVICE_PORT || 3000;
		this.database = process.env.DATABASE_URL || 'mongodb://mongo:27017/db';
		this.refreshSpeed = 30;
		this.player = [];
	}

	/**
	 * Initialize Application.
	 * @method init
	 */
	init() {
		this.config();
		this.configDB();
		this.apiRoutes();
		this.handleSocketRoutes();
		this.socketResponse();
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

	configDB() {
		mongoose.connect(this.database, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		});

		mongoose.Promise = global.Promise;
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

	handleSocketRoutes() {
		const player = this.player;

		this.app.ws('/', function(ws, aWss, req) {
			ws.on('message', (message) => {
				// const obj = JSON.parse(message.toString());
				const obj = message.toString();
				console.log(obj);

				//player.push({ playerId: obj.playerId });
			});
		});
	}

	socketResponse() {
		const aWss = this.socketServer.getWss('/');
		const player = this.player;

		setInterval(function() {
			aWss.clients.forEach(function(client) {
				client.send(JSON.stringify({ success: true, player: player, ping: true }));
			});
		}, this.refreshSpeed);
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
const application = new App();
application.init();
