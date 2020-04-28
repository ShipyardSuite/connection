'use strict';

const mongoose = require('mongoose');

const { Project, ProjectToken, Player } = require('./../models');

module.exports = (app, logger, serviceName) => {
	// Connect to project by token
	app.get(`/${serviceName}/api/connect/:token`, (req, res) => {
		ProjectToken.findOne({ token: req.params.token }, (err, token) => {
			if (err) {
				return res.send({
					success: false,
					message: err
				});
			}
			if (token) {
				Project.findOne({ _id: token.projectId }, (err, project) => {
					if (err) {
						return res.send({
							success: false,
							message: err
						});
					}
					if (project) {
						logger.log({
							level: 'info',
							message: `Player successfully connected to project "${project.title}"`,
							ip: req.ip
						});
						return res.json({
							success: true,
							data: { title: project.title, id: project._id }
						});
					}

					return res.send({
						success: false,
						message: 'ERROR: Project not found'
					});
				});
			}
		});
	});

	// Save Player game
	app.post(`/${serviceName}/api/save`, (req, res, next) => {
		const { body } = req;
		const { query } = body;

		console.log(query);

		// let jsonData;

		// if (query) {
		// 	jsonData = JSON.parse(query);
		// } else {
		// 	return res.json({
		// 		success: false
		// 	});
		// }

		// if (!jsonData.playerName) {
		// 	return res.send({
		// 		success: false,
		// 		message: "Player can't be empty"
		// 	});
		// }

		// Player.findOne({ name: jsonData.playerName }, (err, player) => {
		// 	player.data = { points: 3, position: [ 0, 3, 1 ] };
		// 	player.save((err, currentPlayer) => {
		// 		if (err) {
		// 			return res.send({
		// 				success: false,
		// 				message: err
		// 			});
		// 		}

		// 		return res.send({
		// 			success: true,
		// 			data: currentPlayer
		// 		});
		// 	});
		// });
	});
};
