var express = require('express');
var router = express.Router();
var subForumDetailController = require('../controllers/subForumDetailController');
var postDetailController = require('../controllers/postDetailController');
var subForumModController = require('../controllers/subForumModController');
var searchController = require('../controllers/searchController');

router.get('/:subForumName', subForumDetailController.subForum_get);
router.get('/:subForumName/new', subForumDetailController.subForum_sorted_get);
router.get('/:subForumName/top', subForumDetailController.subForum_sorted_get);

router.get('/:subForumName/search', searchController.subforum_post_search_get)
router.post('/:subForumName/search', searchController.subforum_post_search_post)

router.get('/:subForumName/edit', subForumDetailController.subForum_edit_details_get);
router.post('/:subForumName/edit', subForumDetailController.subForum_edit_details_post);

router.get('/:subForumName/mod_access', subForumModController.mod_access_get);
router.post('/:subForumName/mod_access', subForumModController.mod_access_post);
router.post('/:subForumName/mod_access/ban/:username', subForumModController.mod_access_ban);
router.post('/:subForumName/mod_access/unban/:username', subForumModController.mod_access_unban);
router.post('/:subForumName/mod_access/mod_permissions', subForumModController.mod_permissions_post);
router.post('/:subForumName/mod_access/remove/:username', subForumModController.mod_remove);

router.get('/:subForumName/removed', subForumModController.removed_list_get);

router.get('/:subForumName/submit/text', subForumDetailController.subForum_text_form_get); 
router.post('/:subForumName/submit/text', subForumDetailController.subForum_post);

router.get('/:subForumName/submit/link', subForumDetailController.subForum_link_form_get);
router.post('/:subForumName/submit/link', subForumDetailController.subForum_post);

router.get('/:subForumName/:postID', postDetailController.post_get);
router.post('/:subForumName/:postID', postDetailController.post_comment_post);

module.exports = router;
