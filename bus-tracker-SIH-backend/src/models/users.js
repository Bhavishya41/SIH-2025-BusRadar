
const mongoose = require('mongoose');

const options = { discriminatorKey: 'role', collection: 'users' };

const baseUserSchema = new mongoose.Schema({
	role: {
		type: String,
		required: true,
        default: "driver",
		enum: ['driver', 'admin']
	}
}, options);

const User = mongoose.model('User', baseUserSchema);

// Driver schema
const driverSchema = new mongoose.Schema({
	driverId: {
		type: String,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true
	},
	busId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Bus',
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

// Admin schema
const adminSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	}
});

const Driver = User.discriminator('driver', driverSchema);
const Admin = User.discriminator('admin', adminSchema);

module.exports = { User, Driver, Admin };