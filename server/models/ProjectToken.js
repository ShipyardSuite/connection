'use strict';

const mongoose = require('mongoose');
const token = require('crypto-token');

const { ObjectId } = require('mongodb');

const ProjectTokenSchema = new mongoose.Schema({
	projectId: { type: ObjectId, required: true },
	token: { type: String, required: true },
	timestamp: { type: Date, default: Date.now() },
	isDeleted: { type: Boolean, default: false }
});

ProjectTokenSchema.methods.generateToken = () => {
	return token(32);
};

module.exports = mongoose.model('ProjectToken', ProjectTokenSchema);
