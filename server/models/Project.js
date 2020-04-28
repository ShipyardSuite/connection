'use strict';

const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const ProjectSchema = new mongoose.Schema({
	title: { type: String, required: true },
	creatorId: { type: ObjectId },
	team: [ { type: ObjectId } ],
	players: [ { type: ObjectId } ],
	lastEdited: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('Project', ProjectSchema);
