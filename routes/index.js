var express = require('express');
var router = express.Router();

var frontPageController = require('../controllers/frontPageController');

/* GET home page. */
router.get('/', frontPageController.default_view_get);

module.exports = router;
