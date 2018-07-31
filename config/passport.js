var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

module.exports = function(passport) {
    // Serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('register', new LocalStrategy({
        passReqToCallback : true // allow passing back the request to the callback
    },
    function(req, username, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

            // Check if user exists
            User.findOne({ 'username':  username }, function(err, user) {
                // Return errors if any
                if (err)
                    return done(err);

                // Check to see if there's already a user with that username
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'Username already exists.'));
                }
                else {
                    // Create user
                    var newUser = new User();

                    // Set credentials
                    newUser.username = username;
                    newUser.password = newUser.generateHash(password);

                    // Save user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        });
    }));

    passport.use('login', new LocalStrategy({
            passReqToCallback : true // allow passing back the request to the callback
    },
    function(req, username, password, done) {
        User.findOne({ 'username': username }, function(err, user) {
            // Return errors if any
            if (err)
                return done(err);

            // If no user was found or the password is incorrect
            if (!(user && user.validPassword(password)))
                return done(null, false, req.flash('loginMessage', 'Invalid credentials.')); // req.flash is the way to set flashdata using connect-flash

            // Successful login
            req.session.myuser = "worx";
            return done(null, user);
        });

    }));
}
