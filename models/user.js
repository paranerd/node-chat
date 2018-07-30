let mongoose = require('mongoose')

let UserSchema = new mongoose.Schema({
  name: String,
  password: String
})

module.exports = mongoose.model('users', UserSchema)

/*
You could also create custom methods here:
var User = mongoose.model('users', UserSchema);

var create = function(data, callback) {
    var newUser = new User(data);
    newUser.save();
};

module.exports = {
    create
};

The user-controller would require the model just like before but could now call User.create({}) for creating and saving in one call
*/
