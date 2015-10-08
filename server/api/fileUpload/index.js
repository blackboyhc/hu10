'use strict';

var express = require('express');
var controller = require('./fileUpload.controller');

var router = express.Router();


router.post('/', controller.upload);

module.exports = router;
