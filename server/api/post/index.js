'use strict';

var express = require('express');
var controller = require('./post.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/tags', auth.isAuthenticated(), controller.tags);
router.get('/ofwho/:userId', auth.isAuthenticated(), controller.listPostsOfWho);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/',auth.isAuthenticated(), controller.create);
router.post('/comment',auth.isAuthenticated(), controller.addComment);
router.post('/fav',auth.isAuthenticated(), controller.addOrRemoveLike);
router.put('/:id',auth.isAuthenticated(), controller.update);
router.patch('/:id',auth.isAuthenticated(), controller.update);
router.delete('/:id',auth.isAuthenticated(), controller.destroy);

module.exports = router;
