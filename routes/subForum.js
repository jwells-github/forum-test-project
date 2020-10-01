var express = require('express');
var router = express.Router();
var subForumController = require('../controllers/subForumController');
var searchController = require('../controllers/searchController');


router.get('/',subForumController.subForums_get);

router.get('/random',subForumController.random_subForum_get);

router.get('/create', subForumController.subForum_create_get);

router.post('/create', subForumController.subForum_create_post);

router.get('/search', searchController.subForum_search_get)

router.post('/search', searchController.subForum_search_post)

module.exports = router;
