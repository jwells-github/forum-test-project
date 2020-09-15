var express = require('express');
var router = express.Router();
var subredditDetailController = require('../controllers/subredditDetailController');
var postDetailController = require('../controllers/postDetailController');
var subredditModController = require('../controllers/subredditModController');

router.get('/:subredditName', subredditDetailController.subreddit_get);

router.get('/:subredditName/mod_access', subredditModController.mod_access_get);

router.post('/:subredditName/mod_access', subredditModController.mod_access_post);

router.post('/:subredditName/mod_access/mod_permissions', subredditModController.mod_permissions_post)

router.get('/:subredditName/removed', subredditModController.removed_list_get);

router.get(':/subredditName/edit')

router.get('/:subredditName/submit/text', subredditDetailController.subreddit_text_form_get); 

router.post('/:subredditName/submit/text', subredditDetailController.subreddit_post);

router.get('/:subredditName/submit/link', subredditDetailController.subreddit_link_form_get);

router.post('/:subredditName/submit/link', subredditDetailController.subreddit_post);

router.get('/:subredditName/:postID', postDetailController.post_get);

router.post('/:subredditName/:postID', postDetailController.post_comment_post);

module.exports = router;
