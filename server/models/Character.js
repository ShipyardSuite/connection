'use strict';

const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
	name: { type: String, required: true },
	created: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Character', CharacterSchema);
