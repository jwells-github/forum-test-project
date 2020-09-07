var express = require('express');
var router = express.Router();
var votingController = require('../controllers/votingController');

router.post('/comment/:commentID/:direction', votingController.comment_vote);

router.post('/post/:postID/:direction', votingController.post_vote);

module.exports = router;
