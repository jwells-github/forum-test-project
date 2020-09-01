var express = require('express');
var router = express.Router();
var deletionController = require('../controllers/deletionController');

router.post('/comment/:commentID', deletionController.comment_delete);

router.post('/post/:postID', deletionController.post_delete);

module.exports = router;
