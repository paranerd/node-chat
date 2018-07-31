var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

router.get('/', isLoggedIn, function(req, res) {
    res.send('private area')
});

router.get('/register', function(req, res) {
    res.render('user/register', { message: req.flash('signupMessage') });
});

router.post('/register', passport.authenticate('register', {
    successRedirect: '/chat',
    failureRedirect: 'register',
    failureFlash: true
}));

router.get('/login', function(req, res) {
    res.render('user/login', { message: req.flash('loginMessage') });
});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/chat',
    failureRedirect: '/user/login',
    failureFlash: true
}));

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/user/login');
});

// Check if user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // User is logged in, go on
        return next();
    }

    // User is not logged in, redirect to login
    res.redirect('/user/login');
}

module.exports = router;
