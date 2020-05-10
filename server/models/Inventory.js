'use strict';

const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
	title: { type: String, required: true },
	created: { type: Date, default: Date.now() },
	updated: { type: Date, default: Date.now() }
	//inventories
});

module.exports = mongoose.model('Inventory', InventorySchema);
