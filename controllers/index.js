var express = require('express');
var router = express.Router();

router.use('/user', require('./user'));
router.use('/chat', require('./chat'));

router.get('/', function(req, res) {
    //res.send('Home page');
    req.session.mytest = 'worx';
    res.send(req.session);
});

module.exports = router;
