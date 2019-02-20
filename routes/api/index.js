'use strict'

const router = require('express').Router();

router.get('/', function(req, res, next) {
    res.send('API call!');
});

module.exports = router;