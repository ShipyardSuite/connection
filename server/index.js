'use strict';

const express = require('express');
const expressWs = require('express-ws');
const fs = require('fs');
const mongoose = require('mongoose');
const winston = require('winston');
const Redis = require('winston-redis');
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
		this.logger;
	}

	/**
	 * Initialize Application.
	 * @method init
	 */
	init() {
		this.configLogger();
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

	/**
	 * Configure Database.
	 * @method configDB
	 */
	configDB() {
		mongoose.connect(this.database, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		});

		mongoose.Promise = global.Promise;
	}

	/**
	 * Configure Redis-Logger.
	 * @method configLogger
	 */
	configLogger() {
		/**
		 * @todo Add Logger to all services
		 * @body Currently the Logger only works in the connection service, this configuration should be copied to all nodejs based service.
		 */
		this.logger = winston.createLogger({
			format: winston.format.timestamp(),
			transports: [
				new winston.transports.Console({
					format: winston.format.combine(
						winston.format.timestamp({ format: 'YYYY-MM-DD hh:mm:ss a' }),
						winston.format.colorize(),
						winston.format.simple(),
						winston.format.printf((info) => `${info.timestamp} - ${info.level}: ${info.message}`)
					)
				}),
				new Redis({
					host: 'redis',
					port: 6379,
					container: 'logs',
					expire: 7 * 24 * 60 * 60
				})
			]
		});
	}

	/**
	 * Read API routes from /api/directory, if more than 1 route exists.
	 * @method apiRoutes
	 */
	apiRoutes() {
		fs.readdirSync(__dirname + '/api/').forEach((file, i, allRoutes) => {
			if (allRoutes.length > 0) {
				require(`./api/${file.substr(0, file.indexOf('.'))}`)(this.app, this.logger, this.serviceName);
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
			this.logger.log({
				level: 'info',
				message: `Service "${this.serviceName}" listening on port ${this.servicePort}`,
				reason: 'starting server'
			});
		});
	}
}
const application = new App();
application.init();
