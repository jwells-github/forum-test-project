var express = require('express');
var router = express.Router();
var subForumDetailController = require('../controllers/subForumDetailController');
var postDetailController = require('../controllers/postDetailController');
var subForumModController = require('../controllers/subForumModController');

router.get('/:subForumName', subForumDetailController.subForum_get);
router.get('/:subForumName/new', subForumDetailController.subForum_sorted_get);
router.get('/:subForumName/top', subForumDetailController.subForum_sorted_get);

router.get('/:subForumName/mod_access', subForumModController.mod_access_get);

router.post('/:subForumName/mod_access', subForumModController.mod_access_post);

router.post('/:subForumName/mod_access/ban/:username', subForumModController.mod_access_ban);

router.post('/:subForumName/mod_access/unban/:username', subForumModController.mod_access_unban);

router.post('/:subForumName/mod_access/mod_permissions', subForumModController.mod_permissions_post)

router.get('/:subForumName/removed', subForumModController.removed_list_get);

router.get(':/subForumName/edit')

router.get('/:subForumName/submit/text', subForumDetailController.subForum_text_form_get); 

router.post('/:subForumName/submit/text', subForumDetailController.subForum_post);

router.get('/:subForumName/submit/link', subForumDetailController.subForum_link_form_get);

router.post('/:subForumName/submit/link', subForumDetailController.subForum_post);

router.get('/:subForumName/:postID', postDetailController.post_get);

router.post('/:subForumName/:postID', postDetailController.post_comment_post);

module.exports = router;
