const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

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
        // Check if user exists
        User.findOne({ 'username':  username }, async function(err, user) {
            // Return errors if any
            if (err)
                return done(err);

            // Check to see if there's already a user with that username
            if (user) {
                return done(null, false, req.flash('signupMessage', 'Username already exists.'));
            }
            else {
                // Create user
                let newUser = new User();

                // Set credentials
                newUser.username = username;
                newUser.password = await newUser.generateHash(password);

                req.session.username = username;

                // Save user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }
        });
    }));

    passport.use('login', new LocalStrategy({
            passReqToCallback : true // allow passing back the request to the callback
    },
    function(req, username, password, done) {
        User.findOne({ 'username': username }, async function(err, user) {
            // Return errors if any
            if (err)
                return done(err);

            // If no user was found or the password is incorrect
            if (!(user && await user.validPassword(password)))
                return done(null, false, req.flash('loginMessage', 'Invalid credentials.')); // req.flash is the way to set flashdata using connect-flash

            // Successful login
            req.session.username = username;
            return done(null, user);
        });

    }));
}
