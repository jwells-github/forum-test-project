var express = require('express');
var router = express.Router();

var frontPageController = require('../controllers/frontPageController');

router.get('/', frontPageController.default_view_get);
router.get('/new',frontPageController.sorted_get);
router.get('/top',frontPageController.sorted_get);

module.exports = router;
