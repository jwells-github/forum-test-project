var express = require('express');
var router = express.Router();
const Post = require("../models/post");


/* GET home page. */
router.get('/', function(req, res, next) {
  Post.find()
  .sort({date_created_at:-1, upvote_count :1})
  .populate('subreddit')
  .exec(function(err,posts){
    res.render('index', { title: 'Express', posts:posts });
  })
});

module.exports = router;
