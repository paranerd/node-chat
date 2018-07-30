var express = require('express');
var router = express.Router();
var User = require('../models/user');

router.get('/', function(req, res) {
    res.send("user root");
});

router.get('/register', function(req, res) {
    res.render('user/register');
});

router.post('/register', function(req, res) {
    User.findOne({name: req.body.username}, function(err, user) {
        if (err) throw err;

        if (user) {
            res.render('user/register', {error: 'User exists'});
        }
        else {
            var newUser = new User({name: req.body.username, password: req.body.password});
            newUser.save(function(err, done) {
                if (err) throw err;

                res.redirect('/chat')
            });
        }
    });
});

router.get('/login', function(req, res) {
    res.render('user/login', {});
});

router.post('/login', function(req, res) {
    User.findOne({name: req.body.username}, function(err, user) {
        if (err) throw err;

        if (user) {
            res.redirect('/chat')
        }
        else {
            res.redirect('register')
        }
    });
});

module.exports = router;
