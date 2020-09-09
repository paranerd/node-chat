const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    password: String
});

// Generating a hash
UserSchema.methods.generateHash = async function(password) {
    return await bcrypt.hash(password, saltRounds);
};

// Checking if password is valid
UserSchema.methods.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

UserSchema.statics.create = function(data) {
    const newUser = new this(data);
    newUser.save();
};

module.exports = mongoose.model('users', UserSchema)
