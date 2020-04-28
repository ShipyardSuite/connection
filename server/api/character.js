'use strict';

const mongoose = require('mongoose');

const { Player, Project, Character } = require('./../models');

module.exports = (app, logger, serviceName) => {
	app.post(`/${serviceName}/api/character/create`, (req, res, next) => {
		const { body } = req;
		const { query } = body;

		console.log(query);
	});
};
