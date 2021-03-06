const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use('/chat', require('./chat'));

router.get('/', function(req, res) {
    res.redirect('/chat');
});

module.exports = router;
