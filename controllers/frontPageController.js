const Post = require("../models/post");
const PostUpvote = require("../models/votes/post_upvote");
const PostDownvote = require("../models/votes/post_downvote");
const async = require("async");

const getUserVotes = require('../public/javascripts/getUserVotes.js');

exports.default_view_get =  function(req, res, next) {
  async.parallel({
    posts: function(callback){
      Post.find()
      .sort({upvote_count :1})
      .populate('subForum')
      .populate('submitter')
      .exec(callback);
    },
    post_upvotes: function(callback){
      if(res.locals.currentUser){
        PostUpvote.find({submitter: res.locals.currentUser._id})
        .exec(callback);
      }
      else{ callback(null,[])}
    },
    post_downvotes: function(callback){
      if(res.locals.currentUser){
        PostDownvote.find({submitter: res.locals.currentUser._id})
        .exec(callback);
      }
      else{ callback(null,[])}
    }
  }, function(err,results){
    if(err){return next(err);}
    let posts = results.posts
    if(res.locals.currentUser){
      posts = getUserVotes(results.posts, results.post_upvotes, results.post_downvotes);
    }
    res.render('index', { title: 'Forum Project', posts:posts});
  })
  
}

exports.new_get = function(req,res,next){
  async.parallel({
    posts: function(callback){
      Post.find()
      .sort({date_created_at:-1})
      .populate('subForum')
      .populate('submitter')
      .exec(callback);
    },
    post_upvotes: function(callback){
      if(res.locals.currentUser){
        PostUpvote.find({submitter: res.locals.currentUser._id})
        .exec(callback);
      }
      else{ callback(null,[])}
    },
    post_downvotes: function(callback){
      if(res.locals.currentUser){
        PostDownvote.find({submitter: res.locals.currentUser._id})
        .exec(callback);
      }
      else{ callback(null,[])}
    }
  }, function(err,results){
    if(err){return next(err);}
    let posts = results.posts
    if(res.locals.currentUser){
      posts = getUserVotes(results.posts, results.post_upvotes, results.post_downvotes);
    }
    res.render('index', { title: 'Forum Project', posts:posts});
  })
}

