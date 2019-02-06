var mongoose = require('mongoose');

exports.RegisterSchema = new mongoose.Schema({
	name: String,
	mailid: String,
	inumber: { type: String, unique: true },
	message: String,
	status: String,
	regtime: { type: Number, default: (new Date()).getTime() },
	starttime: { type: Number, default: (new Date()).getTime() }
});