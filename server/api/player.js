'use strict';

const mongoose = require('mongoose');

const { Project, Player } = require('./../models');

module.exports = (app, logger, serviceName) => {
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
};
