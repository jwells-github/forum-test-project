var express = require('express');
var router = express.Router();
var removalController = require('../controllers/removalController');

router.post('/comment/:subForumName/:commentID', removalController.comment_remove_toggle);

router.post('/post/:subForumName/:postID', removalController.post_remove_toggle);

module.exports = router;
