var express = require('express');
var router = express.Router();
var subredditDetailController = require('../controllers/subredditDetailController');

router.get('/:subredditName', subredditDetailController.subreddit_get);


module.exports = router;
