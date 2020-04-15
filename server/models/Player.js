'use strict';

const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const PlayerSchema = new mongoose.Schema({
	name: { type: String, required: true },
	lastUpdate: { type: Date },
	points: { type: String, default: 0 },
	/**
	 * @todo Add data element to PlayerSchema
	 * @body This element needs to be added to the PlayerSchema of the player-service.
	 */
	data: { type: Object, default: {} }
});

module.exports = mongoose.model('Player', PlayerSchema);
