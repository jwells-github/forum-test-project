var express = require('express');
var router = express.Router();

var frontPageController = require('../controllers/frontPageController');

router.get('/', frontPageController.default_view_get);
router.get('/new',frontPageController.new_get);
router.get('/top',frontPageController.top_get);

module.exports = router;
