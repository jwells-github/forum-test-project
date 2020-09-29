var express = require('express');
var router = express.Router();
var removalController = require('../controllers/removalController');

router.post('/comment/:subForum/:commentID', removalController.comment_remove_toggle);

router.post('/post/:subForum/:postID', removalController.post_remove_toggle);

module.exports = router;
