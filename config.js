const mongoose = require('mongoose');
const connect = mongoose.connect('mongodb://localhost:27017/cubex');

//check database connection
connect.then(() -> {
    console.log("Database connected successfully");
})
.catch(() -> {
    console.log("Database cannot be connected to");
});

// Create a registration Schema
const regSchema = new mongoose.schema({
	fullname: {
		type: string,
		required: true
	},
	uname: {
		type: string,
		required: true
	},
	email: {
		type: string,
		required: true
	},
	password: {
		type: string,
		required: true
	},
});

//collection part
const collection = new mongoose.model('gramsi', regSchema);

module.exports = collection;

