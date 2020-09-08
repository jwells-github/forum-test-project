var express = require('express');
var router = express.Router();
var removalController = require('../controllers/removalController');

router.post('/comment/:subreddit/:commentID', removalController.comment_remove_toggle);

router.post('/post/:subreddit/:postID', removalController.post_remove_toggle);

module.exports = router;
