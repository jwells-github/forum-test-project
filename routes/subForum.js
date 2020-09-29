var express = require('express');
var router = express.Router();
var subForumController = require('../controllers/subForumController');

router.get('/create', subForumController.subForum_create_get);

router.post('/create', subForumController.subForum_create_post);

module.exports = router;
