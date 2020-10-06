var express = require('express');
var router = express.Router();

var frontPageController = require('../controllers/frontPageController');
var searchController = require('../controllers/searchController');

router.get('/', frontPageController.default_view_get);
router.get('/new',frontPageController.sorted_get);
router.get('/top',frontPageController.sorted_get);

router.get('/search', searchController.post_search_get)
router.post('/search', searchController.post_search_post)

module.exports = router;
