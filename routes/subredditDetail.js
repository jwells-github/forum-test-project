var express = require('express');
var router = express.Router();
var subredditDetailController = require('../controllers/subredditDetailController');
var postDetailController = require('../controllers/postDetailController');

router.get('/:subredditName', subredditDetailController.subreddit_get);

router.get('/:subredditName/submit/text', subredditDetailController.subreddit_text_form_get); 

router.post('/:subredditName/submit/text', subredditDetailController.subreddit_post);

router.get('/:subredditName/submit/link', subredditDetailController.subreddit_link_form_get);

router.post('/:subredditName/submit/link', subredditDetailController.subreddit_post);

router.get('/:subredditName/:postID', postDetailController.post_get)

module.exports = router;
