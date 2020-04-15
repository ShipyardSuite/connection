'use strict';

const mongoose = require('mongoose');

const { Project, ProjectToken, Player } = require('./../models');

module.exports = (app, serviceName) => {
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

	// Login Player
	app.post(`/${serviceName}/api/login`, (req, res, next) => {
		const { body } = req;
		const { query } = body;

		let jsonData;

		if (query) {
			jsonData = JSON.parse(query);
		} else {
			return res.json({
				success: false
			});
		}

		if (!jsonData.playerName) {
			return res.send({
				success: false,
				message: "Player can't be empty"
			});
		}

		Player.findOne({ name: jsonData.playerName }, (err, player) => {
			if (err) {
				return res.send({
					success: false,
					message: err
				});
			}

			if (player !== null) {
				// Login existing player
				Project.findById(new mongoose.Types.ObjectId(jsonData.projectId), (err, project) => {
					if (project) {
						if (project.players.indexOf(new mongoose.Types.ObjectId(player._id)) > -1) {
							return res.json({
								success: true,
								data: player
							});
						} else {
							project.players.push(new mongoose.Types.ObjectId(player._id));
							project.save((err, currentProject) => {
								return res.json({
									success: true,
									data: player
								});
							});
						}
					} else {
					}
				});
			} else {
				// Create new Player
				const newPlayer = new Player();
				newPlayer.name = jsonData.playerName;
				newPlayer.save((err, player) => {
					Project.findById(new mongoose.Types.ObjectId(jsonData.projectId), (err, project) => {
						if (project) {
							project.players.push(new mongoose.Types.ObjectId(player._id));
							project.save((err, currentProject) => {
								return res.send({
									success: true,
									data: player
								});
							});
						}
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
