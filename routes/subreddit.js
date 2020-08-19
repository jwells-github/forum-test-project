var express = require('express');
var router = express.Router();
var subredditController = require('../controllers/subredditController');

/* GET home page. */
router.get('/create', subredditController.subreddit_create_get);

router.post('/create', subredditController.subreddit_create_post);

module.exports = router;
