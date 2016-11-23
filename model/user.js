const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	id: {
		type: Object
	},
	name: {
		type: String
	},
	age: {
		type: Number
	},
	manage: {
		type: Array
	}
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
